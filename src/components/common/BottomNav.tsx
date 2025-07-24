"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Mic, User } from "lucide-react";
import { motion } from "framer-motion";

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Beranda",
      icon: Home,
      href: "/dashboard",
      isActive: pathname === "/dashboard"
    },
    {
      label: "Profile", 
      icon: User,
      href: "/profile",
      isActive: pathname === "/profile"
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleRecord = () => {
    // Handle recording functionality
    console.log("Start recording...");
  };

  return (
    <motion.nav 
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50"
    >
      <div className="relative flex items-center justify-around px-6 py-4">
        {/* Beranda */}
        <button
          onClick={() => handleNavigation(navItems[0].href)}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            navItems[0].isActive 
              ? "text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Home 
            size={24} 
            className={navItems[0].isActive ? "fill-current" : ""} 
          />
          <span className="text-xs mt-1 font-medium">{navItems[0].label}</span>
        </button>

        {/* Catat (Center Button) - Absolutely positioned to overflow */}
        <div className="relative flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecord}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2"
          >
            {/* Gradient Background Circle */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-yellow-400 flex items-center justify-center shadow-xl">
              {/* Inner Circle */}
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Mic size={28} className="text-white" />
              </div>
            </div>
          </motion.button>
          {/* Label positioned to align with other nav labels */}
          <span className="text-xs font-medium text-gray-600 mt-8">
            Catat
          </span>
        </div>

        {/* Profile */}
        <button
          onClick={() => handleNavigation(navItems[1].href)}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            navItems[1].isActive 
              ? "text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User 
            size={24} 
            className={navItems[1].isActive ? "fill-current" : ""} 
          />
          <span className="text-xs mt-1 font-medium">{navItems[1].label}</span>
        </button>
      </div>
    </motion.nav>
  );
};

export default BottomNav; 