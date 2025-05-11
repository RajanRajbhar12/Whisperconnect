import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useMatching } from "@/hooks/use-matching";
import { Mood, MoodEnum } from "@shared/schema";

// Get color for each mood
const getMoodColor = (mood: Mood) => {
  switch(mood) {
    case "happy":
      return "from-yellow-400 to-amber-500";
    case "sad":
      return "from-blue-400 to-indigo-500";
    case "anxious":
      return "from-purple-400 to-violet-500";
    case "tired":
      return "from-gray-400 to-slate-500";
    case "lonely":
      return "from-pink-400 to-rose-500";
    default:
      return "from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))]";
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

const MatchingScreen = () => {
  const params = useParams<{ mood: Mood }>();
  const [, navigate] = useLocation();
  const { joinMatchingQueue, connectionStatus, roomName, cancelMatching } = useMatching();
  
  const mood = params.mood as Mood;
  const moodColor = getMoodColor(mood);
  const moodEmoji = getMoodEmoji(mood);
  
  useEffect(() => {
    // Validate the mood parameter
    try {
      MoodEnum.parse(mood);
      // Join the matching queue with the selected mood
      joinMatchingQueue(mood);
    } catch (error) {
      // Invalid mood, redirect to mood selection
      navigate("/mood");
    }
    
    return () => {
      // Clean up when component unmounts
      cancelMatching();
    };
  }, [mood, joinMatchingQueue, navigate, cancelMatching]);
  
  // When a match is found, navigate to the call screen
  useEffect(() => {
    if (connectionStatus === "matched" && roomName) {
      navigate(`/call/${roomName}/${mood}`);
    }
  }, [connectionStatus, roomName, mood, navigate]);
  
  const handleCancel = () => {
    cancelMatching();
    navigate("/mood");
  };
  
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-16 relative">
        {/* Decorative elements */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-[hsl(var(--whisper-purple))] blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[hsl(var(--whisper-blue))] blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-md text-center z-10">
          <div className="glass-card p-12 rounded-3xl">
            {/* Mood avatar */}
            <div className="mx-auto mb-10 relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-r ${moodColor} text-5xl`}>
                {moodEmoji}
              </div>
              <div className="absolute -inset-3 border-2 border-dashed border-white/30 rounded-full"></div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-medium mb-6">
              Finding someone who feels{" "}
              <span className={`bg-gradient-to-r ${moodColor} text-transparent bg-clip-text`}>
                {mood}
              </span>
            </h2>
            
            {/* Simple pulse dots */}
            <div className="flex justify-center space-x-3 mb-10">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse" style={{ animationDelay: "0.6s" }}></div>
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse" style={{ animationDelay: "0.8s" }}></div>
            </div>
            
            <p className="text-[hsl(var(--foreground))]/70 mb-8">
              Please wait while we match you with someone feeling the same way
            </p>
            
            <Button 
              variant="outline" 
              className="mt-4 border-[hsl(var(--whisper-purple))]/30 text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))]/10 transition-colors rounded-full px-8"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default MatchingScreen;
