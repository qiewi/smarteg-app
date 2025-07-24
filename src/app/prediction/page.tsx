import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, TrendingUp, Calendar, Zap } from "lucide-react";
import Link from "next/link";

export default function PredictionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <section>
          <div className="flex items-center space-x-4">
            <Link href="/home">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prediksi Penjualan</h1>
              <p className="text-gray-600">Penjualan besok</p>
            </div>
          </div>
        </section>

        {/* AI Prediction Section */}
        <section>
          <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
            <CardContent className="p-6 py-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start justify-center">
                  <Badge className="bg-white/20 text-white border-white/30 mb-4">
                    90% confidence
                  </Badge>
                  <div className="flex items-center space-x-1 mb-2">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Prediction</span>
                  </div>
                  <p className="text-3xl font-bold mb-1">Rp 420.000</p>
                  <p className="text-sm text-white/80">Prediksi tinggi untuk besok</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recommended Actions Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-accent" />
                <span>Rekomendasi Aksi</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-accent/10 rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-accent-800">Stok Menu Favorit</p>
                    <p className="text-accent-700 text-sm">Siapkan 30% lebih banyak nasi gudeg dan ayam bakar</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-primary-800">Bahan Baku</p>
                    <p className="text-primary-700 text-sm">Pastikan stok ayam dan bumbu gudeg mencukupi</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold text-blue-800">Jam Operasional</p>
                    <p className="text-blue-700 text-sm">Pertimbangkan buka 30 menit lebih awal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* AI Reasoning Section */}
        <section className="pb-32">
          <Card className="border border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Alasan Prediksi AI</h3>
                <p className="text-gray-600 text-sm">
                  Mengapa AI memprediksi penjualan tinggi untuk besok
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-800">Trend Penjualan</p>
                    <p className="text-green-700 text-sm">3 hari terakhir menunjukkan peningkatan 15% dari rata-rata mingguan</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-800">Faktor Hari</p>
                    <p className="text-blue-700 text-sm">Besok adalah hari Jumat, historis 25% lebih tinggi dari hari kerja lain</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div className="text-orange-600 mt-0.5">🌤️</div>
                  <div>
                    <p className="font-semibold text-orange-800">Kondisi Cuaca</p>
                    <p className="text-orange-700 text-sm">Prediksi cuaca cerah, biasanya meningkatkan kunjungan 12%</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                  <div className="text-purple-600 mt-0.5">📊</div>
                  <div>
                    <p className="font-semibold text-purple-800">Pattern Pelanggan</p>
                    <p className="text-purple-700 text-sm">Menu gudeg dan ayam bakar sedang trending di area sekitar</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
} 