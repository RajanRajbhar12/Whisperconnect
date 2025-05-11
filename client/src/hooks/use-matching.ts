import { useState, useEffect, useCallback, useRef } from 'react';
import { Mood } from '@shared/schema';

type ConnectionStatus = 'disconnected' | 'connecting' | 'waiting' | 'matched';

export function useMatching() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [socketId, setSocketId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    // Create WebSocket connection only once
    if (!socketRef.current) {
      // Get the host from the current location
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      // Connect to our specific WebSocket path
      const socket = new WebSocket(`${wsProtocol}//${host}/ws/whisper`);
      
      socketRef.current = socket;
      
      socket.addEventListener('open', () => {
        console.log('WebSocket connection established');
        setConnectionStatus('connecting');
      });
      
      socket.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connection':
              setSocketId(data.socketId);
              break;
              
            case 'waiting':
              setConnectionStatus('waiting');
              setSelectedMood(data.mood as Mood);
              break;
              
            case 'matched':
              setConnectionStatus('matched');
              setRoomName(data.roomName);
              break;
              
            case 'callEnded':
              // The other person ended the call
              window.location.href = '/';
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      socket.addEventListener('close', () => {
        console.log('WebSocket connection closed');
        setConnectionStatus('disconnected');
        socketRef.current = null;
      });
      
      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        socketRef.current = null;
      });
    }
    
    // Clean up on unmount
    return () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  // Join matching queue with the selected mood
  const joinMatchingQueue = useCallback((mood: Mood) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && socketId) {
      setSelectedMood(mood);
      socketRef.current.send(JSON.stringify({
        type: 'join',
        mood
      }));
    } else {
      // If socket isn't ready yet, retry in a bit
      setTimeout(() => joinMatchingQueue(mood), 500);
    }
  }, [socketId]);

  // Cancel matching
  const cancelMatching = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'leave'
      }));
      setConnectionStatus('disconnected');
      setSelectedMood(null);
      setRoomName(null);
    }
  }, []);

  // End call
  const endCall = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'leave'
      }));
      setConnectionStatus('disconnected');
      setSelectedMood(null);
      setRoomName(null);
    }
  }, []);

  return {
    connectionStatus,
    socketId,
    roomName,
    selectedMood,
    joinMatchingQueue,
    cancelMatching,
    endCall
  };
}
