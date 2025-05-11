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
    path: "/ws/whisper"
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
            // Validate the mood
            const mood = MoodEnum.parse(data.mood);
            
            // Create an active user
            const activeUser = await storage.createActiveUser({
              socketId: wsWithId.id,
              mood,
              userId: null,
            });
            
            log(`User ${wsWithId.id} joined with mood: ${mood}`, "websocket");
            
            // Try to find a match
            const potentialMatches = await storage.getActiveUsersByMood(mood);
            
            // If there's at least one other user with the same mood (not this user)
            if (potentialMatches.length > 0 && potentialMatches[0].socketId !== wsWithId.id) {
              const match = potentialMatches[0];
              
              // Create a unique room name
              const roomName = `room_${nanoid(10)}`;
              
              // Create a match record
              const newMatch = await storage.createMatch({
                user1Id: wsWithId.id,
                user2Id: match.socketId,
                roomName,
                mood,
              });
              
              // Update both users to be matched
              await storage.updateActiveUserMatchStatus(wsWithId.id, true);
              await storage.updateActiveUserMatchStatus(match.socketId, true);
              
              // Find the WebSocket for the other user - properly cast the clients array
              const clients = Array.from(wss.clients) as WebSocketWithId[];
              const otherUserWs = clients.find(client => client.id === match.socketId);
              
              // Send match info to both clients
              if (otherUserWs) {
                const matchData = {
                  type: "matched",
                  roomName,
                  mood,
                };
                
                wsWithId.send(JSON.stringify(matchData));
                otherUserWs.send(JSON.stringify(matchData));
                
                log(`Matched users ${wsWithId.id} and ${match.socketId} in room ${roomName}`, "websocket");
              }
            } else {
              // No match found, send waiting message
              wsWithId.send(JSON.stringify({ type: "waiting", mood }));
              log(`User ${wsWithId.id} waiting for match with mood: ${mood}`, "websocket");
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
    });
  });
  
  // API endpoint to create and get Daily.co room
  app.post("/api/room", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        roomName: z.string(),
      });
      
      const { roomName } = schema.parse(req.body);
      log(`Creating Daily.co room: ${roomName}`, "api");
      
      const DAILY_API_KEY = process.env.DAILY_API_KEY;
      
      if (!DAILY_API_KEY) {
        throw new Error("Daily API key is not configured");
      }
      
      // Create a room using Daily.co API
      const createRoomResponse = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        },
        body: JSON.stringify({
          name: roomName,
          properties: {
            enable_prejoin_ui: false,
            enable_screenshare: false,
            enable_chat: false,
            start_video_off: true,
          }
        })
      });
      
      if (!createRoomResponse.ok) {
        const errorText = await createRoomResponse.text();
        log(`Daily API error: ${errorText}`, "api");
        
        // If room already exists, we'll just use it
        if (createRoomResponse.status === 409) {
          const dailyUrl = `https://whisper.daily.co/${roomName}`;
          
          // Create a meeting token for the room
          const createTokenResponse = await fetch('https://api.daily.co/v1/meeting-tokens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${DAILY_API_KEY}`
            },
            body: JSON.stringify({
              properties: {
                room_name: roomName,
                enable_screenshare: false,
                enable_chat: false,
                start_video_off: true,
              }
            })
          });
          
          if (!createTokenResponse.ok) {
            throw new Error(`Failed to create token: ${await createTokenResponse.text()}`);
          }
          
          const tokenData = await createTokenResponse.json();
          
          res.json({
            roomName,
            url: dailyUrl,
            token: tokenData.token,
          });
          
          log(`Using existing room: ${roomName}`, "api");
          return;
        }
        
        throw new Error(`Failed to create room: ${errorText}`);
      }
      
      const roomData = await createRoomResponse.json();
      
      // Create a meeting token for the room
      const createTokenResponse = await fetch('https://api.daily.co/v1/meeting-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DAILY_API_KEY}`
        },
        body: JSON.stringify({
          properties: {
            room_name: roomName,
            enable_screenshare: false,
            enable_chat: false,
            start_video_off: true,
          }
        })
      });
      
      if (!createTokenResponse.ok) {
        throw new Error(`Failed to create token: ${await createTokenResponse.text()}`);
      }
      
      const tokenData = await createTokenResponse.json();
      
      res.json({
        roomName,
        url: roomData.url,
        token: tokenData.token,
      });
      
      log(`Room created successfully: ${roomName}`, "api");
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ error: "Failed to create room" });
    }
  });
  
  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
