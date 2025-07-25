"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Mic, MessageSquare, ClipboardList, Package, Brain } from "lucide-react";

const usageSteps = [
  {
    title: "Catat Stok Awal dengan Suara",
    description: "Ucapkan stok awal Anda, dan data langsung tercatat untuk memulai hari dengan akurat.",
    icon: Package,
    badgeText: "Stok"
  },
  {
    title: "Umumkan Menu Baru dengan Suara",
    description: "Ucapkan nama menu yang siap, dan AI menghasilkan gambar promosi otomatis untuk menarik pelanggan.",
    icon: MessageSquare,
    badgeText: "Menu"
  },
  {
    title: "Pantau Pesanan Pelanggan dengan Suara",
    description: "Di akhir makan, pelanggan menyebutkan apa saja yang dipesan, dan aplikasi mencatat serta menghitung total harga secara otomatis.",
    icon: ClipboardList,
    badgeText: "Pesanan"
  },
  {
    title: "Pantau Sisa Stok dengan Suara",
    description: "Ucapkan sisa stok di akhir hari, dan Smarteg menghitung limbah makanan untuk membantu mengurangi pemborosan.",
    icon: Mic,
    badgeText: "Sisa"
  },
  {
    title: "Prediksi Kebutuhan Masakan Secara Otomatis",
    description: "Aplikasi menggunakan data penjualan yang dicatat dengan suara untuk memprediksi kebutuhan masakan esok hari secara otomatis.",
    icon: Brain,
    badgeText: "Prediksi"
  }
];

const UsageSection = () => {
  return (
    <section className="pt-8 md:pt-12 pb-16 md:pb-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Static Title */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="flex items-center mb-4">
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Mic className="-ms-0.5 opacity-60" size={12} aria-hidden="true" />
                  Penggunaan
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="font-eb-garamond italic font-normal">Optimalkan Operasi</span> Warteg Anda dengan Cara yang <span className="font-eb-garamond italic font-normal">Sederhana</span>
              </h2>
            </motion.div>
          </div>

          {/* Right Side - Scrollable Cards */}
          <div className="space-y-8">
            {usageSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="flex items-start gap-6 p-6 border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-green-600">
                      0{index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageSection; 