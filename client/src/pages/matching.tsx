import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useMatching } from "@/hooks/use-matching";
import { Mood, MoodEnum } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

// Get color for each mood
const getMoodColor = (mood: Mood) => {
  switch(mood) {
    case "happy":
      return "from-[#FF9E64] to-[#FFB347]";
    case "sad":
      return "from-[#B76E79] to-[#E6B0AA]";
    case "anxious":
      return "from-[#FF9E64] to-[#B76E79]";
    case "tired":
      return "from-[#B76E79] to-[#E6B0AA]";
    case "lonely":
      return "from-[#FF9E64] to-[#B76E79]";
    default:
      return "from-[#FF9E64] to-[#B76E79]";
  }
};

// Get emoji for each mood
const getMoodEmoji = (mood: Mood) => {
  switch(mood) {
    case "happy": return "😊";
    case "sad": return "😞";
    case "anxious": return "😰";
    case "tired": return "😴";
    case "lonely": return "🥺";
    default: return "🌿";
  }
};

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

const MatchingScreen = () => {
  const params = useParams<{ mood: Mood }>();
  const [, setLocation] = useLocation();
  const { joinMatchingQueue, connectionStatus, roomName, cancelMatching } = useMatching();
  const [particles, setParticles] = useState<{ x: number; y: number; color: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const mood = params.mood as Mood;
  const moodColor = getMoodColor(mood);
  const moodEmoji = getMoodEmoji(mood);
  
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

  useEffect(() => {
    try {
      MoodEnum.parse(mood);
      joinMatchingQueue(mood);
    } catch (error) {
      setLocation("/mood");
    }
    
    return () => {
      cancelMatching();
    };
  }, [mood, joinMatchingQueue, setLocation, cancelMatching]);
  
  useEffect(() => {
    if (connectionStatus === "matched" && roomName) {
      setLocation(`/call?roomName=${roomName}&mood=${mood}`);
    }
  }, [connectionStatus, roomName, mood, setLocation]);
  
  const handleCancel = () => {
    cancelMatching();
    setLocation("/mood");
  };

  const isWaiting = connectionStatus === "waiting";
  const isSearching = connectionStatus === "connecting";
  
  return (
    <div className="min-h-screen bg-[#0A0614] text-[#E6E6E6] overflow-hidden">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center min-h-screen px-4 py-4 md:py-8 lg:py-16 relative">
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[#0A0614]"></div>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] rounded-full bg-[#FF9E64]/5 blur-3xl"
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
            className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] rounded-full bg-[#B76E79]/5 blur-3xl"
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

        <div className="container mx-auto max-w-4xl text-center z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A0F2E]/80 backdrop-blur-sm p-12 md:p-16 rounded-3xl border border-[#FF9E64]/10 shadow-lg shadow-[#FF9E64]/5"
          >
            {/* Mood indicator */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="relative inline-block"
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
                <motion.div 
                  className="absolute -inset-8 border-2 border-dashed border-[#FF9E64]/10 rounded-full"
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
                <span className="text-7xl">{getMoodEmoji(mood)}</span>
              </motion.div>
              <motion.h2 
                className="text-3xl font-medium text-[#E6E6E6] mt-6"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Finding someone who understands {mood}...
              </motion.h2>
            </motion.div>

            {/* Connection animation */}
            <motion.div 
              className="flex justify-center items-center gap-4 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-[#FF9E64]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>

            {/* Waiting tips */}
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-medium text-[#E6E6E6] mb-6">While You Wait</h3>
              <ul className="space-y-4 text-left">
                <motion.li 
                  className="flex items-center gap-3 text-lg text-[#B76E79]/70"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-2xl">🧘</span>
                  Take a deep breath and relax
                </motion.li>
                <motion.li 
                  className="flex items-center gap-3 text-lg text-[#B76E79]/70"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <span className="text-2xl">🎤</span>
                  Check your microphone is working
                </motion.li>
                <motion.li 
                  className="flex items-center gap-3 text-lg text-[#B76E79]/70"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-2xl">💭</span>
                  Think about what you'd like to share
                </motion.li>
              </ul>
            </motion.div>

            {/* Cancel button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={handleCancel}
                className="w-full md:w-auto px-12 py-6 text-lg bg-[#FF9E64]/10 hover:bg-[#FF9E64]/20 text-[#FF9E64] border border-[#FF9E64]/20 rounded-xl transition-all duration-300"
              >
                Cancel
              </Button>
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-8 p-6 bg-[#FF9E64]/10 border border-[#FF9E64]/20 rounded-lg backdrop-blur-sm"
                >
                  <motion.p 
                    className="text-[#FF9E64] text-lg"
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

export default MatchingScreen;
