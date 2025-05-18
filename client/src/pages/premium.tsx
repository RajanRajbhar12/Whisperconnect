import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const PremiumFeatures = [
  {
    title: "Priority Matching",
    description: "Get matched first, every time.",
    icon: "⚡",
    gradient: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "Extended Calls",
    description: "No time limits on your conversations.",
    icon: "🕒",
    gradient: "from-[#B76E79] to-[#E6B0AA]"
  },
  {
    title: "Mood Filters",
    description: "Connect with people by more specific feelings.",
    icon: "🔍",
    gradient: "from-[#FF9E64] to-[#B76E79]"
  },
  {
    title: "Premium Badges",
    description: "Stand out with exclusive profile badges.",
    icon: "✨",
    gradient: "from-[#B76E79] to-[#E6B0AA]"
  },
  {
    title: "Voice Effects",
    description: "Add fun voice filters to your calls.",
    icon: "🎤",
    gradient: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    title: "24/7 Support",
    description: "Premium members get priority support.",
    icon: "🛟",
    gradient: "from-[#B76E79] to-[#E6B0AA]"
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
    gradient: "from-[#FF9E64] to-[#FFB347]"
  },
  {
    name: "Yearly",
    price: "$79.99",
    period: "per year",
    features: ["All premium features", "Save 33%", "Priority matching"],
    cta: "Start Yearly",
    highlight: true,
    gradient: "from-[#FF9E64] to-[#B76E79]"
  },
  {
    name: "Lifetime",
    price: "$199.99",
    period: "one-time",
    features: ["All premium features", "Never pay again", "Early access to new features"],
    cta: "Get Lifetime",
    highlight: false,
    gradient: "from-[#B76E79] to-[#E6B0AA]"
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF9E64] rounded-full blur-3xl opacity-10 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B76E79] rounded-full blur-3xl opacity-10 -z-10"></div>
          
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-[#1A0F2E]/50 backdrop-blur-sm rounded-full mb-6 border border-[#FF9E64]/20"
            >
              <span className="text-sm font-medium bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text">✨ Elevate your experience</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FF9E64] via-[#B76E79] to-[#E6B0AA] text-transparent bg-clip-text"
            >
              Whisper Connect Premium
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300/80 mb-10 max-w-2xl mx-auto"
            >
              Unlock advanced features and enhance your connections with our premium subscription.
            </motion.p>
          </div>
        </section>
        
        {/* Premium Features */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Exclusive Premium Features
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PremiumFeatures.map((feature, index) => (
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
                    className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r ${feature.gradient} text-4xl mb-6 border border-[#FF9E64]/20`}
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
        
        {/* Pricing */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              Choose Your Plan
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PricingTiers.map((tier, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-[#1A0F2E]/50 backdrop-blur-sm p-8 rounded-3xl relative border ${
                    tier.highlight 
                      ? 'border-[#FF9E64]' 
                      : 'border-[#FF9E64]/20 hover:border-[#FF9E64]/40'
                  } transition-colors`}
                >
                  {tier.highlight && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white px-4 py-1 rounded-full text-sm font-medium"
                    >
                      Most Popular
                    </motion.div>
                  )}
                  
                  <h3 className="text-xl font-semibold mb-2 text-[#FF9E64]">{tier.name}</h3>
                  
                  <div className="flex items-end gap-1 mb-4">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${tier.gradient} text-transparent bg-clip-text`}>
                      {tier.price}
                    </div>
                    <div className="text-gray-300/60 text-sm mb-1">
                      {tier.period}
                    </div>
                  </div>
                  
                  <ul className="mb-8 space-y-2">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300/80">
                        <span className="mr-2 text-[#FF9E64]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full rounded-full py-6 ${
                      tier.highlight 
                        ? 'bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white hover:from-[#FF8F50] hover:to-[#A65D68]' 
                        : 'bg-[#1A0F2E]/50 hover:bg-[#1A0F2E]/70 text-[#FF9E64] border border-[#FF9E64]/20'
                    } transition-all`}
                  >
                    {tier.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12 text-gray-300/60 text-sm"
            >
              All plans include a 7-day free trial. No credit card required.
            </motion.div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-4 relative">
          <div className="container mx-auto max-w-6xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text"
            >
              What Our Users Say
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex T.",
                  role: "Premium Member",
                  avatar: "🧑",
                  quote: "Whisper Connect Premium made a huge difference! I get matched so much faster now and the voice effects are super fun during calls."
                },
                {
                  name: "Jamie K.",
                  role: "Premium Member",
                  avatar: "👩",
                  quote: "The extended calls are everything. Sometimes you just need to talk longer, and Premium makes that possible. Worth every penny!"
                },
                {
                  name: "Michael R.",
                  role: "Premium Member",
                  avatar: "🧔",
                  quote: "I was skeptical at first, but the Premium features really enhance the experience. The mood filters help me find exactly what I'm looking for."
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1A0F2E]/50 backdrop-blur-sm p-8 rounded-3xl border border-[#FF9E64]/20 hover:border-[#FF9E64]/40 transition-colors"
                >
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF9E64] to-[#B76E79] flex items-center justify-center text-xl border border-[#FF9E64]/20"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, -5, 0],
                        transition: { duration: 0.5 }
                      }}
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div className="ml-4">
                      <div className="font-semibold text-[#FF9E64]">{testimonial.name}</div>
                      <div className="text-gray-300/60 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-300/80 italic">
                    "{testimonial.quote}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-4 relative">
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
                Ready to level up your experience?
              </h2>
              
              <p className="text-lg text-gray-300/80 mb-10 max-w-2xl mx-auto">
                Start your 7-day free trial today and experience the full power of Whisper Connect.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white font-medium px-12 py-6 rounded-full text-lg hover:from-[#FF8F50] hover:to-[#A65D68] transition-all">
                  Try Premium Free
                </Button>
              </motion.div>
              
              <div className="mt-6 text-gray-300/60 text-sm">
                No credit card required. Cancel anytime.
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Premium;