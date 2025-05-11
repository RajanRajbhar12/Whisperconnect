import { Link } from "wouter";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6 px-4 sm:px-6 relative z-10"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="inline-block mr-2 h-10 w-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50">
            🌿
          </span>
          <span className="bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">Whisper</span>
        </Link>
        <nav className="glass-card py-2 px-4 rounded-full">
          <ul className="flex space-x-8">
            <li>
              <a 
                href="#about" 
                className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--whisper-purple))] transition-colors text-sm font-medium"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#faq" 
                className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--whisper-purple))] transition-colors text-sm font-medium"
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
