"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-sm border-b"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          SmartEG
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-primary">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-primary">
            Dashboard
          </Link>
        </nav>
        
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </motion.header>
  );
};

export default Header; 