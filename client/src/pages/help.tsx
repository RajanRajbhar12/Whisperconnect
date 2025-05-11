import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is Whisper?",
        answer: "Whisper is a voice-only platform that connects people based on their current mood. No profiles, no pictures—just real conversations with people who understand how you feel."
      },
      {
        question: "How does the matching work?",
        answer: "You select your current mood, and we match you with someone who's feeling the same way. It's that simple. When there's a match, you're connected for a voice-only conversation."
      },
      {
        question: "Is Whisper completely anonymous?",
        answer: "Yes, Whisper is designed to be anonymous. We don't share personal information between users, and the focus is solely on the voice connection."
      },
      {
        question: "Do I need to create an account?",
        answer: "For the basic experience, no account is needed. However, creating an account lets you access premium features and save your conversation history."
      }
    ]
  },
  {
    category: "Using the App",
    questions: [
      {
        question: "How do I start a conversation?",
        answer: "Simply select your current mood on the mood selection page, and we'll match you with someone feeling the same way. When a match is found, the voice call will begin automatically."
      },
      {
        question: "Is there a time limit for conversations?",
        answer: "Basic conversations have a 30-minute limit. Premium users get unlimited conversation time."
      },
      {
        question: "Can I end a conversation early?",
        answer: "Yes, you can end a conversation at any time by clicking the 'End Call' button."
      },
      {
        question: "What happens if I lose my internet connection?",
        answer: "If you lose connection, the call will end automatically. When your connection returns, you can select your mood again to find a new match."
      }
    ]
  },
  {
    category: "Privacy & Safety",
    questions: [
      {
        question: "How does Whisper protect my privacy?",
        answer: "Whisper doesn't collect or share personal information between users. All conversations are private and not recorded."
      },
      {
        question: "What should I do if I experience inappropriate behavior?",
        answer: "You can report inappropriate behavior during or after a call using the report feature. Our team reviews all reports promptly."
      },
      {
        question: "Can I block someone?",
        answer: "Yes, you can block someone during or after a call. You won't be matched with blocked users in the future."
      },
      {
        question: "Does Whisper record my conversations?",
        answer: "No, Whisper never records your conversations. Your privacy is our priority."
      }
    ]
  },
  {
    category: "Premium Features",
    questions: [
      {
        question: "What does Whisper Premium offer?",
        answer: "Whisper Premium includes priority matching, unlimited conversation time, advanced mood filters, premium badges, voice effects, and 24/7 support."
      },
      {
        question: "How much does Premium cost?",
        answer: "We offer several plans: $9.99/month, $79.99/year (save 33%), or $199.99 for a lifetime subscription."
      },
      {
        question: "Can I cancel my Premium subscription?",
        answer: "Yes, you can cancel your subscription at any time. Monthly and yearly subscriptions will remain active until the end of the billing period."
      }
    ]
  }
];

