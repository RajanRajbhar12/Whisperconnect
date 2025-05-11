import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mood } from "@shared/schema";

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

const trendingTopics = [
  "Mental Health", "Self-Care", "Friendships", "Life Changes", 
  "Personal Growth", "Anxiety Management", "Finding Joy", "Loneliness",
  "Motivation", "Self-Discovery"
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
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--whisper-purple))] rounded-full blur-3xl opacity-10 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[hsl(var(--whisper-pink))] rounded-full blur-3xl opacity-10 -z-10"></div>
          
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/30 backdrop-blur-md rounded-full mb-6 border border-white/50">
              <span className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">✨ Explore & Connect</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] via-[hsl(var(--primary))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Discover Whisper
            </h1>
            
            <p className="text-lg md:text-xl text-[hsl(var(--foreground))]/80 mb-10 max-w-2xl mx-auto">
              Explore stories, find community, and connect with others through shared experiences.
            </p>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-8 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <Tabs defaultValue="stories" className="w-full" onValueChange={setCurrentTab}>
              <div className="flex justify-center mb-10">
                <TabsList className="glass-card p-1.5">
                  <TabsTrigger value="stories" className="px-6 py-2 rounded-full">Stories</TabsTrigger>
                  <TabsTrigger value="trending" className="px-6 py-2 rounded-full">Trending</TabsTrigger>
                  <TabsTrigger value="community" className="px-6 py-2 rounded-full">Community</TabsTrigger>
                </TabsList>
              </div>
              
              {/* Stories Tab */}
              <TabsContent value="stories" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="flex justify-center mb-8 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => filterByMood('all')}
                    className="rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10"
                  >
                    All
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => filterByMood('happy')}
                    className="rounded-full text-sm border-yellow-400/30 hover:bg-yellow-400/10"
                  >
                    Happy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => filterByMood('sad')}
                    className="rounded-full text-sm border-blue-400/30 hover:bg-blue-400/10"
                  >
                    Sad
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => filterByMood('anxious')}
                    className="rounded-full text-sm border-purple-400/30 hover:bg-purple-400/10"
                  >
                    Anxious
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => filterByMood('tired')}
                    className="rounded-full text-sm border-gray-400/30 hover:bg-gray-400/10"
                  >
                    Tired
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => filterByMood('lonely')}
                    className="rounded-full text-sm border-pink-400/30 hover:bg-pink-400/10"
                  >
                    Lonely
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredStories.map((story) => (
                    <div key={story.id} className="glass-card overflow-hidden rounded-3xl">
                      <div 
                        className="h-48 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${story.image})` }}
                      ></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold">{story.title}</h3>
                          <div className="flex items-center text-[hsl(var(--foreground))]/60 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span className="ml-1">{story.likes}</span>
                          </div>
                        </div>
                        <p className="text-[hsl(var(--foreground))]/70 mb-4 line-clamp-2">{story.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {story.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-white/50 rounded-full">{tag}</span>
                            ))}
                            {story.tags.length > 2 && (
                              <span className="text-xs px-2 py-1 bg-white/50 rounded-full">+{story.tags.length - 2}</span>
                            )}
                          </div>
                          <div className="text-sm text-[hsl(var(--foreground))]/60">
                            By {story.author}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-12">
                  <Button variant="outline" className="rounded-full border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                    Load More Stories
                  </Button>
                </div>
              </TabsContent>
              
              {/* Trending Tab */}
              <TabsContent value="trending" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="max-w-4xl mx-auto">
                  <div className="glass-card p-8 rounded-3xl">
                    <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">Trending Topics</h3>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                      {trendingTopics.map((topic, i) => (
                        <Button key={i} variant="outline" className="rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                          {topic}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">Popular Now</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-center p-4 bg-white/30 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                            1
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Finding peace in anxiety</h4>
                            <div className="text-sm text-[hsl(var(--foreground))]/60">5.3k discussions</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 bg-white/30 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                            2
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Late night conversations</h4>
                            <div className="text-sm text-[hsl(var(--foreground))]/60">4.8k discussions</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-4 bg-white/30 rounded-2xl">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                            3
                          </div>
                          <div className="ml-4">
                            <h4 className="font-medium">Dealing with loneliness</h4>
                            <div className="text-sm text-[hsl(var(--foreground))]/60">3.9k discussions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Community Tab */}
              <TabsContent value="community" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="max-w-4xl mx-auto text-center">
                  <div className="glass-card p-12 rounded-3xl">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] flex items-center justify-center text-white text-4xl mx-auto mb-6">
                      👥
                    </div>
                    
                    <h3 className="text-2xl font-semibold mb-4">Join the Whisper Community</h3>
                    <p className="text-[hsl(var(--foreground))]/70 mb-8">
                      Connect with like-minded individuals, join discussion groups, and participate in community events.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="p-6 bg-white/30 rounded-2xl">
                        <div className="text-2xl mb-2">🗣️</div>
                        <h4 className="font-medium mb-1">Discussion Groups</h4>
                        <p className="text-sm text-[hsl(var(--foreground))]/60">Join topic-based conversations</p>
                      </div>
                      
                      <div className="p-6 bg-white/30 rounded-2xl">
                        <div className="text-2xl mb-2">🎭</div>
                        <h4 className="font-medium mb-1">Community Events</h4>
                        <p className="text-sm text-[hsl(var(--foreground))]/60">Participate in virtual gatherings</p>
                      </div>
                      
                      <div className="p-6 bg-white/30 rounded-2xl">
                        <div className="text-2xl mb-2">🧠</div>
                        <h4 className="font-medium mb-1">Resource Library</h4>
                        <p className="text-sm text-[hsl(var(--foreground))]/60">Access helpful materials</p>
                      </div>
                    </div>
                    
                    <Button className="gradient-btn text-white font-medium px-8 py-4 rounded-full">
                      Join Community
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-12 rounded-3xl text-center relative overflow-hidden">
              <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-[hsl(var(--whisper-purple))] rounded-full blur-3xl opacity-10"></div>
              <div className="absolute -z-10 bottom-0 left-0 w-96 h-96 bg-[hsl(var(--whisper-pink))] rounded-full blur-3xl opacity-10"></div>
              
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                Ready to share your voice?
              </h2>
              
              <p className="text-lg text-[hsl(var(--foreground))]/80 mb-10 max-w-2xl mx-auto">
                Start connecting with others who are feeling just like you.
              </p>
              
              <Link href="/mood">
                <Button className="gradient-btn text-white font-medium px-12 py-6 rounded-full text-lg">
                  Start Whispering
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DiscoverPage;