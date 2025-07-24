"use client";

import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-900 text-white py-8"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SmartEG</h3>
            <p className="text-gray-400">
              Smart Warteg Management App untuk UMKM Indonesia
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Voice-based Stock Recording</li>
              <li>Sales Tracking</li>
              <li>Waste Management</li>
              <li>Supply Prediction</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              Built for Indonesian UMKM sustainability
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SmartEG. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 