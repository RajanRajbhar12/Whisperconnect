import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { MoodEnum } from '@shared/schema';
import { AgoraVoiceCall } from '../lib/agora';
import { useMatching } from '../hooks/use-matching';
import { motion, AnimatePresence } from 'framer-motion';

const Particle = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <motion.div
    className={`absolute w-1 h-1 rounded-full ${color}`}
    initial={{ x, y, opacity: 0 }}
    animate={{
      y: y - 100,
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const VoiceCallScreen = () => {
  const [, setLocation] = useLocation();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [audioVisualizer, setAudioVisualizer] = useState<number[]>([0, 0, 0, 0, 0]);
  const [showControls, setShowControls] = useState(true);
  const rtcCallRef = useRef<AgoraVoiceCall | null>(null);
  const callIntervalRef = useRef<number | null>(null);
  const noAudioTimeoutRef = useRef<number | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const { endCall } = useMatching();
  const [particles, setParticles] = useState<{ x: number; y: number; color: string }[]>([]);
  const [isHoveringMute, setIsHoveringMute] = useState(false);
  const [isHoveringEnd, setIsHoveringEnd] = useState(false);

  // Get mood from URL
  const params = new URLSearchParams(window.location.search);
  const mood = params.get('mood') as string;

  const getMoodColor = (mood: string) => {
    switch(mood) {
      case "happy": return "from-[#FF9E64] to-[#FFB347]";
      case "sad": return "from-[#B76E79] to-[#E6B0AA]";
      case "anxious": return "from-[#FF9E64] to-[#B76E79]";
      case "tired": return "from-[#B76E79] to-[#E6B0AA]";
      case "lonely": return "from-[#FF9E64] to-[#B76E79]";
      default: return "from-[#FF9E64] to-[#B76E79]";
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch(mood) {
      case "happy": return "😊";
      case "sad": return "😞";
      case "anxious": return "😰";
      case "tired": return "😴";
      case "lonely": return "🥺";
      default: return "🌿";
    }
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Get roomName and mood from URL
    const params = new URLSearchParams(window.location.search);
    const roomName = params.get('roomName');
    const mood = params.get('mood');

    // Validate the mood parameter
    try {
      if (!mood) throw new Error('No mood specified');
      MoodEnum.parse(mood);
    } catch (error) {
      // Invalid mood, redirect to mood selection
      setLocation("/mood");
      return;
    }
    
    // Handle remote user leaving or disconnecting
    const handleUserLeft = () => {
      console.log("Remote user left the call");
      // Show notification and end the call after a delay
      setError("The other person has left the call");
      setTimeout(() => {
        handleEndCall();
      }, 3000);
    };
    
    const handleConnectionLost = () => {
      console.log("Connection to Agora was lost");
      setError("Connection lost. The call will end soon.");
      setTimeout(() => {
        handleEndCall();
      }, 3000);
    };
    
    // Add event listeners for custom Agora events
    window.addEventListener('agora-user-left', handleUserLeft);
    window.addEventListener('agora-connection-lost', handleConnectionLost);
    
    // Initialize Agora call
    async function setupCall() {
      setIsConnecting(true);
      
      try {
        // Get the other user ID from sessionStorage
        const otherUserId = sessionStorage.getItem('otherUserId');
        const socketId = sessionStorage.getItem('socketId');
        
        if (!otherUserId || !socketId || !roomName) {
          throw new Error('Missing connection information');
        }

        console.log("Setting up call with:", {
          roomName,
          socketId,
          otherUserId
        });

        // Create a numeric uid from the socketId (Agora sometimes works better with numeric UIDs)
        const numericUid = Math.floor(Math.random() * 100000);

        // Create Agora call instance
        const agoraCall = new AgoraVoiceCall(
          roomName,
          numericUid.toString()
        );
        rtcCallRef.current = agoraCall;
        
        // Initialize default audio visualizer with minimal heights
        setAudioVisualizer([0.5, 0.5, 0.5, 0.5, 0.5]);
        
        // Set up volume change handler for audio visualization
        agoraCall.setVolumeChangeCallback((volume) => {
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
        
        // Initialize local audio stream (microphone)
        await agoraCall.initLocalStream();
        
        try {
          // Try to join without token first
          await agoraCall.joinChannel(null);
          
          // Clear any previous audio detection timeout
          if (noAudioTimeoutRef.current) {
            clearTimeout(noAudioTimeoutRef.current);
          }
          
          // Set a more generous 10-second timeout for audio detection
          noAudioTimeoutRef.current = window.setTimeout(() => {
            // Only show the error if we're still connected and there's no audio
            if (audioVisualizer.every(height => height <= 0.5)) {
              console.log("Limited audio detected after 10 seconds, showing hint");
              setError("Limited audio detected. Please check your microphone and speaker settings, but you can continue with the call.");
              
              // Don't end the call, just show a warning
              setTimeout(() => {
                setError(null);
              }, 5000);
            }
          }, 10000);
          
        } catch (joinError) {
          console.error("Failed to join without token:", joinError);
          
          // If joining without token fails, try with token
          try {
            // Get Agora token
            const tokenResponse = await fetch('/api/agora-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                channelName: roomName,
                uid: numericUid.toString(),
                role: 'publisher'
              })
            });

            if (!tokenResponse.ok) {
              throw new Error('Failed to get Agora token');
            }

            const { token } = await tokenResponse.json();
            await agoraCall.joinChannel(token);
            
            // Set the audio timeout check as above
            if (noAudioTimeoutRef.current) {
              clearTimeout(noAudioTimeoutRef.current);
            }
            
            noAudioTimeoutRef.current = window.setTimeout(() => {
              if (audioVisualizer.every(height => height <= 0.5)) {
                console.log("Limited audio detected after 10 seconds, showing hint");
                setError("Limited audio detected. Please check your microphone and speaker settings, but you can continue with the call.");
                
                setTimeout(() => {
                  setError(null);
                }, 5000);
              }
            }, 10000);
          } catch (tokenError: unknown) {
            const errorMessage = tokenError instanceof Error ? tokenError.message : 'Unknown error';
            throw new Error(`Token auth failed: ${errorMessage}`);
          }
        }
        
        // Set up call timer
        callIntervalRef.current = window.setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
        
        setIsConnecting(false);
      } catch (error: any) {
        console.error("Failed to initialize call:", error);
        
        if (error.message && error.message.includes("Could not access microphone")) {
          setError("Microphone access is required. Please grant permission to use your microphone.");
        } else {
          setError(`Could not connect to the call: ${error.message}`);
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
      
      if (noAudioTimeoutRef.current) {
        clearTimeout(noAudioTimeoutRef.current);
      }
      
      if (rtcCallRef.current) {
        rtcCallRef.current.leaveChannel();
      }
      
      // Remove event listeners
      window.removeEventListener('agora-user-left', handleUserLeft);
      window.removeEventListener('agora-connection-lost', handleConnectionLost);
    };
  }, [setLocation]);
  
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
    
    if (noAudioTimeoutRef.current) {
      clearTimeout(noAudioTimeoutRef.current);
    }
    
    // End the Agora call
    if (rtcCallRef.current) {
      rtcCallRef.current.leaveChannel();
    }
    
    // Tell the server the call has ended
    endCall();
    
    // Navigate back to home
    setLocation("/");
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add particle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        if (newParticles.length > 20) newParticles.shift();
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: window.innerHeight,
          color: Math.random() > 0.5 ? "bg-[#FF9E64]/20" : "bg-[#B76E79]/20"
        });
        return newParticles;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0614] text-[#E6E6E6] overflow-hidden">
      <main className="flex-grow flex flex-col items-center justify-center min-h-screen px-4 py-4 md:py-8 lg:py-16 relative">
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[#0A0614]"></div>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 rounded-full bg-[#FF9E64]/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-48 md:w-72 lg:w-96 h-48 md:h-72 lg:h-96 rounded-full bg-[#B76E79]/5 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {particles.map((particle, i) => (
            <Particle key={i} {...particle} />
          ))}
        </div>

        <div className="container mx-auto max-w-md md:max-w-lg lg:max-w-2xl text-center z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A0F2E]/80 backdrop-blur-sm p-6 md:p-8 lg:p-12 rounded-2xl md:rounded-3xl border border-[#FF9E64]/10 shadow-lg shadow-[#FF9E64]/5"
          >
            {/* Call header with enhanced animations */}
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6 md:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${getMoodColor(mood)} text-2xl md:text-3xl border border-[#FF9E64]/10 shadow-lg shadow-[#FF9E64]/5 relative`}
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {getMoodEmoji(mood)}
                <motion.div 
                  className="absolute -inset-2 border-2 border-dashed border-[#FF9E64]/10 rounded-full"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
              <div>
                <motion.h2 
                  className="text-lg md:text-xl font-medium bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Connected with someone who feels {mood}
                </motion.h2>
                <motion.p 
                  className="text-[#B76E79]/70 text-xs md:text-sm"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Call duration: {formatDuration(callDuration)}
                </motion.p>
              </div>
            </motion.div>

            {/* Connection quality indicator */}
            <motion.div 
              className="flex justify-center items-center space-x-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-[#B76E79]/70">Good connection</span>
              </div>
            </motion.div>

            {/* Enhanced audio visualizer */}
            <motion.div 
              className="flex justify-center items-end space-x-1 md:space-x-2 h-24 md:h-32 mb-6 md:mb-8 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-[#FF9E64]/5 to-transparent rounded-full blur-xl"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {audioVisualizer.map((height, index) => (
                <motion.div
                  key={index}
                  className={`w-1.5 md:w-2 bg-gradient-to-t ${getMoodColor(mood)} rounded-full shadow-lg shadow-[#FF9E64]/5`}
                  animate={{
                    height: `${height}rem`,
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.1
                  }}
                />
              ))}
            </motion.div>

            {/* Call tips */}
            <motion.div 
              className="mb-6 p-4 bg-[#1A0F2E]/50 rounded-lg border border-[#FF9E64]/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-sm font-medium text-[#FF9E64] mb-2">Call Tips</h3>
              <ul className="text-xs text-[#B76E79]/70 space-y-1">
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Be respectful and listen actively</li>
                <li>• Share your thoughts and feelings openly</li>
                <li>• Remember to take breaks if needed</li>
              </ul>
            </motion.div>

            {/* Enhanced call controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  className="flex justify-center space-x-4 md:space-x-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onHoverStart={() => setIsHoveringMute(true)}
                    onHoverEnd={() => setIsHoveringMute(false)}
                    onClick={handleToggleMute}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center ${
                      isMuted 
                        ? 'bg-[#B76E79] hover:bg-[#A65D68]' 
                        : 'bg-gradient-to-r from-[#FF9E64] to-[#FFB347] hover:from-[#FF8F50] hover:to-[#FFA030]'
                    } transition-all duration-300 shadow-lg shadow-[#FF9E64]/5 relative`}
                  >
                    <motion.div
                      className="absolute -inset-2 border-2 border-dashed border-[#FF9E64]/10 rounded-full"
                      animate={isHoveringMute ? {
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <span className="text-xl md:text-2xl">
                      {isMuted ? '🔇' : '🎤'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onHoverStart={() => setIsHoveringEnd(true)}
                    onHoverEnd={() => setIsHoveringEnd(false)}
                    onClick={handleEndCall}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-500/5 relative"
                  >
                    <motion.div
                      className="absolute -inset-2 border-2 border-dashed border-red-500/10 rounded-full"
                      animate={isHoveringEnd ? {
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <span className="text-xl md:text-2xl">📞</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-6 md:mt-8 p-3 md:p-4 bg-[#FF9E64]/10 border border-[#FF9E64]/20 rounded-lg backdrop-blur-sm"
                >
                  <motion.p 
                    className="text-[#FF9E64] text-sm md:text-base"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {error}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default VoiceCallScreen;