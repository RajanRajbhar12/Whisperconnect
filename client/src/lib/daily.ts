import DailyIframe from '@daily-co/daily-js';

// Initialize a Daily.co call
export async function initializeCall(roomName: string) {
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

  // Join the meeting
  await callFrame.join({
    url: `https://whisper.daily.co/${roomName}`,
    // In a real app, we'd get a token from the server
    // token: token
  });

  // Configure the call for voice only
  await callFrame.setLocalVideo(false);

  return callFrame;
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
