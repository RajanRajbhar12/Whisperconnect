import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mood } from "@shared/schema";
import { motion } from "framer-motion";

type StoryType = {
  id: number;
  title: string;
  description: string;
  mood: Mood;
  author: string;
  likes: number;
  image: string;
  tags: string[];
};

const stories: StoryType[] = [
  {
    id: 1,
    title: "The Day Everything Changed",
    description: "I was feeling lost and alone, but a random voice call changed my perspective on life.",
    mood: "lonely",
    author: "Alex T.",
    likes: 2543,
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    tags: ["Connection", "Hope", "Friendship"]
  },
  {
    id: 2,
    title: "Finding Joy in Unexpected Places",
    description: "Sometimes happiness comes from the most unexpected conversations with strangers.",
    mood: "happy",
    author: "Jamie K.",
    likes: 1875,
    image: "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    tags: ["Happiness", "Surprise", "Connection"]
  },
  {
    id: 3,
    title: "The Voice That Calmed My Anxiety",
    description: "When panic was taking over, a stranger's voice brought me back to reality.",
    mood: "anxious",
    author: "Taylor M.",
    likes: 3298,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    tags: ["Anxiety", "Support", "Healing"]
  },
  {
    id: 4,
    title: "Late Night Conversations",
    description: "I was exhausted but couldn't sleep. Then I met someone who understood exactly how I felt.",
    mood: "tired",
    author: "Jordan P.",
    likes: 1456,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    tags: ["Insomnia", "Understanding", "Peace"]
  },
  {
    id: 5,
    title: "A Moment of Shared Sadness",
    description: "We were both going through difficult times. Somehow, sharing our sadness made it easier to bear.",
    mood: "sad",
    author: "Riley J.",
    likes: 2187,
    image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    tags: ["Grief", "Healing", "Support"]
  },
  {
    id: 6,
    title: "The Laughter That Healed",
    description: "I went on Whisper feeling down, but ended up laughing for hours with a complete stranger.",
    mood: "happy",
    author: "Morgan C.",
    likes: 2854,
    image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    tags: ["Laughter", "Joy", "Unexpected"]
  },
];

const discoverTopics = [
  {
    title: "Mental Health",
    description: "Connect with others who understand your journey",
    icon: "🧠",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Personal Growth",
    description: "Share experiences and learn from others",
    icon: "🌱",
    color: "from-[#B76E79] to-[#E6B0AA]"
  },
  {
    title: "Relationships",
    description: "Discuss love, friendship, and connections",
    icon: "❤️",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Career & Goals",
    description: "Get advice and share your aspirations",
    icon: "🎯",
    color: "from-[#B76E79] to-[#E6B0AA]"
  }
];

const trendingTopics = [
  {
    title: "Mindfulness",
    participants: 1234,
    icon: "🧘",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Self-Care",
    participants: 987,
    icon: "💆",
    color: "from-[#B76E79] to-[#E6B0AA]"
  },
  {
    title: "Digital Wellness",
    participants: 876,
    icon: "📱",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Work-Life Balance",
    participants: 765,
    icon: "⚖️",
    color: "from-[#B76E79] to-[#E6B0AA]"
  }
];

const DiscoverPage = () => {
  const [currentTab, setCurrentTab] = useState<string>("stories");
  const [filteredStories, setFilteredStories] = useState<StoryType[]>(stories);
  
  const filterByMood = (mood: Mood | 'all') => {
    if (mood === 'all') {
      setFilteredStories(stories);
      return;
    }
    
    setFilteredStories(stories.filter(story => story.mood === mood));
  };

  return (
    <div className="min-h-screen bg-[#1A0F2E] text-white">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF9E64]/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B76E79]/10 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Discover Meaningful Conversations
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300/80 text-lg mb-8"
            >
              Explore topics that matter to you and connect with like-minded individuals
            </motion.p>
          </div>
        </section>

        {/* Topics Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Explore Topics
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {discoverTopics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#1A0F2E]/50 backdrop-blur-sm p-6 rounded-2xl border border-[#FF9E64]/20 hover:border-[#FF9E64]/40 transition-colors"
                >
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                    {topic.title}
                  </h3>
                  <p className="text-gray-300/70">{topic.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Trending Now
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#1A0F2E]/50 backdrop-blur-sm p-6 rounded-2xl border border-[#FF9E64]/20 hover:border-[#FF9E64]/40 transition-colors"
                >
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                    {topic.title}
                  </h3>
                  <p className="text-gray-300/70">{topic.participants.toLocaleString()} participants</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#1A0F2E]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#FF9E64]/20"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                Ready to Connect?
              </h2>
              <p className="text-gray-300/80 mb-8">
                Join the conversation and start making meaningful connections today
              </p>
              <Link href="/mood">
                <Button className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] hover:from-[#FF9E64]/90 hover:to-[#B76E79]/90 text-white px-8 py-6 rounded-full text-lg">
                  Start Talking
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DiscoverPage;