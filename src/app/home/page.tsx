import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import PortraitCard from "@/components/home/PortraitCard";
import LandscapeCard from "@/components/home/LandscapeCard";

export default function HomePage() {
  const todayDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const wartegName = "Barokah"; // This could come from user data

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-primary via-primary/90 to-accent">
        {/* Hero Section */}
        <div className="relative overflow-hidden px-6 pt-6 pb-0 text-white rounded-b-3xl">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="w-20 h-20 rounded-full border-2 border-white/30"></div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-10">
            <div className="w-32 h-32 rounded-full bg-white/20 transform translate-x-8 translate-y-8"></div>
          </div>

          {/* Points Badge */}
          <div className="flex justify-between items-start mb-6">
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              ⭐ Premium
            </Badge>
          </div>

          {/* Greeting */}
          <div className="relative z-10">
            <p className="text-white/90 text-lg mb-2">Good Morning,</p>
            <h1 className="text-3xl font-bold mb-1">Warteg {wartegName}</h1>
            <p className="text-white/80 text-sm">{todayDate}</p>
          </div>
        </div>

        {/* Stats Sections */}
        <div className="bg-white rounded-t-3xl p-4 space-y-6 pb-32">
          {/* Penjualan Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Penjualan</h2>
            <div className="flex flex-row gap-3">
              <PortraitCard
                title="Ringkasan Penjualan"
                description="Penjualan hari ini"
                href="/today"
                icon={TrendingUp}
                gradientType="sales"
              />
              
              <PortraitCard
                title="Prediksi Penjualan"
                description="Penjualan besok"
                href="/prediction"
                icon={PieChart}
                gradientType="prediction"
              />
            </div>
          </div>

          {/* Perkembangan Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Perkembangan</h2>
            <LandscapeCard
              title="Sisa Makanan Berkurang"
              description="Pelacakan manajemen limbah"
              value="-8%"
              subtitle="Dari minggu lalu"
              href="/waste"
              icon={TrendingDown}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