const contactTopics = [
  "Technical Support",
  "Account Issues",
  "Billing Questions",
  "Report a Problem",
  "Feature Request",
  "General Inquiry",
  "Safety Concern",
  "Partnership Opportunity"
];

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    topic: contactTopics[0],
    message: ""
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredFaqs(faqs);
      return;
    }
    
    const filtered = faqs.map(category => ({
      ...category,
      questions: category.questions.filter(
        q => q.question.toLowerCase().includes(term.toLowerCase()) || 
             q.answer.toLowerCase().includes(term.toLowerCase())
      )
    })).filter(category => category.questions.length > 0);
    
    setFilteredFaqs(filtered);
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to the server
    alert("Thanks for reaching out! We'll get back to you soon.");
    setContactForm({
      name: "",
      email: "",
      topic: contactTopics[0],
      message: ""
    });
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
              <span className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">We're Here For You</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] via-[hsl(var(--primary))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Help Center
            </h1>
            
            <p className="text-lg md:text-xl text-[hsl(var(--foreground))]/80 mb-10 max-w-3xl mx-auto">
              Find answers to your questions, get support, or contact our team.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="glass-card p-2 rounded-full flex items-center">
                <Input 
                  type="text" 
                  placeholder="Search for answers..." 
                  className="border-0 focus-visible:ring-0 bg-transparent text-[hsl(var(--foreground))]"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Button className="rounded-full gradient-btn text-white px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-8 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <Tabs defaultValue="faq" className="w-full">
              <div className="flex justify-center mb-10">
                <TabsList className="glass-card p-1.5">
                  <TabsTrigger value="faq" className="px-6 py-2 rounded-full">FAQs</TabsTrigger>
                  <TabsTrigger value="contact" className="px-6 py-2 rounded-full">Contact Us</TabsTrigger>
                  <TabsTrigger value="resources" className="px-6 py-2 rounded-full">Resources</TabsTrigger>
                </TabsList>
              </div>
              
              {/* FAQ Tab */}
              <TabsContent value="faq" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="glass-card p-8 rounded-3xl">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((category, i) => (
                      <div key={i} className="mb-10 last:mb-0">
                        <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                          {category.category}
                        </h3>
                        
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((faq, j) => (
                            <AccordionItem key={j} value={`item-${i}-${j}`} className="border-b border-[hsl(var(--border))]">
                              <AccordionTrigger className="text-left font-medium py-4">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-[hsl(var(--foreground))]/70 py-4">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="text-xl font-medium mb-2">No results found</h3>
                      <p className="text-[hsl(var(--foreground))]/70 mb-6">
                        We couldn't find any FAQs matching your search. Try different keywords or contact us directly.
                      </p>
                      <Button
                        variant="outline"
                        className="rounded-full border-[hsl(var(--whisper-purple))]/30 text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))]/10"
                        onClick={() => setSearchTerm("")}
                      >
                        Clear Search
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Contact Tab */}
              <TabsContent value="contact" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="glass-card p-8 rounded-3xl">
                    <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                      Send Us a Message
                    </h3>
                    
                    <form onSubmit={handleContactSubmit}>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[hsl(var(--foreground))]/70">
                            Name
                          </label>
                          <Input
                            name="name"
                            value={contactForm.name}
                            onChange={handleContactChange}
                            placeholder="Your name"
                            className="w-full rounded-lg bg-white/30 border-white/20 focus-visible:ring-[hsl(var(--whisper-purple))]"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[hsl(var(--foreground))]/70">
                            Email
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={contactForm.email}
                            onChange={handleContactChange}
                            placeholder="Your email address"
                            className="w-full rounded-lg bg-white/30 border-white/20 focus-visible:ring-[hsl(var(--whisper-purple))]"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[hsl(var(--foreground))]/70">
                            Topic
                          </label>
                          <select
                            name="topic"
                            value={contactForm.topic}
                            onChange={handleContactChange as any}
                            className="w-full rounded-lg bg-white/30 border-white/20 focus-visible:ring-[hsl(var(--whisper-purple))] p-2"
                            required
                          >
                            {contactTopics.map((topic, i) => (
                              <option key={i} value={topic}>
                                {topic}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1 text-[hsl(var(--foreground))]/70">
                            Message
                          </label>
                          <Textarea
                            name="message"
                            value={contactForm.message}
                            onChange={handleContactChange}
                            placeholder="How can we help you?"
                            className="w-full rounded-lg bg-white/30 border-white/20 focus-visible:ring-[hsl(var(--whisper-purple))]"
                            rows={5}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full gradient-btn text-white rounded-full py-5">
                        Send Message
                      </Button>
                    </form>
                  </div>
                  
                  <div>
                    <div className="glass-card p-8 rounded-3xl mb-8">
                      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                        Our Support Hours
                      </h3>
                      
                      <div className="space-y-3 text-[hsl(var(--foreground))]/80">
                        <div className="flex justify-between">
                          <span>Monday - Friday:</span>
                          <span className="font-medium">9 AM - 8 PM ET</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday:</span>
                          <span className="font-medium">10 AM - 6 PM ET</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday:</span>
                          <span className="font-medium">12 PM - 5 PM ET</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-white/20 text-[hsl(var(--foreground))]/70">
                        <p className="mb-2">
                          <strong>Premium users:</strong> 24/7 priority support available
                        </p>
                        <p>
                          Average response time: Within 24 hours (1 hour for Premium)
                        </p>
                      </div>
                    </div>
                    
                    <div className="glass-card p-8 rounded-3xl">
                      <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                        Other Ways to Reach Us
                      </h3>
                      
                      <div className="space-y-5">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mr-3 text-[hsl(var(--whisper-purple))]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Phone Support</h4>
                            <p className="text-[hsl(var(--foreground))]/70 text-sm">
                              Premium members only: +1 (555) 123-4567
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mr-3 text-[hsl(var(--whisper-purple))]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Email</h4>
                            <p className="text-[hsl(var(--foreground))]/70 text-sm">
                              support@whisperapp.com
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center mr-3 text-[hsl(var(--whisper-purple))]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Live Chat</h4>
                            <p className="text-[hsl(var(--foreground))]/70 text-sm">
                              Available on the app during support hours
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="glass-card p-8 rounded-3xl">
                  <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                    Helpful Resources
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white/30 rounded-2xl">
                      <div className="text-3xl mb-3">📚</div>
                      <h4 className="text-lg font-medium mb-2">User Guide</h4>
                      <p className="text-sm text-[hsl(var(--foreground))]/70 mb-4">
                        Complete documentation on how to use Whisper.
                      </p>
                      <Button variant="outline" className="w-full rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                        View Guide
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-white/30 rounded-2xl">
                      <div className="text-3xl mb-3">🎬</div>
                      <h4 className="text-lg font-medium mb-2">Video Tutorials</h4>
                      <p className="text-sm text-[hsl(var(--foreground))]/70 mb-4">
                        Watch step-by-step videos on using Whisper.
                      </p>
                      <Button variant="outline" className="w-full rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                        Watch Videos
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-white/30 rounded-2xl">
                      <div className="text-3xl mb-3">📋</div>
                      <h4 className="text-lg font-medium mb-2">Release Notes</h4>
                      <p className="text-sm text-[hsl(var(--foreground))]/70 mb-4">
                        Latest updates and new features in Whisper.
                      </p>
                      <Button variant="outline" className="w-full rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                        View Updates
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-white/30 rounded-2xl">
                      <div className="text-3xl mb-3">🔒</div>
                      <h4 className="text-lg font-medium mb-2">Privacy Guide</h4>
                      <p className="text-sm text-[hsl(var(--foreground))]/70 mb-4">
                        How we protect your privacy on Whisper.
                      </p>
                      <Button variant="outline" className="w-full rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                        Learn More
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-white/30 rounded-2xl">
                      <div className="text-3xl mb-3">🛡️</div>
                      <h4 className="text-lg font-medium mb-2">Safety Center</h4>
                      <p className="text-sm text-[hsl(var(--foreground))]/70 mb-4">
                        Resources for staying safe while using Whisper.
                      </p>
                      <Button variant="outline" className="w-full rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                        Visit Center
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-white/30 rounded-2xl">
                      <div className="text-3xl mb-3">💬</div>
                      <h4 className="text-lg font-medium mb-2">Community Forum</h4>
                      <p className="text-sm text-[hsl(var(--foreground))]/70 mb-4">
                        Connect with other users to share tips and experiences.
                      </p>
                      <Button variant="outline" className="w-full rounded-full text-sm border-[hsl(var(--whisper-purple))]/30 hover:bg-[hsl(var(--whisper-purple))]/10">
                        Join Forum
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HelpPage;