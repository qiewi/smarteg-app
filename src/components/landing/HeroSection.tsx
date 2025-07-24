"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ZapIcon, ArrowUpRight } from "lucide-react";

const HeroSection = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/bg-hero.jpg)' }}>
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-32">
        <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto space-y-4"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex justify-center"
          >
            <Badge className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 text-sm font-medium">
              <ZapIcon className="-ms-0.5 mr-1 text-secondary" size={12} aria-hidden="true" />
              Kurangi Limbah Makanan Hingga 70%
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Optimalkan <span className="font-eb-garamond italic font-normal">Stok,</span> Kurangi <span className="font-eb-garamond italic font-normal">Limbah,</span>{" "}
            <span>Tingkatkan</span> <span className="font-eb-garamond italic font-normal">Keuntungan</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl lg:text-xl leading-relaxed text-gray-300 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Smarteg adalah aplikasi berbasis suara yang membantu Warteg mengelola stok, 
            mencatat penjualan, memprediksi kebutuhan, dan mengurangi limbah makanan secara otomatis.
          </motion.p>

          {/* CTA Button */}
          <motion.div 
            className="flex justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/80 text-white font-semibold w-full sm:w-auto px-8 h-14 text-lg rounded-xl shadow-xl border-0"
                              >
                  Coba Demo
                  <ArrowUpRight className="-ml-1" size={20} />
                </Button>
            </Link>
          </motion.div>

        </motion.div>
        </div>

        {/* Demo Video - Full Width */}
        <motion.div 
          className="flex justify-center pt-8 -mx-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="w-full max-w-none px-2">
            <video
              autoPlay
              muted
              loop
              playsInline
                              className="w-full rounded-t-lg shadow-2xl"
            >
              <source src="https://cdn.cargovision.app/video.mp4" type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>


    </section>
  );
};

export default HeroSection; 