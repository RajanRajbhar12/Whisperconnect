import { Link } from "wouter";
import { motion } from "framer-motion";

const Logo = () => (
  <motion.div
    className="relative w-8 h-8"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9E64] to-[#B76E79] opacity-90 blur-sm"></div>
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9E64] to-[#B76E79] flex items-center justify-center">
      <svg
        width="20"
        height="20"
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

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="container mx-auto">
        <div className="bg-[#1A0F2E]/50 backdrop-blur-sm p-8 sm:p-12 rounded-3xl border border-[#FF9E64]/20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <Link href="/" className="text-2xl font-bold flex items-center gap-3 mb-4">
                <Logo />
                <span className="bg-gradient-to-r from-[#FF9E64] via-[#B76E79] to-[#E6B0AA] text-transparent bg-clip-text">
                  Whisper Connect
                </span>
              </Link>
              <p className="text-gray-300/70 mb-6 max-w-xs">
                Connect through voice with people who understand how you feel. No profiles, no pictures—just real conversations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#FF9E64]/10 border border-[#FF9E64]/20 flex items-center justify-center text-[#FF9E64] hover:bg-[#FF9E64]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#FF9E64]/10 border border-[#FF9E64]/20 flex items-center justify-center text-[#FF9E64] hover:bg-[#FF9E64]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#FF9E64]/10 border border-[#FF9E64]/20 flex items-center justify-center text-[#FF9E64] hover:bg-[#FF9E64]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#FF9E64]/10 border border-[#FF9E64]/20 flex items-center justify-center text-[#FF9E64] hover:bg-[#FF9E64]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FF9E64] mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/discover" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Discover
                  </Link>
                </li>
                <li>
                  <Link href="/premium" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Premium
                  </Link>
                </li>
                <li>
                  <Link href="/mood" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Start Talking
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FF9E64] mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FF9E64] mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300/70 hover:text-[#FF9E64] transition-colors">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-[#FF9E64]/20 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300/60 text-sm">
              © {currentYear} Whisper Connect. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-300/60 hover:text-[#FF9E64] text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-300/60 hover:text-[#FF9E64] text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-300/60 hover:text-[#FF9E64] text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;