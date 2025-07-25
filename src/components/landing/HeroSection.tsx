"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import { ZapIcon, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/bg-hero.jpg"
        alt="Hero Background"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
        quality={90}
      />
      {/* Dark overlay with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Floating SDGs */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* SDG 2 - Zero Hunger - Kiri atas */}
        <div className="absolute top-20 left-8 w-24 h-24 opacity-40 blur-sm rounded-sm overflow-hidden">
          <Image
            src="/sdg/E_WEB_02.png"
            alt="SDG 2 - Zero Hunger"
            fill
            className="object-cover"
          />
        </div>
        
        {/* SDG 8 - Decent Work - Kanan atas */}
        <div className="absolute top-16 right-12 w-28 h-28 opacity-35 blur-sm rounded-sm overflow-hidden">
          <Image
            src="/sdg/E_WEB_08.png"
            alt="SDG 8 - Decent Work"
            fill
            className="object-cover"
          />
        </div>
        
        {/* SDG 9 - Industry Innovation - Kiri tengah */}
        <div className="absolute top-[300px] left-24 w-20 h-20 opacity-45 blur-[2px] rounded-lg overflow-hidden">
          <Image
            src="/sdg/E_WEB_09.png"
            alt="SDG 9 - Industry Innovation"
            fill
            className="object-cover"
          />
        </div>
        
        {/* SDG 12 - Responsible Consumption - Kanan tengah */}
        <div className="absolute top-[300px] right-24 w-24 h-24 opacity-40 blur-[2px] rounded-lg overflow-hidden">
          <Image
            src="/sdg/E_WEB_12.png"
            alt="SDG 12 - Responsible Consumption"
            fill
            className="object-cover"
          />
        </div>
        
        {/* SDG 13 - Climate Action - Tengah bawah */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-30 blur-xl rounded-3xl overflow-hidden">
          <Image
            src="/sdg/E_WEB_13.png"
            alt="SDG 13 - Climate Action"
            fill
            className="object-cover"
          />
        </div>
      </div>
      {/* Content */}
      <div className="relative z-30 container mx-auto px-4 text-center mt-32">
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