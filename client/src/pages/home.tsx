import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, AnimatePresence, useAnimationControls } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface FloatingIconProps {
  icon: string;
  delay: number;
  duration: number;
  x: string;
  y: string;
  isMobile?: boolean;
}

const FloatingIcon = ({ icon, delay, duration, x, y, isMobile = false }: FloatingIconProps) => {
  const xValue = parseInt(x);
  const yValue = parseInt(y);
  const controls = useAnimationControls();
  
  useEffect(() => {
    if (isMobile) {
      controls.start({
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        x: [`${xValue}%`, `${xValue + 10}%`, `${xValue}%`],
        y: [`${yValue}%`, `${yValue - 10}%`, `${yValue}%`],
        transition: {
          duration: duration * 0.7,
          repeat: Infinity,
          delay: delay * 0.7,
        }
      });
    } else {
      controls.start({
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        x: [`${xValue}%`, `${xValue + 20}%`, `${xValue}%`],
        y: [`${yValue}%`, `${yValue - 20}%`, `${yValue}%`],
        transition: {
          duration: duration,
          repeat: Infinity,
          delay: delay,
        }
      });
    }
  }, [isMobile, controls, xValue, yValue, duration, delay]);

  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={controls}
    >
      {icon}
    </motion.div>
  );
};

const WaveAnimation = ({ isMobile = false }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: isMobile ? [0.8, 1.1, 0.8] : [0.8, 1.2, 0.8],
          opacity: [0.2, 0.1, 0.2],
        }}
        transition={{
          duration: isMobile ? 3 : 4,
          repeat: Infinity,
          delay: i * (isMobile ? 1 : 1.5),
        }}
      >
        <svg
          width={isMobile ? "400" : "600"}
          height={isMobile ? "400" : "600"}
          viewBox="0 0 600 600"
          fill="none"
          className="text-[#FF9E64]/20"
        >
          <path
            d="M300 100C400 100 500 200 500 300C500 400 400 500 300 500C200 500 100 400 100 300C100 200 200 100 300 100Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    ))}
  </div>
);

const Home = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isMobile) {
        const touch = e.touches[0];
        setTouchPosition({
          x: touch.clientX,
          y: touch.clientY,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isMobile]);

  const floatingIcons = [
    { icon: "💭", delay: 0, duration: 5, x: "10%", y: "20%" },
    { icon: "💫", delay: 1, duration: 6, x: "80%", y: "30%" },
    { icon: "✨", delay: 2, duration: 7, x: "20%", y: "70%" },
    { icon: "💝", delay: 3, duration: 5, x: "70%", y: "60%" },
    { icon: "🫂", delay: 4, duration: 6, x: "40%", y: "40%" },
    { icon: "🌙", delay: 5, duration: 7, x: "60%", y: "80%" }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#1A0F2E] text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-grow flex flex-col relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[#1A0F2E]"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(isMobile ? 20 : 30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#FF9E64]/30 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * (isMobile ? 2 : 3) + 2,
                  repeat: Infinity,
                  delay: Math.random() * (isMobile ? 1 : 2)
                }}
              />
            ))}
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 pointer-events-none">
            {floatingIcons.map((icon, index) => (
              <FloatingIcon key={index} {...icon} isMobile={isMobile} />
            ))}
          </div>

          {/* Wave Animation */}
          <WaveAnimation isMobile={isMobile} />

          {/* Interactive gradient orb */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-[#FF9E64]/10 blur-[100px] pointer-events-none"
            animate={{
              x: isMobile ? touchPosition.x - 250 : mousePosition.x - 250,
              y: isMobile ? touchPosition.y - 250 : mousePosition.y - 250,
            }}
            transition={{
              type: "spring",
              damping: isMobile ? 40 : 30,
              stiffness: isMobile ? 300 : 200,
            }}
          />

          {/* Warm gradient orbs */}
          <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-[#FF9E64]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-[#B76E79]/10 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E6B0AA]/10 rounded-full blur-[100px] pointer-events-none"></div>

          <motion.div 
            className="container mx-auto max-w-5xl text-center z-10 px-4 sm:px-6"
            style={{ y, opacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#1A0F2E]/50 backdrop-blur-sm border border-[#FF9E64]/20 text-[#FF9E64] text-sm font-medium">
                <span className="mr-2">✨</span>
                A Safe Space for Your Voice
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 bg-gradient-to-r from-[#FF9E64] via-[#B76E79] to-[#E6B0AA] text-transparent bg-clip-text break-words"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Whisper Connect
              <br />
              <span className="text-[#FF9E64]">Your Voice Matters Here</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl md:text-2xl text-gray-300/80 mb-12 max-w-2xl mx-auto leading-relaxed break-words"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect with others through meaningful voice conversations. Share your thoughts, feelings, and experiences in a safe and supportive environment.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/mood">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white font-medium px-8 py-6 rounded-full text-lg hover:from-[#FF8F50] hover:to-[#A65D68] transition-all">
                    Start Talking
                  </Button>
                </motion.div>
              </Link>
              
              <Link href="/about">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="border-[#FF9E64]/30 text-[#FF9E64] hover:bg-[#FF9E64]/10 transition-colors px-8 py-6 rounded-full text-lg">
                    Learn More
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Why Choose Whisper Connect?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Safe & Secure",
                  description: "Your privacy is our priority. All conversations are private and secure.",
                  icon: "🔒"
                },
                {
                  title: "Meaningful Connections",
                  description: "Connect with others who share your feelings and experiences.",
                  icon: "💫"
                },
                {
                  title: "Voice-First",
                  description: "Experience the power of voice in creating genuine connections.",
                  icon: "🎤"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1A0F2E]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#FF9E64]/20 hover:border-[#FF9E64]/40 transition-colors"
                >
                  <motion.div 
                    className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-4xl mb-6 border border-[#FF9E64]/20"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: [0, -5, 5, -5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-[#FF9E64]">{feature.title}</h3>
                  <p className="text-gray-300/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              How It Works
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Select Your Mood",
                  description: "Choose how you're feeling today",
                  icon: "😊"
                },
                {
                  step: "2",
                  title: "Get Matched",
                  description: "Connect with someone feeling the same way",
                  icon: "🔄"
                },
                {
                  step: "3",
                  title: "Start Talking",
                  description: "Begin your voice conversation",
                  icon: "🎤"
                },
                {
                  step: "4",
                  title: "Connect",
                  description: "Build meaningful relationships",
                  icon: "💫"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-[#1A0F2E]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#FF9E64]/20 hover:border-[#FF9E64]/40 transition-colors">
                    <motion.div 
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-2xl mb-6 border border-[#FF9E64]/20"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, -5, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {step.icon}
                    </motion.div>
                    <div className="text-[#FF9E64] font-semibold mb-2">Step {step.step}</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-300/70">{step.description}</p>
                  </div>
                  
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#FF9E64] to-[#B76E79]"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A0F2E]/50 backdrop-blur-sm p-12 rounded-3xl text-center relative overflow-hidden border border-[#FF9E64]/20"
            >
              <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-[#FF9E64] rounded-full blur-3xl opacity-10"></div>
              <div className="absolute -z-10 bottom-0 left-0 w-96 h-96 bg-[#B76E79] rounded-full blur-3xl opacity-10"></div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">
                Ready to Start Talking?
              </h2>
              
              <p className="text-lg text-gray-300/80 mb-10 max-w-2xl mx-auto">
                Join Whisper Connect today and experience the power of voice in creating meaningful connections.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/mood">
                  <Button className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white font-medium px-12 py-6 rounded-full text-lg hover:from-[#FF8F50] hover:to-[#A65D68] transition-all">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
