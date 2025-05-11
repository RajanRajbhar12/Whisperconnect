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
        <section className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-16">
          <div className="container mx-auto max-w-4xl text-center">
            {/* Serene landscape with soft colors */}
            <div 
              className="bg-cover bg-center rounded-xl mb-8 h-64 md:h-80 shadow-lg" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" 
              }}
            ></div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4 text-[#424242]">
              Feeling lonely? Just <span className="text-[hsl(var(--whisper-blue))] font-medium">whisper</span>.
            </h1>
            
            <p className="text-lg md:text-xl text-[#424242]/80 mb-10 max-w-2xl mx-auto">
              Get instantly connected to someone who feels the same. Not a date. Not a profile. Just a voice when you need one.
            </p>
            
            <Link href="/mood">
              <Button 
                className="bg-[hsl(var(--whisper-blue))] text-white font-medium px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg"
              >
                Start Whispering
              </Button>
            </Link>
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
