"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { authAPI } from "@/lib/api";
import { useState } from "react";

const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      // Redirect to Google OAuth
      authAPI.startGoogleAuth();
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      // You can add error handling UI here
    }
  };

  return (
    <motion.div
      whileHover={!isLoading ? { scale: 1.02 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      className="w-full"
    >
      <Button 
        onClick={handleLogin}
        size="lg"
        disabled={isLoading}
        className="w-full h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-base shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl border-0 relative overflow-hidden group"
      >
        {/* Background shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {isLoading ? (
          <div className="flex items-center justify-center relative z-10">
            <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Menghubungkan...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center relative z-10">
            <svg 
              className="w-6 h-6 mr-3" 
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path 
                fill="currentColor" 
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path 
                fill="currentColor" 
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path 
                fill="currentColor" 
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Masuk dengan Google</span>
          </div>
        )}
      </Button>
    </motion.div>
  );
};

export default LoginButton; 