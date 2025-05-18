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
import AgoraToken from 'agora-token';

// Agora role constants
const RTC_ROLE = {
  PUBLISHER: 1,
  SUBSCRIBER: 2
} as const;

// Debug environment variables
console.log('Environment Variables Check:');
console.log('AGORA_APP_ID:', process.env.AGORA_APP_ID ? 'Set' : 'Not Set');
console.log('AGORA_APP_CERTIFICATE:', process.env.AGORA_APP_CERTIFICATE ? 'Set' : 'Not Set');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Type for WebSocket that includes an ID
type WebSocketWithId = WebSocket & {
  id: string;
}

// Agora configuration
const AGORA_APP_ID = process.env.AGORA_APP_ID || '';
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || '';

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws"
  });
  
  wss.on("connection", (ws: WebSocket) => {
    const wsWithId = ws as WebSocketWithId;
    wsWithId.id = nanoid();
    
    log(`New WebSocket connection: ${wsWithId.id}`, "websocket");
    
    wsWithId.send(JSON.stringify({ type: "connection", socketId: wsWithId.id }));
    
    wsWithId.on("message", async (message: Buffer | ArrayBuffer | Buffer[]) => {
      try {
        const msgString = message.toString();
        const data = JSON.parse(msgString);
        log(`Received message: ${JSON.stringify(data)}`, "websocket");
        
        switch (data.type) {
          case "join":
            try {
              const mood = MoodEnum.parse(data.mood);
              
              try {
                const existingUser = await storage.getActiveUser(wsWithId.id);
                if (existingUser) {
                  const userMatch = await storage.getMatchByUserSocketId(wsWithId.id);
                  if (userMatch) {
                    const otherUserId = userMatch.user1Id === wsWithId.id ? userMatch.user2Id : userMatch.user1Id;
                    await storage.updateActiveUserMatchStatus(otherUserId, false);
                    await storage.updateMatchEndTime(userMatch.id);
                    const clients = Array.from(wss.clients) as WebSocketWithId[];
                    const otherUserWs = clients.find(client => client.id === otherUserId);
                    if (otherUserWs) {
                      otherUserWs.send(JSON.stringify({ type: "callEnded" }));
                    }
                  }
                  await storage.removeActiveUser(wsWithId.id);
                }
              } catch (error) {
                console.error("Error cleaning up existing user:", error);
              }
              
              const activeUser = await storage.createActiveUser({
                socketId: wsWithId.id,
                mood,
                userId: null,
              });
              
              log(`User ${wsWithId.id} joined with mood: ${mood}`, "websocket");
              
              setTimeout(async () => {
                try {
                  const currentUser = await storage.getActiveUser(wsWithId.id);
                  if (!currentUser || currentUser.isMatched) return;
                  
                  const potentialMatches = await storage.getActiveUsersByMood(mood);
                  const availableMatches = potentialMatches.filter(
                    user => !user.isMatched && user.socketId !== wsWithId.id
                  );
                  
                  if (availableMatches.length > 0) {
                    const match = availableMatches[0];
                    const matchUser = await storage.getActiveUser(match.socketId);
                    if (!matchUser || matchUser.isMatched) {
                      wsWithId.send(JSON.stringify({ type: "waiting", mood }));
                      return;
                    }
                    
                    const roomName = `room_${nanoid(10)}`;
                    await storage.updateActiveUserMatchStatus(wsWithId.id, true);
                    await storage.updateActiveUserMatchStatus(match.socketId, true);
                    const newMatch = await storage.createMatch({
                      user1Id: wsWithId.id,
                      user2Id: match.socketId,
                      roomName,
                      mood,
                    });
                    
                    const clients = Array.from(wss.clients) as WebSocketWithId[];
                    const otherUserWs = clients.find(client => client.id === match.socketId);
                    
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
                      await storage.updateActiveUserMatchStatus(match.socketId, false);
                      await storage.updateActiveUserMatchStatus(wsWithId.id, false);
                      wsWithId.send(JSON.stringify({ type: "waiting", mood }));
                      log(`Match's WebSocket not open, user ${wsWithId.id} is now waiting`, "websocket");
                    }
                  } else {
                    wsWithId.send(JSON.stringify({ type: "waiting", mood }));
                    log(`User ${wsWithId.id} waiting for match with mood: ${mood}`, "websocket");
                  }
                } catch (error) {
                  console.error("Error finding match:", error);
                  wsWithId.send(JSON.stringify({ type: "error", message: "Error finding match" }));
                }
              }, 300);
            } catch (error) {
              console.error("Error processing join:", error);
              wsWithId.send(JSON.stringify({ type: "error", message: "Invalid mood" }));
            }
            break;
            
          case "leave":
            const userMatch = await storage.getMatchByUserSocketId(wsWithId.id);
            if (userMatch) {
              const otherUserId = userMatch.user1Id === wsWithId.id ? userMatch.user2Id : userMatch.user1Id;
              const clients = Array.from(wss.clients) as WebSocketWithId[];
              const otherUserWs = clients.find(client => client.id === otherUserId);
              if (otherUserWs) {
                otherUserWs.send(JSON.stringify({ type: "callEnded" }));
                log(`Sent callEnded to user ${otherUserId}`, "websocket");
              }
              await storage.updateMatchEndTime(userMatch.id);
              await storage.updateActiveUserMatchStatus(wsWithId.id, false);
              await storage.updateActiveUserMatchStatus(otherUserId, false);
              log(`Call ended between ${wsWithId.id} and ${otherUserId}`, "websocket");
            }
            await storage.removeActiveUser(wsWithId.id);
            log(`User ${wsWithId.id} left`, "websocket");
            break;
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
        wsWithId.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
      }
    });
    
    wsWithId.on("close", async () => {
      log(`WebSocket disconnected: ${wsWithId.id}`, "websocket");
      try {
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
        await storage.removeActiveUser(wsWithId.id);
      } catch (error) {
        console.error(`Error handling disconnect for user ${wsWithId.id}:`, error);
      }
    });
  });
  
  app.post("/api/webrtc-signal", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        roomName: z.string(),
        signal: z.any(),
        fromUser: z.string(),
        toUser: z.string().optional(),
      });
      const { roomName, signal, fromUser, toUser } = schema.parse(req.body);

      const clients = Array.from(wss.clients) as WebSocketWithId[];
      const recipient = clients.find(client => client.id === toUser);

      if (recipient && recipient.readyState === WebSocket.OPEN) {
        recipient.send(JSON.stringify({
          type: "webrtc-signal",
          signal,
          fromUser,
          roomName
        }));
        return res.json({ success: true });
      } else {
        return res.status(404).json({ error: "Recipient not found or disconnected" });
      }
    } catch (error) {
      console.error("WebRTC signaling error:", error);
      return res.status(400).json({ error: "Invalid signal payload" });
    }
  });

  app.post("/api/agora-token", async (req: Request, res: Response) => {
    try {
      console.log('Agora credentials:', {
        appId: AGORA_APP_ID ? 'Set' : 'Not Set',
        certificate: AGORA_APP_CERTIFICATE ? 'Set' : 'Not Set'
      });

      const { channelName, uid, role } = req.body;
      console.log('Token request:', { channelName, uid, role });

      if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
        console.error('Missing Agora credentials');
        return res.status(500).json({ error: 'Agora credentials not configured' });
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpiredTs = currentTimestamp + 3600; // 1 hour from now

      const token = AgoraToken.RtcTokenBuilder.buildTokenWithUid(
        AGORA_APP_ID,
        AGORA_APP_CERTIFICATE,
        channelName,
        uid,
        role === 'publisher' ? RTC_ROLE.PUBLISHER : RTC_ROLE.SUBSCRIBER,
        privilegeExpiredTs,
        privilegeExpiredTs
      );

      console.log('Token generated successfully');
      res.json({ token });
    } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).json({ error: 'Failed to generate token' });
    }
  });
  
  return httpServer;
}

// Generate Agora token for a user
function generateAgoraToken(uid: string, channel: string) {
  const currentTime = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTime + 3600; // 1 hour

  const token = AgoraToken.RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channel,
    uid,
    RTC_ROLE.PUBLISHER,
    privilegeExpiredTs,
    privilegeExpiredTs // Join channel privilege expiration time
  );

  return token;
}

