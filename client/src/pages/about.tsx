import { motion } from "framer-motion";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    bio: "Passionate about creating meaningful connections through technology",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Product",
    bio: "Dedicated to building intuitive and engaging user experiences",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    color: "from-[#B76E79] to-[#E6B0AA]"
  },
  {
    name: "Priya Patel",
    role: "Lead Developer",
    bio: "Expert in creating scalable and secure voice communication systems",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    name: "David Kim",
    role: "Community Manager",
    bio: "Focused on building and nurturing our global community",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    color: "from-[#B76E79] to-[#E6B0AA]"
  }
];

const values = [
  {
    title: "Authentic Connections",
    description: "We believe in fostering genuine, meaningful relationships through voice",
    icon: "💫",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Safe Space",
    description: "Creating an environment where everyone feels comfortable being themselves",
    icon: "🛡️",
    color: "from-[#B76E79] to-[#E6B0AA]"
  },
  {
    title: "Inclusive Community",
    description: "Welcoming people from all walks of life with open arms",
    icon: "🤝",
    color: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Continuous Growth",
    description: "Always learning and improving to better serve our community",
    icon: "🌱",
    color: "from-[#B76E79] to-[#E6B0AA]"
  }
];

const About = () => {
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
              About Whisper Connect
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300/80 text-lg mb-8"
            >
              We're on a mission to create meaningful connections through voice
            </motion.p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#1A0F2E]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#FF9E64]/20"
            >
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-300/80">
                <p>
                  Whisper Connect was born from a simple idea: in a world of text messages and social media, we've lost the depth and authenticity of voice conversations. We wanted to create a space where people could connect through meaningful voice interactions, sharing their thoughts, feelings, and experiences in a more natural way.
                </p>
                <p>
                  Today, we're proud to have built a platform that brings people together through voice, fostering genuine connections and creating a supportive community where everyone's voice matters.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-12 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Our Values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#1A0F2E]/50 backdrop-blur-sm p-6 rounded-2xl border border-[#FF9E64]/20 hover:border-[#FF9E64]/40 transition-colors"
                >
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                    {value.title}
                  </h3>
                  <p className="text-gray-300/70">{value.description}</p>
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
                Join Our Community
              </h2>
              <p className="text-gray-300/80 mb-8">
                Be part of something special and start making meaningful connections today
              </p>
              <Link href="/mood">
                <Button className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] hover:from-[#FF9E64]/90 hover:to-[#B76E79]/90 text-white px-8 py-6 rounded-full text-lg">
                  Get Started
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

export default About;
