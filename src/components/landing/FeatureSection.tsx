"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const features = [
  {
    title: "Voice-based Stock Recording",
    description: "Catat stok dengan mudah menggunakan suara. Sistem akan mengkonfirmasi dan menyimpan data secara otomatis.",
    category: "Voice Technology",
    highlight: "Speech-to-Text"
  },
  {
    title: "Real-time Sales Tracking",
    description: "Pantau penjualan secara real-time dengan integrasi AI untuk deteksi anomali dan pencurian.",
    category: "Analytics",
    highlight: "Real-time"
  },
  {
    title: "Supply Prediction Algorithm",
    description: "Algoritma prediksi berbasis frontend untuk memperkirakan kebutuhan stok harian berdasarkan data historis.",
    category: "AI Prediction",
    highlight: "Frontend AI"
  },
  {
    title: "Waste Management Reports",
    description: "Laporan waste otomatis untuk aplikasi green financing dan compliance sustainability.",
    category: "Sustainability",
    highlight: "Green Finance"
  },
  {
    title: "Social Media Integration",
    description: "Generate otomatis konten media sosial untuk mengumumkan menu ready dan menarik pelanggan.",
    category: "Marketing",
    highlight: "Auto Content"
  },
  {
    title: "PWA Experience",
    description: "Progressive Web App yang dapat diinstall di mobile device untuk akses cepat dan offline capability.",
    category: "Technology",
    highlight: "Installable"
  }
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fitur Unggulan SmartEG
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Teknologi terdepan untuk membantu UMKM Warteg meningkatkan efisiensi, 
            mengurangi waste, dan mendukung sustainability.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{feature.category}</Badge>
                    <Badge variant="outline">{feature.highlight}</Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
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