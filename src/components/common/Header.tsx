"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b border-primary-100/50 sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
          SmartEG
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors font-medium">
            Dashboard
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Link href="/login">
            <Button variant="outline" className="border-primary-300 text-primary-600 hover:bg-primary-50 hover:text-primary-700 font-medium">
              Login
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 