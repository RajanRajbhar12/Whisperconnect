import { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
        question: "What is Whisper Connect?",
        answer: "Whisper Connect is a voice-based social platform that helps you connect with others through meaningful conversations. We match you with people who share your current mood and interests."
      },
      {
        question: "How does the matching work?",
        answer: "Our matching system uses your selected mood and preferences to find compatible conversation partners. We prioritize meaningful connections over random matches."
      },
      {
        question: "Is my privacy protected?",
        answer: "Yes, we take privacy seriously. Your conversations are not recorded, and we don't store any personal information. You can remain anonymous while using the platform."
      },
      {
        question: "How do I report inappropriate behavior?",
        answer: "You can report any inappropriate behavior using the report button during a call. Our moderation team reviews all reports promptly to maintain a safe environment."
      },
      {
        question: "Can I use Whisper Connect on mobile?",
        answer: "Yes, Whisper Connect is fully responsive and works on both desktop and mobile devices. You can access it through any modern web browser."
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

const supportCategories = [
  {
    title: "Getting Started",
    description: "Learn how to create an account and start your first conversation",
    icon: "🚀",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Account & Settings",
    description: "Manage your profile, preferences, and account settings",
    icon: "⚙️",
    color: "from-[#B76E79] to-[#E6B0AA]"
  },
  {
    title: "Safety & Privacy",
    description: "Understand our safety features and privacy policies",
    icon: "🔒",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Technical Support",
    description: "Get help with technical issues and troubleshooting",
    icon: "🔧",
    color: "from-[#B76E79] to-[#E6B0AA]"
  }
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
              How can we help you?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300/80 text-lg mb-8"
            >
              Find answers to common questions and get support for any issues you're experiencing
            </motion.p>
          </div>
        </section>

        {/* Support Categories */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#1A0F2E]/50 backdrop-blur-sm p-6 rounded-2xl border border-[#FF9E64]/20 hover:border-[#FF9E64]/40 transition-colors"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                    {category.title}
                  </h3>
                  <p className="text-gray-300/70">{category.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="space-y-6">
              {filteredFaqs.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-[#1A0F2E]/50 backdrop-blur-sm p-6 rounded-2xl border border-[#FF9E64]/20"
                >
                  <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                    {category.category}
                  </h3>
                  <div className="space-y-3">
                    {category.questions.map((faq, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: j * 0.1 }}
                        className="text-gray-300/70"
                      >
                        <h4 className="text-lg font-semibold mb-1 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                          {faq.question}
                        </h4>
                        <p>{faq.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#1A0F2E]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#FF9E64]/20"
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                Still need help?
              </h2>
              <p className="text-gray-300/80 mb-8">
                Our support team is here to help you with any questions or issues
              </p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] hover:from-[#FF9E64]/90 hover:to-[#B76E79]/90 text-white px-8 py-6 rounded-full text-lg">
                  Contact Support
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

export default HelpPage;