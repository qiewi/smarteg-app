"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Mic, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);

  // Check if currently on voice page to determine recording state
  useEffect(() => {
    if (pathname === "/voice") {
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  }, [pathname]);

  const navItems = [
    {
      label: "Beranda",
      icon: Home,
      href: "/home",
      isActive: pathname === "/home"
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
    if (isRecording) {
      // If currently recording, go back to home (this will stop recording in voice page)
      console.log("Stop recording...");
      router.push("/home");
    } else {
      // Start recording by navigating to voice page with autoStart
      console.log("Start recording...");
      router.push("/voice?autoStart=true");
    }
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
              ? "text-primary" 
              : "text-gray-500 hover:text-primary"
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
            onClick={handleRecord}
            className="absolute -top-12 left-1/2 transform -translate-x-1/2"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {/* Gradient Background Circle */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              isRecording 
                ? "bg-gradient-to-br from-red-500 to-red-600" 
                : "bg-gradient-to-br from-primary to-accent"
            }`}>
              {/* Inner Circle */}
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {isRecording ? (
                  <X size={28} className="text-white" />
                ) : (
                  <Mic size={28} className="text-white" />
                )}
              </div>
            </div>
          </motion.button>
          {/* Label positioned to align with other nav labels */}
          <span className={`text-xs font-medium mt-8 transition-colors ${
            isRecording ? "text-red-500" : "text-gray-600"
          }`}>
            {isRecording ? "Tutup" : "Catat"}
          </span>
        </div>

        {/* Profile */}
        <button
          onClick={() => handleNavigation(navItems[1].href)}
          className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            navItems[1].isActive 
              ? "text-primary" 
              : "text-gray-500 hover:text-primary"
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