'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <Card className="bg-cover bg-center bg-no-repeat rounded-3xl shadow-lg min-h-[300px] relative overflow-hidden" style={{ backgroundImage: 'url(/bg-cta.jpg)' }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <CardContent className="p-8 md:p-12 h-full relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">
                {/* Left side - Text content */}
                <div className="text-left">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                    Kurangi Limbah, Maksimalkan Keuntungan!
                  </h3>
                  <p className="text-lg text-white/80 mb-8">
                    Bergabung dengan ribuan warteg yang telah menggunakan Smarteg
                  </p>
                  <Link href="/login">
                    <Button 
                      size="lg" 
                      className="bg-secondary hover:bg-secondary/80 text-white font-semibold px-8 h-14 text-lg rounded-xl shadow-xl border-0"
                    >
                      Coba Demo Gratis
                      <ArrowUpRight className="ml-2" size={20} />
                    </Button>
                  </Link>
                </div>
                
                {/* Right side - Phone mockup placeholder */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-64 h-80 bg-gradient-to-b from-gray-200 to-gray-300 rounded-3xl shadow-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Phone Mockup</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
} 