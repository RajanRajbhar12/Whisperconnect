import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

const Logo = () => (
  <motion.div
    className="relative w-10 h-10"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9E64] to-[#B76E79] opacity-90 blur-sm"></div>
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9E64] to-[#B76E79] flex items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
          fill="currentColor"
        />
        <path
          d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"
          fill="currentColor"
        />
        <path
          d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </motion.div>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path ? 
      "text-[#FF9E64]" : 
      "text-gray-300 hover:text-[#FF9E64]";
  };
  
  return (
    <header className="py-6 px-4 sm:px-6 relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center gap-3">
          <Logo />
          <span className="bg-gradient-to-r from-[#FF9E64] via-[#B76E79] to-[#E6B0AA] text-transparent bg-clip-text">
            Whisper Connect
          </span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="block md:hidden p-2 rounded-full bg-[#FF9E64]/10 border border-[#FF9E64]/20"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9E64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9E64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block bg-[#1A0F2E]/50 backdrop-blur-sm py-2 px-6 rounded-full border border-[#FF9E64]/20">
          <ul className="flex space-x-8">
            <li>
              <Link 
                href="/discover" 
                className={`${isActive('/discover')} transition-colors text-sm font-medium`}
              >
                Discover
              </Link>
            </li>
            
            <li>
              <Link 
                href="/about" 
                className={`${isActive('/about')} transition-colors text-sm font-medium`}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/help" 
                className={`${isActive('/help')} transition-colors text-sm font-medium`}
              >
                Help
              </Link>
            </li>
            <li>
              <Link 
                href="/mood" 
                className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white px-6 py-2 rounded-full text-sm font-medium hover:from-[#FF8F50] hover:to-[#A65D68] transition-all"
              >
                Start Talking
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-[#1A0F2E]/95 backdrop-blur-md mx-4 p-6 rounded-3xl z-50 border border-[#FF9E64]/20"
        >
          <ul className="space-y-4">
            <li>
              <Link 
                href="/discover" 
                className={`${isActive('/discover')} transition-colors block py-2 text-center font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Discover
              </Link>
            </li>
            
            <li>
              <Link 
                href="/about" 
                className={`${isActive('/about')} transition-colors block py-2 text-center font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/help" 
                className={`${isActive('/help')} transition-colors block py-2 text-center font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
            </li>
            <li className="pt-4 border-t border-[#FF9E64]/20">
              <Link 
                href="/mood" 
                className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white py-3 rounded-full font-medium block text-center hover:from-[#FF8F50] hover:to-[#A65D68] transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Talking
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
