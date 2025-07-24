"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white py-16 md:py-24 min-h-[600px] flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Smart Warteg Management
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-white/90 max-w-lg">
              Kelola Warteg Anda dengan teknologi AI dan Voice Recognition. 
              Tingkatkan efisiensi, kurangi waste, dan maksimalkan profit!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="bg-white text-primary-600 hover:bg-white/90 hover:text-primary-700 font-semibold w-full h-12 text-lg"
                >
                  Mulai Gratis
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold w-full h-12 text-lg bg-transparent"
                >
                  Lihat Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-secondary-400 rounded-full"></div>
                <span className="text-white/90 font-medium">Voice Recording</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-accent-400 rounded-full"></div>
                <span className="text-white/90 font-medium">AI Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-white/90 font-medium">Real-time Tracking</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:justify-self-end w-full"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-white">
                  Fitur Unggulan
                </h3>
                <div className="space-y-5">
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="w-10 h-10 bg-secondary-500/20 rounded-lg flex items-center justify-center text-xl">
                      🎤
                    </div>
                    <div>
                      <p className="font-semibold text-white">Voice Commands</p>
                      <p className="text-sm text-white/70">Catat stok dengan suara</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <div>
                      <p className="font-semibold text-white">AI Prediction</p>
                      <p className="text-sm text-white/70">Prediksi kebutuhan stok</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <div className="w-10 h-10 bg-primary-300/20 rounded-lg flex items-center justify-center text-xl">
                      📊
                    </div>
                    <div>
                      <p className="font-semibold text-white">Real-time Analytics</p>
                      <p className="text-sm text-white/70">Monitor penjualan langsung</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 