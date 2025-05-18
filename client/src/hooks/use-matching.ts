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
    // Function to set up WebSocket
    const setupWebSocket = () => {
      try {
        // Get the host and port from the current location
        const isLocalhost = window.location.hostname === 'localhost';

        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        
        // For Render deployment - use the current hostname
        const host = isLocalhost ? 'localhost:5000' : window.location.host;
        const wsUrl = `${wsProtocol}://${host}/ws`;

        console.log('Attempting WebSocket connection to:', wsUrl);
        const socket = new WebSocket(wsUrl);

        socketRef.current = socket;

        socket.addEventListener('open', () => {
          console.log('WebSocket connection established');
          setConnectionStatus('connecting');
        });

        socket.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            switch (data.type) {
              case 'connection':
                setSocketId(data.socketId);
                // Store socket ID in session storage for WebRTC
                sessionStorage.setItem('socketId', data.socketId);
                break;

              case 'waiting':
                setConnectionStatus('waiting');
                setSelectedMood(data.mood as Mood);
                break;

              case 'matched':
                setConnectionStatus('matched');
                setRoomName(data.roomName);
                // Store the other user's ID for WebRTC
                sessionStorage.setItem('otherUserId', data.otherUserId);
                break;

              case 'webrtc-signal':
                // Handle WebRTC signaling
                const rtcSignalEvent = new CustomEvent('webrtc-signal', {
                  detail: {
                    signal: data.signal,
                    fromUser: data.fromUser
                  }
                });
                window.dispatchEvent(rtcSignalEvent);
                break;

              case 'callEnded':
                // The other person ended the call
                window.location.href = '/';
                break;

              case 'error':
                console.error('Server error:', data.message);
                break;
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        });

        socket.addEventListener('close', (event) => {
          console.log('WebSocket connection closed with code:', event.code);
          setConnectionStatus('disconnected');
          socketRef.current = null;

          // Attempt to reconnect after a delay, unless this was an intentional close
          if (event.code !== 1000) {
            console.log('Attempting to reconnect...');
            setTimeout(setupWebSocket, 2000);
          }
        });

        socket.addEventListener('error', (error) => {
          console.error('WebSocket error:', error);
          // Don't set disconnected here, the close event will fire after this
        });
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        // If there's an error in setup, try again after a delay
        setTimeout(setupWebSocket, 2000);
      }
    };

    // Create WebSocket connection only once
    if (!socketRef.current) {
      setupWebSocket();
    }

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        if (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING) {
          // Send a leave message before closing
          if (socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ type: 'leave' }));
          }
          socketRef.current.close(1000); // Normal closure
        }
        socketRef.current = null;
      }
    };
  }, []);

  // Join matching queue with the selected mood
  const joinMatchingQueue = useCallback((mood: Mood) => {
    // Always set the selected mood
    setSelectedMood(mood);

    // Function to send join request
    const sendJoinRequest = () => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log(`Joining queue with mood: ${mood}`);
        socketRef.current.send(JSON.stringify({
          type: 'join',
          mood
        }));
        return true;
      }
      return false;
    };

    // First leave any existing queue if we have an open socket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'leave' }));
      
      // Short delay to ensure the leave command is processed
      setTimeout(() => {
        // If sending join request fails, retry
        if (!sendJoinRequest()) {
          console.log('Socket not ready after leave, retrying in 700ms...');
          setTimeout(() => joinMatchingQueue(mood), 700);
        }
      }, 200);
    } else {
      // If socket isn't ready yet, retry in a bit
      console.log('Socket not ready, retrying in 700ms...');
      setTimeout(() => joinMatchingQueue(mood), 700);
    }
  }, []);

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
