import { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useMatching } from "@/hooks/use-matching";
import { Mood, MoodEnum } from "@shared/schema";

const MatchingScreen = () => {
  const params = useParams<{ mood: Mood }>();
  const [, navigate] = useLocation();
  const { joinMatchingQueue, connectionStatus, roomName, cancelMatching } = useMatching();
  
  const mood = params.mood as Mood;
  
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
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-16">
        <div className="container mx-auto max-w-md text-center">
          {/* Calm, peaceful illustration */}
          <div 
            className="bg-cover bg-center rounded-full w-40 h-40 mx-auto mb-8 shadow-lg" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800')" 
            }}
          ></div>
          
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-[#424242]">
            Finding someone who feels <span className="text-[hsl(var(--whisper-blue))] font-medium">{mood}</span>
          </h2>
          
          <div className="flex justify-center space-x-2 mb-10">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--whisper-pink))] animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
          
          <p className="text-[#424242]/80 mb-6">
            This usually takes less than a minute
          </p>
          
          <Button 
            variant="ghost"
            className="mt-4 text-[#424242]/70 hover:text-[#424242] transition-colors text-sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </main>
    </>
  );
};

export default MatchingScreen;
