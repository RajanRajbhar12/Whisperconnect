import { Link, useLocation } from "wouter";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Mood, MoodEnum } from "@shared/schema";

type MoodOption = {
  value: Mood;
  emoji: string;
  label: string;
};

const moodOptions: MoodOption[] = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "sad", emoji: "😞", label: "Sad" },
  { value: "anxious", emoji: "😰", label: "Anxious" },
  { value: "tired", emoji: "😴", label: "Tired" },
  { value: "lonely", emoji: "🥺", label: "Lonely" }
];

const MoodSelection = () => {
  const [, navigate] = useLocation();

  const selectMood = (mood: Mood) => {
    navigate(`/matching/${mood}`);
  };

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-12 text-[#424242]">
            How are you feeling today?
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {moodOptions.map((mood, index) => (
              <div 
                key={index}
                className={`mood-option ${mood.value === "lonely" ? "md:col-span-1 col-span-2" : ""}`}
                onClick={() => selectMood(mood.value)}
              >
                <div className="text-4xl mb-3">{mood.emoji}</div>
                <div className="text-[#424242] font-medium">{mood.label}</div>
              </div>
            ))}
          </div>
          
          <Link href="/">
            <Button variant="ghost" className="mt-4 text-[#424242]/70 hover:text-[#424242] transition-colors text-sm">
              Go back
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default MoodSelection;
