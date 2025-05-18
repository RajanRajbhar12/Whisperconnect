import { Link, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Mood, MoodEnum } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type MoodOption = {
  value: Mood;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
  description: string;
  quote: string;
};

const moodOptions: MoodOption[] = [
  { 
    value: "happy", 
    emoji: "😊", 
    label: "Happy", 
    color: "from-[#FF9E64] to-[#FFB347]",
    bgColor: "bg-[#FF9E64]/5",
    description: "Feeling joyful and positive",
    quote: "Share your joy with someone who understands"
  },
  { 
    value: "sad", 
    emoji: "😞", 
    label: "Sad", 
    color: "from-[#B76E79] to-[#E6B0AA]",
    bgColor: "bg-[#B76E79]/5",
    description: "Need someone to talk to",
    quote: "You're not alone in this moment"
  },
  { 
    value: "anxious", 
    emoji: "😰", 
    label: "Anxious", 
    color: "from-[#FF9E64] to-[#B76E79]",
    bgColor: "bg-[#FF9E64]/5",
    description: "Feeling worried or stressed",
    quote: "Let's find calm together"
  },
  { 
    value: "tired", 
    emoji: "😴", 
    label: "Tired", 
    color: "from-[#B76E79] to-[#E6B0AA]",
    bgColor: "bg-[#B76E79]/5",
    description: "Need some comfort",
    quote: "Rest your mind with a kind soul"
  },
  { 
    value: "lonely", 
    emoji: "🥺", 
    label: "Lonely", 
    color: "from-[#FF9E64] to-[#B76E79]",
    bgColor: "bg-[#B76E79]/5",
    description: "Want to connect with someone",
    quote: "Connection is just a whisper away"
  }
];

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

const MoodSelection = () => {
  const [, navigate] = useLocation();
  const [particles, setParticles] = useState<{ x: number; y: number; color: string }[]>([]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const selectMood = (mood: Mood) => {
    setSelectedMood(mood);
    setTimeout(() => navigate(`/matching/${mood}`), 800);
  };

  const handleMoodSelect = (mood: Mood) => {
    if (selectedMood === mood) {
      setSelectedMood(null);
      setError(null);
    } else {
      setSelectedMood(mood);
      setError(null);
      setTimeout(() => navigate(`/matching/${mood}`), 800);
    }
  };

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
            {/* Logo */}
            <motion.div 
              className="flex justify-center mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="relative"
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
                <h1 className="text-5xl font-bold bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                  WhisperConnect
                </h1>
              </motion.div>
            </motion.div>

            {/* Welcome message */}
            <motion.div 
              className="mb-16 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-medium text-[#E6E6E6] mb-4">How are you feeling today?</h2>
              <p className="text-xl text-[#B76E79]/70">Select your mood to connect with someone who understands</p>
            </motion.div>

            {/* Mood selection grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-8 rounded-2xl bg-[#1A0F2E]/50 backdrop-blur-sm border border-[#FF9E64]/10 hover:border-[#FF9E64]/20 transition-all duration-300 relative overflow-hidden group`}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-[#FF9E64]/5 to-[#B76E79]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div className="relative z-10">
                    <motion.span 
                      className="text-6xl mb-6 block"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {mood.emoji}
                    </motion.span>
                    <h3 className="text-2xl font-medium text-[#E6E6E6] mb-3">{mood.label}</h3>
                    <p className="text-lg text-[#B76E79]/70 mb-2">{mood.description}</p>
                    <p className="text-base text-[#FF9E64]/70 italic">{mood.quote}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-6 bg-[#FF9E64]/10 border border-[#FF9E64]/20 rounded-lg backdrop-blur-sm"
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

export default MoodSelection;
