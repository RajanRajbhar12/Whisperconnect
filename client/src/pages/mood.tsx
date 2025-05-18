import { Link, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Mood, MoodEnum } from "@shared/schema";
import { motion } from "framer-motion";

type MoodOption = {
  value: Mood;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
};

const moodOptions: MoodOption[] = [
  { 
    value: "happy", 
    emoji: "😊", 
    label: "Happy", 
    color: "from-[#FF9E64] to-[#FFB347]",
    bgColor: "bg-[#FF9E64]/10"
  },
  { 
    value: "sad", 
    emoji: "😞", 
    label: "Sad", 
    color: "from-[#B76E79] to-[#E6B0AA]",
    bgColor: "bg-[#B76E79]/10"
  },
  { 
    value: "anxious", 
    emoji: "😰", 
    label: "Anxious", 
    color: "from-[#FF9E64] to-[#B76E79]",
    bgColor: "bg-[#FF9E64]/10"
  },
  { 
    value: "tired", 
    emoji: "😴", 
    label: "Tired", 
    color: "from-[#B76E79] to-[#E6B0AA]",
    bgColor: "bg-[#B76E79]/10"
  },
  { 
    value: "lonely", 
    emoji: "🥺", 
    label: "Lonely", 
    color: "from-[#FF9E64] to-[#B76E79]",
    bgColor: "bg-[#FF9E64]/10"
  }
];

const MoodSelection = () => {
  const [, navigate] = useLocation();

  const selectMood = (mood: Mood) => {
    navigate(`/matching/${mood}`);
  };

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#FF9E64]/10 to-transparent"></div>
        <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#FF9E64]/10 blur-3xl"></div>
        <div className="absolute -z-10 bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#B76E79]/10 blur-3xl"></div>
        
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-[#1A0F2E]/50 backdrop-blur-sm inline-block px-6 py-3 mb-12 rounded-full border border-[#FF9E64]/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl md:text-3xl font-medium bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                How are you feeling today?
              </h2>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {moodOptions.map((mood, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`mood-option cursor-pointer ${mood.value === "lonely" ? "md:col-span-1 col-span-2" : ""}`}
                onClick={() => selectMood(mood.value)}
              >
                <motion.div 
                  className={`emoji ${mood.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-[#FF9E64]/20`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                </motion.div>
                <motion.div 
                  className={`font-medium mt-4 text-lg bg-gradient-to-r ${mood.color} text-transparent bg-clip-text`}
                  whileHover={{ scale: 1.05 }}
                >
                  {mood.label}
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/">
              <Button 
                variant="outline" 
                className="mt-4 border-[#FF9E64]/30 text-[#FF9E64] hover:bg-[#FF9E64]/10 transition-colors text-sm rounded-full px-6"
              >
                ← Go back
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default MoodSelection; 