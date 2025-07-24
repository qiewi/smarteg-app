"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const features = [
  {
    title: "Voice-based Stock Recording",
    description: "Catat stok dengan mudah menggunakan suara. Sistem akan mengkonfirmasi dan menyimpan data secara otomatis.",
    category: "Voice Technology",
    highlight: "Speech-to-Text",
    color: "secondary"
  },
  {
    title: "Real-time Sales Tracking",
    description: "Pantau penjualan secara real-time dengan integrasi AI untuk deteksi anomali dan pencurian.",
    category: "Analytics",
    highlight: "Real-time",
    color: "primary"
  },
  {
    title: "Supply Prediction Algorithm",
    description: "Algoritma prediksi berbasis frontend untuk memperkirakan kebutuhan stok harian berdasarkan data historis.",
    category: "AI Technology",
    highlight: "Machine Learning",
    color: "accent"
  },
  {
    title: "Waste Management Reports",
    description: "Laporan komprehensif tentang food waste untuk aplikasi green financing dan sustainability.",
    category: "Sustainability",
    highlight: "Green Finance",
    color: "primary"
  },
  {
    title: "Social Media Integration",
    description: "Generate otomatis post suggestion untuk media sosial seperti 'Ayam Ready!' atau 'Tempe hari ini limited edition'.",
    category: "Marketing",
    highlight: "Auto-Generate",
    color: "secondary"
  },
  {
    title: "WebSocket AI Processing",
    description: "Koneksi real-time ke Google Gemini AI untuk validasi data, deteksi discrepancy, dan processing background.",
    category: "AI Technology",
    highlight: "Gemini AI",
    color: "accent"
  }
];

const FeatureSection = () => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          card: "border-primary-200/50 hover:border-primary-300/70 hover:shadow-primary-100/20",
          badge: "bg-primary-50 text-primary-700 border-primary-200",
          highlight: "bg-primary-600 text-white"
        };
      case "secondary":
        return {
          card: "border-secondary-200/50 hover:border-secondary-300/70 hover:shadow-secondary-100/20",
          badge: "bg-secondary-50 text-secondary-700 border-secondary-200",
          highlight: "bg-secondary-600 text-white"
        };
      case "accent":
        return {
          card: "border-accent-200/50 hover:border-accent-300/70 hover:shadow-accent-100/20",
          badge: "bg-accent-50 text-accent-700 border-accent-200",
          highlight: "bg-accent-600 text-white"
        };
      default:
        return {
          card: "border-gray-200 hover:border-gray-300",
          badge: "bg-gray-100 text-gray-700 border-gray-200",
          highlight: "bg-gray-800 text-white"
        };
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600 mb-6">
            Teknologi Terdepan untuk Warteg Modern
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SmartEG mengombinasikan teknologi AI, Voice Recognition, dan Real-time Processing 
            untuk mengoptimalkan operasional Warteg Anda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colorClasses.card}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className={`${colorClasses.badge} font-medium`}>
                        {feature.category}
                      </Badge>
                      <Badge className={`${colorClasses.highlight} font-medium px-3 py-1`}>
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Siap Mengoptimalkan Warteg Anda?
            </h3>
            <p className="text-white/90 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Bergabunglah dengan revolusi digital untuk UMKM Indonesia. 
              Mulai gratis dan rasakan perbedaannya dalam 30 hari pertama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20 transition-colors py-2 px-4 text-sm font-medium">
                ✓ Gratis 30 hari pertama
              </Badge>
              <Badge variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20 transition-colors py-2 px-4 text-sm font-medium">
                ✓ Setup mudah 5 menit
              </Badge>
              <Badge variant="outline" className="border-white text-white bg-white/10 hover:bg-white/20 transition-colors py-2 px-4 text-sm font-medium">
                ✓ Support 24/7
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection; 