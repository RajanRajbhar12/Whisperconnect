import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-12 px-4 relative overflow-hidden">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[hsl(var(--whisper-purple))]/5 to-transparent"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] rounded-full"></div>
          </div>
          
          <p className="mb-6 font-medium text-base leading-relaxed text-[hsl(var(--foreground))]/80">
            Whisper is not about dating, swiping, or judgment.<br />
            It's about human presence, even for a few minutes.<br />
            <span className="bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">When life gets too loud, just whisper.</span>
          </p>
          
          <div className="flex justify-center space-x-4 mb-6">
            <a href="#" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-[hsl(var(--whisper-purple))] hover:bg-[hsl(var(--whisper-purple))] hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z"></path>
              </svg>
            </a>
          </div>
          
          <p className="text-[hsl(var(--foreground))]/50 text-sm">
            &copy; {new Date().getFullYear()} Whisper. All rights reserved.
          </p>
        </motion.div>
      </div>
      
      {/* Decorative blobs */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-[hsl(var(--whisper-blue))]/5 blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-[hsl(var(--whisper-pink))]/5 blur-3xl"></div>
    </footer>
  );
};

export default Footer;
