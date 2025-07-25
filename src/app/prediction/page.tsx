"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Brain, 
  Package, 
  Users, 
  Tag, 
  TrendingUp, 
  Calendar, 
  CloudSun,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PredictionPage() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleInsight = (insight: string) => {
    setExpandedInsight(expandedInsight === insight ? null : insight);
  };

  const handleCheck = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Simple Header */}
        <section className="flex items-center space-x-3">
          <Link href="/home" className="p-2 -ml-2 rounded-lg border border-gray-200/60 bg-gray-50/30 backdrop-blur-sm hover:bg-gray-100/60 hover:border-gray-300/70 transition-all duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-medium text-gray-900">Prediksi Besok</h1>
            <p className="text-sm text-gray-500">Berdasarkan data 30 hari terakhir</p>
          </div>
        </section>

        {/* Main Prediction - Natural LLM Style */}
        <section>
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Prediksi untuk besok (Sabtu)</span>
                </div>
                
                <div className="text-2xl font-bold text-gray-900">
                  Rp 420.000
                </div>
                
                <div className="text-sm text-gray-600 space-y-2">
                  <p>Berdasarkan data 30 hari terakhir, besok kemungkinan besar akan ramai. Biasanya di hari Sabtu penjualan naik sekitar 32% dibanding hari kerja biasa.</p>
                  <p>Pola yang sama sudah terjadi 3 kali bulan ini, dan setiap kali hasilnya selalu di atas Rp 400.000.</p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <Info className="w-3 h-3" />
                  <span>Confidence level: 90%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Action Items */}
        <section>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Saran Persiapan</h2>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Berdasarkan Prediksi
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Cooking Time */}
                <div 
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleCheck('masak')}
                >
                  <Checkbox 
                    id="masak" 
                    checked={checkedItems['masak'] || false}
                    onCheckedChange={() => handleCheck('masak')}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-lg">⏰</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Mulai masak lebih awal</p>
                    <p className="text-sm text-gray-600">Biasanya di Sabtu ramai jam 11:30-14:30, jadi mulai jam 9 pagi</p>
                  </div>
                </div>

                {/* Menu Preparation */}
                <div 
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleCheck('menu')}
                >
                  <Checkbox 
                    id="menu" 
                    checked={checkedItems['menu'] || false}
                    onCheckedChange={() => handleCheck('menu')}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-lg">🍛</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Siapkan nasi gudeg lebih banyak</p>
                    <p className="text-sm text-gray-600">Biasanya di Sabtu laris, siapkan 50 porsi</p>
                  </div>
                </div>

                {/* Staff Schedule */}
                <div 
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleCheck('karyawan')}
                >
                  <Checkbox 
                    id="karyawan" 
                    checked={checkedItems['karyawan'] || false}
                    onCheckedChange={() => handleCheck('karyawan')}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-lg">👥</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Pastikan ada 2 orang jam 11</p>
                    <p className="text-sm text-gray-600">Biasanya rush hour di Sabtu, butuh 2 orang handle</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Enhanced Insights Section */}
        <section>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Analisis Prediksi</h3>
                </div>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  Data-Driven
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Trend Analysis */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Tren Penjualan Positif</span>
                      <p className="text-sm text-gray-600">Momentum naik 3 hari berturut-turut</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleInsight('trend')}
                    className="text-blue-600 hover:bg-blue-100"
                  >
                    {expandedInsight === 'trend' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
                {expandedInsight === 'trend' && (
                  <div className="ml-13 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Hari ini: +18% vs kemarin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Rata-rata 7 hari: +15% vs minggu lalu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Pola serupa terjadi 3x bulan ini dengan hasil +25%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Day Pattern */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Pola Hari Sabtu</span>
                      <p className="text-sm text-gray-600">Historis menunjukkan peningkatan signifikan</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleInsight('weekend')}
                    className="text-amber-600 hover:bg-amber-100"
                  >
                    {expandedInsight === 'weekend' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
                {expandedInsight === 'weekend' && (
                  <div className="ml-13 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-700">Sabtu rata-rata +32% vs hari kerja</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-700">Puncak: 12:00-14:00 & 18:30-20:00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-700">Pelanggan keluarga meningkat 45%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weather Impact */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-teal-50/50 border border-teal-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <CloudSun className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Kondisi Cuaca Ideal</span>
                      <p className="text-sm text-gray-600">Cerah berawan, suhu 28°C - kondisi optimal</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleInsight('weather')}
                    className="text-teal-600 hover:bg-teal-100"
                  >
                    {expandedInsight === 'weather' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
                {expandedInsight === 'weather' && (
                  <div className="ml-13 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-gray-700">Cuaca cerah: +22% kunjungan dine-in</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-gray-700">Suhu 25-30°C: kondisi optimal untuk warteg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      <span className="text-gray-700">Tidak ada hujan diprediksi hingga malam</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
} 