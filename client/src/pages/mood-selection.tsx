import { Link, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Mood, MoodEnum } from "@shared/schema";

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
    color: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-100"
  },
  { 
    value: "sad", 
    emoji: "😞", 
    label: "Sad", 
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-100"
  },
  { 
    value: "anxious", 
    emoji: "😰", 
    label: "Anxious", 
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-100"
  },
  { 
    value: "tired", 
    emoji: "😴", 
    label: "Tired", 
    color: "from-gray-400 to-slate-500",
    bgColor: "bg-gray-100"
  },
  { 
    value: "lonely", 
    emoji: "🥺", 
    label: "Lonely", 
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-100"
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
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[hsl(var(--whisper-purple))]/10 to-transparent"></div>
        <div className="absolute -z-10 top-1/3 left-1/4 w-64 h-64 rounded-full bg-[hsl(var(--whisper-pink))]/10 blur-3xl"></div>
        <div className="absolute -z-10 bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[hsl(var(--whisper-blue))]/10 blur-3xl"></div>
        
        <div className="container mx-auto max-w-4xl text-center">
          <div>
            <div className="glass-card inline-block px-6 py-3 mb-12">
              <h2 className="text-2xl md:text-3xl font-medium bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                How are you feeling today?
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
            {moodOptions.map((mood, index) => (
              <div 
                key={index}
                className={`mood-option ${mood.value === "lonely" ? "md:col-span-1 col-span-2" : ""}`}
                onClick={() => selectMood(mood.value)}
              >
                <div className={`emoji ${mood.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto`}>
                  {mood.emoji}
                </div>
                <div className={`font-medium mt-4 text-lg bg-gradient-to-r ${mood.color} text-transparent bg-clip-text`}>
                  {mood.label}
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <Link href="/">
              <Button 
                variant="outline" 
                className="mt-4 border-[hsl(var(--whisper-purple))]/30 text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))]/10 transition-colors text-sm rounded-full px-6"
              >
                ← Go back
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default MoodSelection;
