import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const values = [
  {
    title: "Authentic Connection",
    description: "We believe in the power of voice to create genuine human connections without the distractions of visual judgment.",
    icon: "🗣️"
  },
  {
    title: "Mental Wellbeing",
    description: "We're committed to creating a platform that supports mental health through meaningful conversations.",
    icon: "🧠"
  },
  {
    title: "Privacy & Safety",
    description: "We prioritize user privacy and safety in every aspect of our platform.",
    icon: "🛡️"
  },
  {
    title: "Inclusivity",
    description: "Whisper is for everyone, regardless of background, identity, or circumstance.",
    icon: "🌈"
  }
];


const AboutPage = () => {
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
              <span className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">Our Story</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] via-[hsl(var(--primary))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              About Whisper
            </h1>
            
            <p className="text-lg md:text-xl text-[hsl(var(--foreground))]/80 mb-10 max-w-3xl mx-auto">
              Whisper is on a mission to create meaningful connections in a digital world that often feels isolating and overwhelming.
            </p>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="glass-card p-1 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1522543558187-768b6df7c25c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=800" 
                  alt="People connecting" 
                  className="w-full h-full object-cover rounded-3xl"
                />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                  Our Mission
                </h2>
                
                <p className="text-[hsl(var(--foreground))]/80 mb-6 text-lg">
                  In a world dominated by visual social media, we're bringing back the intimacy of voice conversation. We believe that sometimes, all we need is someone to talk to—someone who understands, without judgment.
                </p>
                
                <p className="text-[hsl(var(--foreground))]/80 mb-8 text-lg">
                  Whisper connects people based on how they're feeling, creating a space where authenticity and emotional honesty are celebrated.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="gradient-btn text-white font-medium px-8 py-4 rounded-full">
                    Join Our Team
                  </Button>
                  <Button variant="outline" className="border-[hsl(var(--whisper-purple))]/30 text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))]/10 px-8 py-4 rounded-full">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-16 text-center bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Our Values
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass-card p-8 rounded-3xl text-center">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-[hsl(var(--foreground))]/70">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-16 text-center bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Meet Our Team
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="glass-card p-6 rounded-3xl text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white/70">
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <div className="text-sm text-[hsl(var(--whisper-purple))] mb-3">{member.role}</div>
                  <p className="text-[hsl(var(--foreground))]/70 text-sm italic">"{member.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-16 text-center bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Our Journey
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[hsl(var(--whisper-purple))]/30 transform md:translate-x-[-0.5px]"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 pb-10 md:pb-0">
                      <div className={`glass-card p-6 rounded-3xl ${index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                        <div className="font-bold text-lg mb-2 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">{milestone.title}</div>
                        <p className="text-[hsl(var(--foreground))]/70">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Year marker */}
                    <div className="absolute top-0 left-0 md:left-1/2 transform md:translate-x-[-50%] flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] flex items-center justify-center text-white font-bold text-sm">
                        {milestone.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-12 rounded-3xl text-center relative overflow-hidden">
              <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-[hsl(var(--whisper-purple))] rounded-full blur-3xl opacity-10"></div>
              <div className="absolute -z-10 bottom-0 left-0 w-96 h-96 bg-[hsl(var(--whisper-pink))] rounded-full blur-3xl opacity-10"></div>
              
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                Be Part of Our Story
              </h2>
              
              <p className="text-lg text-[hsl(var(--foreground))]/80 mb-10 max-w-2xl mx-auto">
                Join millions of people creating meaningful connections every day.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/mood">
                  <Button className="gradient-btn text-white font-medium px-8 py-4 rounded-full">
                    Start Whispering
                  </Button>
                </Link>
                <Link href="/discover">
                  <Button variant="outline" className="border-[hsl(var(--whisper-purple))]/30 text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))]/10 px-8 py-4 rounded-full">
                    Explore Stories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
