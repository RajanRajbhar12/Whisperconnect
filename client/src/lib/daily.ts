import DailyIframe from '@daily-co/daily-js';
import { apiRequest } from './queryClient';

// Initialize a Daily.co call
export async function initializeCall(roomName: string) {
  try {
    // First, get a token from our server
    const response = await apiRequest('POST', '/api/room', { roomName });
    const data = await response.json();
    
    console.log('Created Daily.co room:', data);
    
    // Create the iframe for the call
    const callFrame = DailyIframe.createFrame({
      showLeaveButton: false,
      showFullscreenButton: false,
      showParticipantsBar: false,
      showUserNameChangeUI: false,
      customTrayButtons: {},
      iframeStyle: {
        position: 'absolute', 
        width: '0',
        height: '0',
        border: '0'
      }
    });

    // Join the meeting with the token from our server
    await callFrame.join({
      url: data.url,
      token: data.token
    });

    // Configure the call for voice only
    await callFrame.setLocalVideo(false);

    return callFrame;
    
  } catch (error) {
    console.error('Error initializing Daily.co call:', error);
    
    // Check if this is an API key error
    if (error instanceof Error) {
      if (error.message.includes('API key') || 
          error.message.includes('401') || 
          error.message.includes('500')) {
        throw new Error('Voice call service needs configuration (API key issue)');
      }
    }
    
    throw error;
  }
}

// Leave a Daily.co call
export function leaveCall(callFrame: any) {
  try {
    callFrame.leave();
    callFrame.destroy();
  } catch (error) {
    console.error("Error leaving call:", error);
  }
}
