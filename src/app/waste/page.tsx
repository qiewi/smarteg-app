import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, ArrowLeft, Trash2, Target, AlertTriangle, Leaf } from "lucide-react";
import Link from "next/link";

export default function WastePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <section>
          <div className="flex items-center space-x-4">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tracking Sisa Makanan</h1>
              <p className="text-gray-600">Optimasi sisa makanan</p>
            </div>
          </div>
        </section>

        {/* Waste Reduction Summary Section */}
        <section>
          <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
            <CardContent className="p-6 py-2">
              <div className="flex items-center justify-between">
                <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                    Excellent!
                  </Badge>
                  <div className="flex items-center space-x-2 mb-2">
                    <Leaf className="w-4 h-4" />
                    <span className="text-sm font-medium">Pengurangan Waste</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">-8%</p>
                  <p className="text-white/80">Dari minggu lalu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Waste Statistics Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">Waste Hari Ini</p>
                    <p className="text-2xl font-bold text-red-900">2.1 kg</p>
                    <p className="text-red-600 text-xs">4.2% dari total produksi</p>
                  </div>
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-600 text-sm font-medium">Target Waste</p>
                    <p className="text-2xl font-bold text-primary-900">5%</p>
                    <p className="text-primary-600 text-xs">Target bulanan</p>
                  </div>
                  <Target className="w-8 h-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">Efisiensi</p>
                    <p className="text-2xl font-bold text-yellow-900">95.8%</p>
                    <p className="text-yellow-600 text-xs">Semakin baik!</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Problem Areas Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span>Area yang Perlu Perhatian</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div>
                    <p className="font-semibold text-orange-800">Nasi Gudeg</p>
                    <p className="text-orange-700 text-sm">Waste 12% - di atas rata-rata</p>
                    <p className="text-orange-600 text-xs">Rekomendasi: Kurangi porsi masak atau buat promo</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <div>
                    <p className="font-semibold text-yellow-800">Sayur Asem</p>
                    <p className="text-yellow-700 text-sm">Waste 8% - sedikit tinggi</p>
                    <p className="text-yellow-600 text-xs">Rekomendasi: Pantau demand pagi vs sore</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Good Performance Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-green-500" />
                <span>Menu dengan Performa Baik</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800">Ayam Bakar</p>
                    <p className="text-green-600 text-sm">Waste hanya 2%</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Perfect!</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800">Tempe Orek</p>
                    <p className="text-green-600 text-sm">Waste hanya 1.5%</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Excellent!</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800">Sambal Goreng</p>
                    <p className="text-green-600 text-sm">Waste 3%</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Great!</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-green-800">Kerupuk</p>
                    <p className="text-green-600 text-sm">Waste 0.5%</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Amazing!</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Environmental Impact Section */}
        <section>
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Dampak Lingkungan</h3>
              <p className="text-gray-600 text-sm mb-4">
                Dengan pengurangan waste 8%, Anda telah menghemat sekitar 15kg makanan minggu ini!
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
} 