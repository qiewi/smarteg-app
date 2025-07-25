"use client";

import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Youtube, ArrowUp } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-primary text-white py-12 relative overflow-hidden"
    >
      {/* Large icon background */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-96 h-96 opacity-10">
        <Image 
          src="/just-icon.png" 
          alt="Smarteg Icon" 
          width={384}
          height={384}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Features */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Features</h4>
            <ul className="space-y-2 text-gray-200">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Voice Sales Recording</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">AI Supply Prediction</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Waste Management</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Real-time Notifications</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Inventory Tracking</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-gray-200">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Training Videos</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">API Documentation</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-200">
              <li><a href="#" className="hover:text-blue-300 transition-colors">About Smarteg</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Partnerships</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Careers</a></li>
            </ul>
          </div>
          
          {/* Back to Top */}
          <div className="flex justify-end items-start">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white hover:text-blue-300 transition-colors bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 shadow-lg hover:bg-white/20"
            >
              <ArrowUp size={24} />
            </button>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="mb-4 md:mb-0">
            <Image 
              src="/logo-white.png" 
              alt="Smarteg Logo" 
              width={128}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-white hover:text-blue-300 transition-colors bg-white/10 rounded-full p-2">
              <Github size={20} />
            </a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors bg-white/10 rounded-full p-2">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors bg-white/10 rounded-full p-2">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-white hover:text-blue-300 transition-colors bg-white/10 rounded-full p-2">
              <Youtube size={20} />
            </a>
          </div>
          
          {/* Copyright and Policy Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-200">
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-blue-300 transition-colors">Terms of Service</a>
              <span className="text-gray-400">|</span>
              <a href="#" className="hover:text-blue-300 transition-colors">Cookie Policy</a>
            </div>
            <div className="md:ml-6">
              © 2025 Smarteg. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 