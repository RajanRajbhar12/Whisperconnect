import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AboutSection from "@/components/about-section";
import FAQSection from "@/components/faq-section";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        <section className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-20 relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute left-0 top-20 w-64 h-64 rounded-full bg-[hsl(var(--whisper-pink))] opacity-20 blur-3xl"></div>
          <div className="absolute right-0 bottom-20 w-80 h-80 rounded-full bg-[hsl(var(--whisper-blue))] opacity-20 blur-3xl"></div>
          
          <div className="container mx-auto max-w-5xl text-center z-10">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-white/30 backdrop-blur-md rounded-full mb-6 border border-white/50">
                <span className="text-2xl mr-3">🌿</span>
                <span className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">Just launched</span>
              </div>
            </div>
            
            {/* Hero image in a modern style */}
            <div className="glass-card mb-12 p-2 mx-auto max-w-3xl overflow-hidden">
              <div 
                className="bg-cover bg-center rounded-2xl h-72 md:h-96 w-full transform transition-all hover:scale-105 duration-1000 ease-out" 
                style={{ 
                  backgroundImage: "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" 
                }}
              ></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] via-[hsl(var(--primary))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Feeling lonely? Just whisper.
            </h1>
            
            <p className="text-lg md:text-xl text-[hsl(var(--foreground))]/80 mb-10 max-w-2xl mx-auto">
              Get instantly connected to someone who feels the same way you do. 
              <span className="block mt-2 font-light text-[hsl(var(--foreground))]/70">Not a date. Not a profile. Just a voice when you need one.</span>
            </p>
            
            <div>
              <Link href="/mood">
                <Button 
                  className="gradient-btn text-white font-medium px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  Start Whispering
                </Button>
              </Link>
              
              <div className="mt-8 text-sm text-[hsl(var(--foreground))]/60 flex items-center justify-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                <span>100+ people online now</span>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
