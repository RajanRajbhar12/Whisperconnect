import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useMatching } from "@/hooks/use-matching";
import { Mood, MoodEnum } from "@shared/schema";
import { WebRTCVoiceCall } from "@/lib/webrtc";

const VoiceCallScreen = () => {
  const params = useParams<{ roomName: string; mood: Mood }>();
  const [, navigate] = useLocation();
  const { endCall } = useMatching();
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [audioVisualizer, setAudioVisualizer] = useState<number[]>([2, 4, 3, 5, 2.5]);
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const rtcCallRef = useRef<WebRTCVoiceCall | null>(null);
  
  const roomName = params.roomName;
  const mood = params.mood as Mood;
  
  useEffect(() => {
    // Validate the mood parameter
    try {
      MoodEnum.parse(mood);
    } catch (error) {
      // Invalid mood, redirect to mood selection
      navigate("/mood");
      return;
    }
    
    // Initialize WebRTC call
    async function setupCall() {
      setIsConnecting(true);
      
      try {
        // Get the other user ID from sessionStorage
        const otherUserId = sessionStorage.getItem('otherUserId');
        const socketId = sessionStorage.getItem('socketId');
        
        if (!otherUserId || !socketId) {
          throw new Error('Missing connection information');
        }
        
        // Create WebRTC call instance
        const rtcCall = new WebRTCVoiceCall(roomName, socketId, otherUserId);
        rtcCallRef.current = rtcCall;
        
        // Set up volume change handler for audio visualization
        rtcCall.setVolumeChangeCallback((volume) => {
          // Create a dynamic visualization based on volume
          const maxHeight = 5; // max height in rem
          const minHeight = 1; // min height in rem
          
          const newHeights = Array(5).fill(0).map(() => {
            const randomFactor = 0.5 + Math.random();
            const heightValue = minHeight + ((volume / 100) * (maxHeight - minHeight) * randomFactor);
            return Math.min(maxHeight, heightValue);
          });
          
          setAudioVisualizer(newHeights);
        });
        
        // Listen for WebRTC signaling events
        const handleSignal = (event: Event) => {
          const customEvent = event as CustomEvent;
          if (rtcCallRef.current) {
            rtcCallRef.current.processSignal(customEvent.detail.signal);
          }
        };
        
        window.addEventListener('webrtc-signal', handleSignal);
        
        // Initialize local audio stream (microphone)
        await rtcCall.initLocalStream();
        
        // Start the call - one side will be caller, the other will be receiver
        // We'll use a simple comparison of IDs to decide who initiates
        if (socketId < otherUserId) {
          // This user is the caller
          await rtcCall.startCall();
        }
        // If not the caller, just wait for the offer (handled in processSignal)
        
        // Set up call timer
        callIntervalRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        setIsConnecting(false);
        
        // Clean up function
        return () => {
          window.removeEventListener('webrtc-signal', handleSignal);
        };
      } catch (error: any) {
        console.error("Failed to initialize call:", error);
        
        if (error.message && error.message.includes("Could not access microphone")) {
          setError("Microphone access is required. Please grant permission to use your microphone.");
        } else {
          setError("Could not connect to the call. Please try again.");
        }
        
        setIsConnecting(false);
      }
    }
    
    setupCall();
    
    return () => {
      // Clean up when component unmounts
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
      
      if (rtcCallRef.current) {
        rtcCallRef.current.endCall();
      }
    };
  }, [roomName, mood, navigate]);
  
  const handleToggleMute = () => {
    if (rtcCallRef.current) {
      const newMuteState = !isMuted;
      rtcCallRef.current.toggleMute(newMuteState);
      setIsMuted(newMuteState);
    }
  };
  
  const handleEndCall = () => {
    // Clear interval
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current);
    }
    
    // End the WebRTC call
    if (rtcCallRef.current) {
      rtcCallRef.current.endCall();
    }
    
    // Tell the server the call has ended
    endCall();
    
    // Navigate back to home
    navigate("/");
  };
  
  // Format the call duration as MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-between px-4 py-8 md:py-16">
        <div className="container mx-auto max-w-4xl h-full flex flex-col">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-light mb-2 text-[#424242]">
              You're connected with someone feeling <span className="text-[hsl(var(--whisper-blue))] font-medium">{mood}</span>
            </h2>
            <p className="text-[#424242]/70 text-sm italic">
              "Be kind, you never know who's on the other side."
            </p>
          </div>
          
          <div className="flex-grow flex items-center justify-center mb-12">
            {/* Peaceful, abstract background */}
            <div 
              className="relative bg-cover bg-center rounded-xl w-full h-64 md:h-80 lg:h-96 shadow-lg flex items-center justify-center" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" 
              }}
            >
              <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
              
              {isConnecting && (
                <div className="relative p-8 bg-white/90 rounded-xl shadow-lg text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-[hsl(var(--whisper-purple))] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium mb-2">Connecting your call...</h3>
                  <p className="text-gray-600">Please wait while we set up your voice connection</p>
                </div>
              )}
              
              {error && (
                <div className="relative p-8 bg-white/90 rounded-xl shadow-lg text-center max-w-md">
                  <div className="text-5xl mb-4">😢</div>
                  <h3 className="text-lg font-medium mb-2">Connection Issue</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      className="bg-[hsl(var(--whisper-blue))] text-white"
                      onClick={() => navigate("/mood")}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
              
              {!isConnecting && !error && (
                <div className="relative flex space-x-4 items-center">
                  <div className="bg-white/90 w-24 h-24 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-5xl">🎙️</div>
                  </div>
                  <div id="audio-visualizer" className="flex items-center space-x-1">
                    {audioVisualizer.map((height, index) => (
                      <div 
                        key={index} 
                        className="audio-visualizer-bar" 
                        style={{ 
                          height: `${height}rem`, 
                          animationDelay: `${index * 0.05}s` 
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {!error && !isConnecting && (
            <>
              <div className="flex justify-center space-x-4">
                <Button
                  className={`rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1 ${
                    isMuted ? "bg-gray-400 text-white" : "bg-[hsl(var(--whisper-blue))] text-white"
                  }`}
                  onClick={handleToggleMute}
                >
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  )}
                </Button>
                
                <Button 
                  className="bg-[hsl(var(--whisper-pink))] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={handleEndCall}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
                    <line x1="23" y1="1" x2="1" y2="23"></line>
                  </svg>
                </Button>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-[#424242]/70 text-sm">
                  Connected for <span id="call-duration">{formatDuration(callDuration)}</span>
                </p>
              </div>
            </>
          )}
          
          {error && (
            <div className="flex justify-center mt-8">
              <Button 
                className="bg-[hsl(var(--whisper-purple))] text-white rounded-full px-8"
                onClick={() => navigate("/mood")}
              >
                Return to Mood Selection
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default VoiceCallScreen;
