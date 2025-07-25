"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        setIsVisible(false);
      } else {
        // Scrolling up - show header
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-3 left-0 right-0 z-50 flex justify-center"
      >
        <div className="bg-black/95 backdrop-blur-md rounded-full px-4 md:px-12 py-4 mx-2 md:mx-8 lg:mx-12 shadow-2xl max-w-5xl w-full h-20 flex items-center opacity-95 border border-gray-700">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 relative">
              <div className="w-12 h-12 md:w-32 md:h-32 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/navbar-logo.png" 
                  alt="Smarteg Logo" 
                  width={100} 
                  height={100}
                  className="hidden md:block w-32 h-32 object-contain"
                  priority
                />
                <Image 
                  src="/icon-only.png" 
                  alt="Smarteg Logo" 
                  width={40} 
                  height={40}
                  className="md:hidden w-10 h-10 object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Navigation Menu - Desktop */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 -ml-8">
              <Link 
                href="/" 
                className="text-white hover:text-secondary transition-colors duration-200 font-medium"
              >
                Home
              </Link>
              <Link 
                href="/milestones" 
                className="text-white hover:text-secondary transition-colors duration-200 font-medium"
              >
                Milestones
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-secondary transition-colors duration-200 font-medium"
              >
                About
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2 z-60"
              aria-label="Toggle mobile menu"
            >
              <svg 
                className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Download Button */}
            <div className="hidden md:flex items-center flex-shrink-0 mr-4">
              <Button 
                className="bg-white text-black hover:bg-primer hover:text-white rounded-full px-6 py-6 font-medium transition-all duration-200 shadow-lg hover:shadow-xl -mr-10"
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={toggleMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-28 left-4 right-4 z-50 bg-black/95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl"
            >
              <nav className="flex flex-col p-6 space-y-4">
                <Link 
                  href="/" 
                  className="text-white hover:text-secondary transition-colors duration-200 font-medium py-3 px-4 rounded-lg hover:bg-white/10"
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  href="/milestones" 
                  className="text-white hover:text-secondary transition-colors duration-200 font-medium py-3 px-4 rounded-lg hover:bg-white/10"
                  onClick={toggleMobileMenu}
                >
                  Milestones
                </Link>
                <Link 
                  href="/about" 
                  className="text-white hover:text-secondary transition-colors duration-200 font-medium py-3 px-4 rounded-lg hover:bg-white/10"
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                
                {/* Mobile Download Button */}
                <div className="pt-4 border-t border-gray-700">
                  <Button 
                    className="w-full bg-white text-black hover:bg-primer hover:text-white rounded-full px-6 py-3 font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={toggleMobileMenu}
                  >
                    Download
                  </Button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header; 