import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebSocketServer, WebSocket } from "ws";
import { 
  MoodEnum, 
  insertActiveUserSchema, 
  insertMatchSchema 
} from "@shared/schema";
import { nanoid } from "nanoid";
import { z } from "zod";
import { log } from "./vite";

// Type for WebSocket that includes an ID
type WebSocketWithId = WebSocket & {
  id: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Create WebSocket server with a specific path to avoid conflicts with Vite's WebSocket
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws"
  });
  
  // Handle WebSocket connections
  wss.on("connection", (ws: WebSocket) => {
    // Cast to our extended interface and add ID
    const wsWithId = ws as WebSocketWithId;
    wsWithId.id = nanoid();
    
    log(`New WebSocket connection: ${wsWithId.id}`, "websocket");
    
    // Send the socket ID to the client
    wsWithId.send(JSON.stringify({ type: "connection", socketId: wsWithId.id }));
    
    // Handle messages from clients
    wsWithId.on("message", async (message: Buffer | ArrayBuffer | Buffer[]) => {
      try {
        const msgString = message.toString();
        const data = JSON.parse(msgString);
        log(`Received message: ${JSON.stringify(data)}`, "websocket");
        
        switch (data.type) {
          case "join":
            try {
              // Validate the mood
              const mood = MoodEnum.parse(data.mood);
              
              // First make sure this user leaves any existing queue/match
              try {
                // Check if user already exists
                const existingUser = await storage.getActiveUser(wsWithId.id);
                if (existingUser) {
                  // Clean up any existing match
                  const userMatch = await storage.getMatchByUserSocketId(wsWithId.id);
                  
                  if (userMatch) {
                    const otherUserId = userMatch.user1Id === wsWithId.id ? userMatch.user2Id : userMatch.user1Id;
                    // Set other user to unmatched
                    await storage.updateActiveUserMatchStatus(otherUserId, false);
                    // End match
                    await storage.updateMatchEndTime(userMatch.id);
                    
                    // Notify other user if they're still connected
                    const clients = Array.from(wss.clients) as WebSocketWithId[];
                    const otherUserWs = clients.find(client => client.id === otherUserId);
                    if (otherUserWs) {
                      otherUserWs.send(JSON.stringify({ type: "callEnded" }));
                    }
                  }
                  
                  // Remove from active users
                  await storage.removeActiveUser(wsWithId.id);
                }
              } catch (error) {
                console.error("Error cleaning up existing user:", error);
                // Continue anyway
              }
              
              // Create a new active user
              const activeUser = await storage.createActiveUser({
                socketId: wsWithId.id,
                mood,
                userId: null,
              });
              
              log(`User ${wsWithId.id} joined with mood: ${mood}`, "websocket");
              
              // Try to find a match with a small delay to avoid race conditions
              setTimeout(async () => {
                try {
                  // Fetch this user to make sure they're still active
                  const currentUser = await storage.getActiveUser(wsWithId.id);
                  if (!currentUser || currentUser.isMatched) {
                    // User is no longer active or already matched
                    return;
                  }
                  
                  // Get all users with the same mood
                  const potentialMatches = await storage.getActiveUsersByMood(mood);
                  
                  // Filter out users that are already matched and the current user
                  const availableMatches = potentialMatches.filter(
                    user => !user.isMatched && user.socketId !== wsWithId.id
                  );
                  
                  // If there's at least one available user with the same mood
                  if (availableMatches.length > 0) {
                    const match = availableMatches[0];
                    
                    // Double-check the match is still available
                    const matchUser = await storage.getActiveUser(match.socketId);
                    if (!matchUser || matchUser.isMatched) {
                      // Match is no longer available, send waiting message
                      wsWithId.send(JSON.stringify({ type: "waiting", mood }));
                      return;
                    }
                    
                    // Create a unique room name
                    const roomName = `room_${nanoid(10)}`;
                    
                    // Update both users to be matched first to prevent race conditions
                    await storage.updateActiveUserMatchStatus(wsWithId.id, true);
                    await storage.updateActiveUserMatchStatus(match.socketId, true);
                    
                    // Create a match record
                    const newMatch = await storage.createMatch({
                      user1Id: wsWithId.id,
                      user2Id: match.socketId,
                      roomName,
                      mood,
                    });
                    
                    // Find the WebSocket for the other user
                    const clients = Array.from(wss.clients) as WebSocketWithId[];
                    const otherUserWs = clients.find(client => client.id === match.socketId);
                    
                    // Send match info to both clients
                    if (otherUserWs && otherUserWs.readyState === WebSocket.OPEN) {
                      const matchData = {
                        type: "matched",
                        roomName,
                        mood,
                        otherUserId: match.socketId
                      };
                      
                      const otherMatchData = {
                        type: "matched",
                        roomName,
                        mood,
                        otherUserId: wsWithId.id
                      };
                      
                      wsWithId.send(JSON.stringify(matchData));
                      otherUserWs.send(JSON.stringify(otherMatchData));
                      
                      log(`Matched users ${wsWithId.id} and ${match.socketId} in room ${roomName}`, "websocket");
                    } else {
                      // Other user's WebSocket not found or not open, mark them as unmatched
                      await storage.updateActiveUserMatchStatus(match.socketId, false);
                      await storage.updateActiveUserMatchStatus(wsWithId.id, false);
                      
                      // Send waiting message
                      wsWithId.send(JSON.stringify({ type: "waiting", mood }));
                      log(`Match's WebSocket not open, user ${wsWithId.id} is now waiting`, "websocket");
                    }
                  } else {
                    // No match found, send waiting message
                    wsWithId.send(JSON.stringify({ type: "waiting", mood }));
                    log(`User ${wsWithId.id} waiting for match with mood: ${mood}`, "websocket");
                  }
                } catch (error) {
                  console.error("Error finding match:", error);
                  wsWithId.send(JSON.stringify({ type: "error", message: "Error finding match" }));
                }
              }, 300); // Short delay to avoid race conditions
            } catch (error) {
              console.error("Error processing join:", error);
              wsWithId.send(JSON.stringify({ type: "error", message: "Invalid mood" }));
            }
            break;
            
          case "leave":
            // Get the user's match if any
            const userMatch = await storage.getMatchByUserSocketId(wsWithId.id);
            
            if (userMatch) {
              // Find the WebSocket for the other user
              const otherUserId = userMatch.user1Id === wsWithId.id ? userMatch.user2Id : userMatch.user1Id;
              const clients = Array.from(wss.clients) as WebSocketWithId[];
              const otherUserWs = clients.find(client => client.id === otherUserId);
              
              // Send call ended message to the other user
              if (otherUserWs) {
                otherUserWs.send(JSON.stringify({ type: "callEnded" }));
                log(`Sent callEnded to user ${otherUserId}`, "websocket");
              }
              
              // Update match end time
              await storage.updateMatchEndTime(userMatch.id);
              
              // Update both users to be unmatched
              await storage.updateActiveUserMatchStatus(wsWithId.id, false);
              await storage.updateActiveUserMatchStatus(otherUserId, false);
              
              log(`Call ended between ${wsWithId.id} and ${otherUserId}`, "websocket");
            }
            
            // Remove the user from active users
            await storage.removeActiveUser(wsWithId.id);
            log(`User ${wsWithId.id} left`, "websocket");
            break;
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        wsWithId.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });
    
    // Handle disconnections
    wsWithId.on("close", async () => {
      log(`WebSocket disconnected: ${wsWithId.id}`, "websocket");
      
      try {
        // Handle the same cleanup as in the "leave" case
        const userMatch = await storage.getMatchByUserSocketId(wsWithId.id);
        
        if (userMatch) {
          const otherUserId = userMatch.user1Id === wsWithId.id ? userMatch.user2Id : userMatch.user1Id;
          const clients = Array.from(wss.clients) as WebSocketWithId[];
          const otherUserWs = clients.find(client => client.id === otherUserId);
          
          if (otherUserWs) {
            otherUserWs.send(JSON.stringify({ type: "callEnded" }));
            log(`Sent callEnded to user ${otherUserId} due to disconnect`, "websocket");
          }
          
          await storage.updateMatchEndTime(userMatch.id);
          await storage.updateActiveUserMatchStatus(otherUserId, false);
          log(`Match ended due to disconnect: ${userMatch.id}`, "websocket");
        }
        
        // Remove from active users
        await storage.removeActiveUser(wsWithId.id);
      } catch (error) {
        console.error(`Error handling disconnect for user ${wsWithId.id}:`, error);
      }
    });
  });
  
  // WebRTC signaling for direct browser-to-browser voice calls
  app.post("/api/webrtc-signal", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        roomName: z.string(),
        signal: z.any(),
        fromUser: z.string(),
        toUser: z.string().optional(),
      });
      
      const { roomName, signal, fromUser, toUser } = schema.parse(req.body);
      log(`Received WebRTC signal in room ${roomName}`, "api");
      
      // If a specific target user is provided, send only to them
      if (toUser) {
        const clients = Array.from(wss.clients) as WebSocketWithId[];
        const targetClient = clients.find(client => client.id === toUser);
        
        if (targetClient && targetClient.readyState === WebSocket.OPEN) {
          targetClient.send(JSON.stringify({
            type: "webrtc-signal",
            roomName,
            signal,
            fromUser
          }));
          log(`Sent WebRTC signal to specific user ${toUser}`, "api");
        } else {
          log(`Target user ${toUser} not found or connection not open`, "api");
        }
      } else {
        // Otherwise, broadcast to all users in the room (except sender)
        const match = await storage.getMatchByUserSocketId(fromUser);
        
        if (!match) {
          log(`No match found for user ${fromUser}`, "api");
          return res.status(404).json({ error: "No active match found" });
        }
        
        // Get other user ID
        const otherUserId = match.user1Id === fromUser ? match.user2Id : match.user1Id;
        
        // Find websocket for other user
        const clients = Array.from(wss.clients) as WebSocketWithId[];
        const otherUserWs = clients.find(client => client.id === otherUserId);
        
        if (otherUserWs && otherUserWs.readyState === WebSocket.OPEN) {
          otherUserWs.send(JSON.stringify({
            type: "webrtc-signal",
            roomName,
            signal,
            fromUser
          }));
          log(`Sent WebRTC signal to matching user ${otherUserId}`, "api");
        } else {
          log(`Other user ${otherUserId} not found or connection not open`, "api");
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error handling WebRTC signal:", error);
      res.status(500).json({ error: "Failed to process WebRTC signal" });
    }
  });
  
  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
