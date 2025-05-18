import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#1A0F2E] text-white">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-transparent bg-clip-text mb-4">
              404
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300/80">
              Oops! Page not found
            </p>
          </motion.div>
          
          <motion.p 
            className="text-gray-400 mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#FF9E64] to-[#B76E79] text-white font-medium px-8 py-6 rounded-full text-lg hover:from-[#FF8F50] hover:to-[#A65D68] transition-all">
                Return Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
