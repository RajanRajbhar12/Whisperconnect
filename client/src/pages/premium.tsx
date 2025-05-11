import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const PremiumFeatures = [
  {
    title: "Priority Matching",
    description: "Get matched first, every time.",
    icon: "⚡",
    gradient: "from-yellow-400 to-amber-500"
  },
  {
    title: "Extended Calls",
    description: "No time limits on your conversations.",
    icon: "🕒",
    gradient: "from-blue-400 to-indigo-500"
  },
  {
    title: "Mood Filters",
    description: "Connect with people by more specific feelings.",
    icon: "🔍",
    gradient: "from-purple-400 to-violet-500"
  },
  {
    title: "Premium Badges",
    description: "Stand out with exclusive profile badges.",
    icon: "✨",
    gradient: "from-pink-400 to-rose-500"
  },
  {
    title: "Voice Effects",
    description: "Add fun voice filters to your calls.",
    icon: "🎤",
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    title: "24/7 Support",
    description: "Premium members get priority support.",
    icon: "🛟",
    gradient: "from-sky-400 to-cyan-500"
  }
];

const PricingTiers = [
  {
    name: "Monthly",
    price: "$9.99",
    period: "per month",
    features: ["All premium features", "Cancel anytime"],
    cta: "Start Monthly",
    highlight: false,
    gradient: "from-[hsl(var(--whisper-blue))] to-[hsl(var(--whisper-purple))]"
  },
  {
    name: "Yearly",
    price: "$79.99",
    period: "per year",
    features: ["All premium features", "Save 33%", "Priority matching"],
    cta: "Start Yearly",
    highlight: true,
    gradient: "from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))]"
  },
  {
    name: "Lifetime",
    price: "$199.99",
    period: "one-time",
    features: ["All premium features", "Never pay again", "Early access to new features"],
    cta: "Get Lifetime",
    highlight: false,
    gradient: "from-[hsl(var(--whisper-pink))] to-[hsl(var(--accent))]"
  }
];

const Premium = () => {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[hsl(var(--whisper-purple))] rounded-full blur-3xl opacity-10 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[hsl(var(--whisper-pink))] rounded-full blur-3xl opacity-10 -z-10"></div>
          
          <div className="container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/30 backdrop-blur-md rounded-full mb-6 border border-white/50">
              <span className="text-sm font-medium bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">✨ Elevate your experience</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] via-[hsl(var(--primary))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Whisper Premium
            </h1>
            
            <p className="text-lg md:text-xl text-[hsl(var(--foreground))]/80 mb-10 max-w-2xl mx-auto">
              Unlock advanced features and enhance your connections with our premium subscription.
            </p>
          </div>
        </section>
        
        {/* Premium Features */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Exclusive Premium Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PremiumFeatures.map((feature, index) => (
                <div key={index} className="glass-card p-8 rounded-3xl">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${feature.gradient} text-4xl mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-[hsl(var(--foreground))]/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Pricing */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              Choose Your Plan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PricingTiers.map((tier, index) => (
                <div key={index} className={`glass-card p-8 rounded-3xl relative ${tier.highlight ? 'border-2 border-[hsl(var(--whisper-purple))]' : ''}`}>
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  
                  <div className="flex items-end gap-1 mb-4">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${tier.gradient} text-transparent bg-clip-text`}>
                      {tier.price}
                    </div>
                    <div className="text-[hsl(var(--foreground))]/60 text-sm mb-1">
                      {tier.period}
                    </div>
                  </div>
                  
                  <ul className="mb-8 space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-[hsl(var(--foreground))]/80">
                        <span className="mr-2 text-[hsl(var(--whisper-purple))]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={`w-full rounded-full py-6 ${tier.highlight ? 'gradient-btn text-white' : 'bg-white/50 hover:bg-white/80 text-[hsl(var(--foreground))]'}`}>
                    {tier.cta}
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12 text-[hsl(var(--foreground))]/60 text-sm">
              All plans include a 7-day free trial. No credit card required.
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
              What Our Users Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-3xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-xl">
                    🧑
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">Alex T.</div>
                    <div className="text-[hsl(var(--foreground))]/60 text-sm">Premium Member</div>
                  </div>
                </div>
                <p className="text-[hsl(var(--foreground))]/80 italic">
                  "Whisper Premium made a huge difference! I get matched so much faster now and the voice effects are super fun during calls."
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-3xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-xl">
                    👩
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">Jamie K.</div>
                    <div className="text-[hsl(var(--foreground))]/60 text-sm">Premium Member</div>
                  </div>
                </div>
                <p className="text-[hsl(var(--foreground))]/80 italic">
                  "The extended calls are everything. Sometimes you just need to talk longer, and Premium makes that possible. Worth every penny!"
                </p>
              </div>
              
              <div className="glass-card p-8 rounded-3xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-violet-500 flex items-center justify-center text-xl">
                    🧔
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">Michael R.</div>
                    <div className="text-[hsl(var(--foreground))]/60 text-sm">Premium Member</div>
                  </div>
                </div>
                <p className="text-[hsl(var(--foreground))]/80 italic">
                  "I was skeptical at first, but the Premium features really enhance the experience. The mood filters help me find exactly what I'm looking for."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-4xl">
            <div className="glass-card p-12 rounded-3xl text-center relative overflow-hidden">
              <div className="absolute -z-10 top-0 right-0 w-96 h-96 bg-[hsl(var(--whisper-purple))] rounded-full blur-3xl opacity-10"></div>
              <div className="absolute -z-10 bottom-0 left-0 w-96 h-96 bg-[hsl(var(--whisper-pink))] rounded-full blur-3xl opacity-10"></div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">
                Ready to level up your experience?
              </h2>
              
              <p className="text-lg text-[hsl(var(--foreground))]/80 mb-10 max-w-2xl mx-auto">
                Start your 7-day free trial today and experience the full power of Whisper.
              </p>
              
              <Button className="gradient-btn text-white font-medium px-12 py-6 rounded-full text-lg">
                Try Premium Free
              </Button>
              
              <div className="mt-6 text-[hsl(var(--foreground))]/60 text-sm">
                No credit card required. Cancel anytime.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Premium;