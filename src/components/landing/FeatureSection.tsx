"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Trash2, Brain, Mic, Package, Banknote } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Pengelolaan Limbah Makanan Sisa",
    description: "Pantau dan hitung limbah makanan harian secara otomatis untuk mengurangi pemborosan.",
    icon: Trash2,
    visual: "waste-chart",
    badgeText: "Limbah"
  },
  {
    title: "Prediksi Kebutuhan Dengan AI",
    description: "Prediksi jumlah masakan yang perlu disiapkan berdasarkan data penjualan.",
    icon: Brain,
    visual: "ai-prediction",
    badgeText: "AI"
  },
  {
    title: "Pencatatan Penjualan Lewat Suara",
    description: "Cukup ucapkan pesanan, dan Smarteg mencatat penjualan serta stok otomatis.",
    icon: Mic,
    visual: "voice-sales",
    badgeText: "Suara"
  },
  {
    title: "Pencatatan Stok Otomatis",
    description: "Ucapkan stok awal Anda, dan Smarteg mencatatnya secara otomatis.",
    icon: Package,
    visual: "stock-tracking",
    badgeText: "Stok"
  },
  {
    title: "Notifikasi Menu Ready dan Promosi Real-Time",
    description: "Umumkan menu baru di media sosial dengan satu klik.",
    icon: Banknote,
    visual: "social-promo",
    badgeText: "Promosi"
  }
];

const FeatureSection = () => {
  const renderVisual = (type: string) => {
    switch (type) {
      case "waste-chart":
        return (
          <Image 
            src="/features/Pengelolaan Limbah Makanan Sisa.png" 
            alt="Pengelolaan Limbah Makanan Sisa"
            width={500}
            height={160}
            className="w-full h-40 object-cover rounded-lg"
          />
        );
      case "ai-prediction":
        return (
          <Image 
            src="/features/Prediksi Kebutuhan Harian Berbasis AI.png" 
            alt="Prediksi Kebutuhan Harian Berbasis AI"
            width={500}
            height={160}
            className="w-full h-40 object-cover rounded-lg"
          />
        );
      case "voice-sales":
        return (
          <Image 
            src="/features/Pencatatan Penjualan Lewat Suara.png" 
            alt="Pencatatan Penjualan Lewat Suara"
            width={500}
            height={160}
            className="w-full h-40 object-cover rounded-lg"
          />
        );
      case "stock-tracking":
        return (
          <Image 
            src="/features/Pencatatan Stok Otomatis.png" 
            alt="Pencatatan Stok Otomatis"
            width={500}
            height={192}
            className="w-full h-48 object-cover rounded-lg"
          />
        );
      case "social-promo":
        return (
          <Image 
            src="/features/Notifikasi Menu Ready dan Promosi Real-Time.png" 
            alt="Notifikasi Menu Ready dan Promosi Real-Time"
            width={500}
            height={192}
            className="w-full h-48 object-cover rounded-lg"
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Banknote className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
              Fitur Utama
            </Badge>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 mx-20">
          Prediksi AI dan Voice-to-Text untuk Warteg <span className="font-eb-garamond italic font-normal">Berkelanjutan</span>
          </h2>
        </motion.div>

        {/* Feature Cards - Bento Box Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {/* Top Row - 3 Cards */}
          {features.slice(0, 3).map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <CardContent className="px-6 pt-6 pb-0">
                  <Badge className="mb-4 bg-primer text-white">
                    <feature.icon className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
                    {feature.badgeText}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {feature.description}
                  </p>
                  {renderVisual(feature.visual)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Row - 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.slice(3, 5).map((feature, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
            >
              <Card className="h-full bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                <CardContent className="px-6 pt-6 pb-0">
                  <Badge className="mb-4 bg-primary text-white">
                    <feature.icon className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
                    {feature.badgeText}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {feature.description}
                  </p>
                  {renderVisual(feature.visual)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default FeatureSection; 