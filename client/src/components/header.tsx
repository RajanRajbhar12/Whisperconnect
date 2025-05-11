import { Link, useLocation } from "wouter";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path ? 
      "text-[hsl(var(--whisper-purple))]" : 
      "text-[hsl(var(--foreground))] hover:text-[hsl(var(--whisper-purple))]";
  };
  
  return (
    <header className="py-6 px-4 sm:px-6 relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="inline-block mr-2 h-10 w-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50">
            🌿
          </span>
          <span className="bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-transparent bg-clip-text">Whisper</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="block md:hidden glass-card p-2 rounded-full"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block glass-card py-2 px-4 rounded-full">
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
                href="/premium" 
                className={`${isActive('/premium')} transition-colors text-sm font-medium`}
              >
                Premium
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
                className="bg-gradient-to-r from-[hsl(var(--whisper-purple))] to-[hsl(var(--whisper-pink))] text-white px-4 py-1 rounded-full text-sm font-medium"
              >
                Start
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 glass-card mx-4 p-6 rounded-3xl z-50 shadow-xl">
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
                href="/premium" 
                className={`${isActive('/premium')} transition-colors block py-2 text-center font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Premium
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
            <li className="pt-4 border-t border-white/20">
              <Link 
                href="/mood" 
                className="gradient-btn text-white py-3 rounded-full font-medium block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Whispering
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
