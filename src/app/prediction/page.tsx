"use client";

import DashboardLayout from "@/components/dashboard/PWALayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Brain, 
  Package, 
  TrendingUp, 
  Calendar, 
  CloudSun,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GenAIService } from "@/services/ai/GenAIService";
import { geminiAPI } from "@/lib/api";

interface PredictionData {
  revenue_prediction: number;
  confidence: number;
  preparation_suggestions: {
    id: string;
    icon: string;
    title: string;
    description: string;
    quantity?: number;
    weather_related?: boolean;
  }[];
  insights: {
    trend: {
      status: string;
      details: string[];
    };
    day_pattern: {
      status: string;
      details: string[];
    };
    weather_impact: {
      status: string;
      details: string[];
    };
  };
  reasoning: string;
  stock_predictions?: { [menuItem: string]: number };
}

export default function PredictionPage() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const toggleInsight = (insight: string) => {
    setExpandedInsight(expandedInsight === insight ? null : insight);
  };

  const handleCheck = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getNewToken = async (): Promise<{ name: string }> => {
    try {
      // Try to get token from API first
      const token = await geminiAPI.getToken();
      
      // Check if token has the expected nested structure (data.name)
      if (token && typeof token === 'object' && 'data' in token && 
          token.data && typeof token.data === 'object' && 'name' in token.data) {
        return { name: token.data.name as string };
      }
      
      // Check if token has the name at root level
      if (token && typeof token === 'object' && 'name' in token) {
        return token as { name: string };
      }
      
      // Try alternative token structure (direct string)
      if (token && typeof token === 'string') {
        return { name: token };
      }
      throw new Error(`Invalid token structure: ${JSON.stringify(token)}`);
    } catch (error) {
      
      // Fallback: try to use environment variable
      const envToken = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (envToken) {
        return { name: envToken };
      }
      
      throw new Error(`Token fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}. No fallback token available.`);
    }
  };

  const generatePredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const predictions = await GenAIService.getSupplyPrediction(getNewToken);
      
      // Save to state
      setPredictionData(predictions);
      
      // Save to localStorage
      const timestamp = new Date();
      localStorage.setItem('warteg_predictions', JSON.stringify(predictions));
      localStorage.setItem('warteg_predictions_timestamp', timestamp.toISOString());
      
      setLastGenerated(timestamp);
      setHasGenerated(true);
    } catch (err) {
      
      // Check if it's a token issue
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.includes('token') || errorMessage.includes('Token') || errorMessage.includes('authentication')) {
        setError('AI service unavailable (authentication issue). Using fallback predictions.');
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
        setError('Network error. Using fallback predictions.');
      } else {
        setError('AI prediction failed. Using fallback data.');
      }
      
      // Fallback data if AI fails
      setPredictionData({
        revenue_prediction: 420000,
        confidence: 85,
        preparation_suggestions: [
          {
            id: 'cooking_time',
            icon: '⏰',
            title: 'Mulai masak lebih awal',
            description: 'Berdasarkan pola historis, mulai persiapan 2 jam lebih awal dari biasanya'
          },
          {
            id: 'nasi_gudeg',
            icon: '🍛',
            title: 'Siapkan menu populer lebih banyak',
            description: 'Tingkatkan stok menu favoritas berdasarkan data penjualan',
            quantity: 45
          },
          {
            id: 'weather_prep',
            icon: '🌤️',
            title: 'Persiapan berdasarkan cuaca',
            description: 'Sesuaikan menu dan persiapan dengan prediksi cuaca besok',
            weather_related: true
          },
          {
            id: 'staff',
            icon: '👥',
            title: 'Siapkan tenaga ekstra',
            description: 'Pastikan ada cukup tenaga untuk melayani lonjakan pelanggan'
          }
        ],
        insights: {
          trend: {
            status: 'Analisis Tren Penjualan',
            details: [
              'Tren penjualan menunjukkan peningkatan konsisten',
              'Pola musiman terdeteksi dalam data historis',
              'Preferensi menu berubah seiring waktu'
            ]
          },
          day_pattern: {
            status: 'Pola Berdasarkan Hari',
            details: [
              'Penjualan akhir pekan umumnya lebih tinggi',
              'Jam sibuk terprediksi pada waktu makan utama',
              'Variasi pelanggan berdasarkan hari dalam seminggu'
            ]
          },
          weather_impact: {
            status: 'Prediksi Cuaca Besok',
            details: [
              'Belum tersedia data cuaca real-time (mode fallback)',
              'Cuaca mempengaruhi preferensi menu pelanggan',
              'Hari cerah: menu dingin dan es lebih laris',
              'Hari hujan: makanan hangat dan sup lebih diminati',
              'Siapkan variasi menu sesuai kondisi cuaca'
            ]
          }
        },
        reasoning: 'Prediksi ini dibuat berdasarkan analisis pola historis dan menggunakan data fallback karena layanan AI tidak tersedia. Meskipun demikian, prediksi tetap berdasarkan tren umum bisnis warteg.',
        stock_predictions: {
          "ayam goreng": 25,
          "nasi gudeg": 40,
          "tempe goreng": 30,
          "sayur lodeh": 35,
          "ikan asin": 20
        }
      });
      
      // Save fallback data to localStorage as well
      const timestamp = new Date();
      localStorage.setItem('warteg_predictions', JSON.stringify({
        revenue_prediction: 420000,
        confidence: 85,
        preparation_suggestions: [
          {
            id: 'cooking_time',
            icon: '⏰',
            title: 'Mulai masak lebih awal',
            description: 'Berdasarkan pola historis, mulai persiapan 2 jam lebih awal dari biasanya'
          },
          {
            id: 'nasi_gudeg',
            icon: '🍛',
            title: 'Siapkan menu populer lebih banyak',
            description: 'Tingkatkan stok menu favoritas berdasarkan data penjualan',
            quantity: 45
          },
          {
            id: 'weather_prep',
            icon: '🌤️',
            title: 'Persiapan berdasarkan cuaca',
            description: 'Sesuaikan menu dan persiapan dengan prediksi cuaca besok',
            weather_related: true
          },
          {
            id: 'staff',
            icon: '👥',
            title: 'Siapkan tenaga ekstra',
            description: 'Pastikan ada cukup tenaga untuk melayani lonjakan pelanggan'
          }
        ],
        insights: {
          trend: {
            status: 'Analisis Tren Penjualan',
            details: [
              'Tren penjualan menunjukkan peningkatan konsisten',
              'Pola musiman terdeteksi dalam data historis',
              'Preferensi menu berubah seiring waktu'
            ]
          },
          day_pattern: {
            status: 'Pola Berdasarkan Hari',
            details: [
              'Penjualan akhir pekan umumnya lebih tinggi',
              'Jam sibuk terprediksi pada waktu makan utama',
              'Variasi pelanggan berdasarkan hari dalam seminggu'
            ]
          },
          weather_impact: {
            status: 'Prediksi Cuaca Besok',
            details: [
              'Belum tersedia data cuaca real-time (mode fallback)',
              'Cuaca mempengaruhi preferensi menu pelanggan',
              'Hari cerah: menu dingin dan es lebih laris',
              'Hari hujan: makanan hangat dan sup lebih diminati',
              'Siapkan variasi menu sesuai kondisi cuaca'
            ]
          }
        },
        reasoning: 'Prediksi ini dibuat berdasarkan analisis pola historis dan menggunakan data fallback karena layanan AI tidak tersedia. Meskipun demikian, prediksi tetap berdasarkan tren umum bisnis warteg.',
        stock_predictions: {
          "ayam goreng": 25,
          "nasi gudeg": 40,
          "tempe goreng": 30,
          "sayur lodeh": 35,
          "ikan asin": 20
        }
      }));
      localStorage.setItem('warteg_predictions_timestamp', timestamp.toISOString());
      
      setLastGenerated(timestamp);
      setHasGenerated(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved predictions from localStorage on page load
  useEffect(() => {
    const savedPredictions = localStorage.getItem('warteg_predictions');
    const savedTimestamp = localStorage.getItem('warteg_predictions_timestamp');
    
    if (savedPredictions && savedTimestamp) {
      try {
        const parsedData = JSON.parse(savedPredictions);
        const parsedDate = new Date(savedTimestamp);
        
        setPredictionData(parsedData);
        setLastGenerated(parsedDate);
        setHasGenerated(true);
      } catch {
        // Clear corrupted data
        localStorage.removeItem('warteg_predictions');
        localStorage.removeItem('warteg_predictions_timestamp');
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <section className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/home" className="p-2 -ml-2 rounded-lg border border-gray-200/60 bg-gray-50/30 backdrop-blur-sm hover:bg-gray-100/60 hover:border-gray-300/70 transition-all duration-200">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-medium text-gray-900">Prediksi Besok</h1>
              </div>
              <p className="text-sm text-gray-500">
                {hasGenerated 
                  ? "Berdasarkan data historis dan prediksi cuaca AI" 
                  : "Berdasarkan data 30 hari terakhir"}
              </p>
            </div>
          </div>
        </section>

                  {/* Main Prediction - Natural LLM Style */}
          <section className="flex flex-col items-center justify-between gap-4">
            <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
              <CardContent className="p-6 py-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-4">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-white/80">Generating AI prediction...</p>
                    </div>
                  </div>
                ) : !hasGenerated ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-4">
                      <Brain className="w-12 h-12 text-white/60 mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Prediksi</h3>
                        <p className="text-white/80 text-sm mb-4">
                          Klik tombol "Generate" di bawah untuk mendapatkan prediksi AI
                          <br />
                          yang menganalisis data penjualan dan cuaca besok
                        </p>
                        <Badge className="bg-white/20 text-white border-white/30">
                          <Brain className="w-3 h-3 mr-1" />
                          AI Ready
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start justify-center">
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge className="bg-white/20 text-white border-white/30">
                          {predictionData?.confidence || 90}% confidence
                        </Badge>
                        {lastGenerated && (
                          <Badge variant="outline" className="bg-white/10 text-white/80 border-white/20 text-xs">
                            {lastGenerated.toLocaleDateString('id-ID')} {lastGenerated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        <Brain className="w-4 h-4" />
                        <span className="text-sm font-medium">AI Prediction</span>
                        {error && (
                          <Badge variant="outline" className="ml-2 bg-yellow-500/20 text-yellow-100 border-yellow-300/30 text-xs">
                            Fallback
                          </Badge>
                        )}
                      </div>
                      <p className="text-3xl font-bold mb-1">
                        Rp {(predictionData?.revenue_prediction || 420000).toLocaleString('id-ID')}
                      </p>
                      <p className="text-sm my-2">
                        {predictionData?.reasoning || 'Berdasarkan data 30 hari terakhir, besok kemungkinan besar akan ramai. Biasanya di hari Sabtu penjualan naik sekitar 32% dibanding hari kerja biasa.'}
                      </p>
                      {predictionData?.insights?.weather_impact && (
                        <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                          <div className="flex items-center space-x-2 mb-1">
                            <CloudSun className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">Prediksi Cuaca Besok</span>
                          </div>
                          <p className="text-sm text-white/90">
                            {predictionData.insights.weather_impact.status}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          <Button 
            onClick={generatePredictions}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="flex items-center py-4 space-x-2 w-full bg-gradient-to-br from-primary-400 to-primary-600"
          >
            <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
            <span className="text-sm text-white">{isLoading ? 'Generating...' : 'Generate'}</span>
          </Button>
          {lastGenerated && (
            <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
              Terakhir: {lastGenerated.toLocaleDateString('id-ID')} {lastGenerated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </Badge>
          )}
        </section>

        {/* Stock Predictions Section */}
        {predictionData?.stock_predictions && !isLoading && (
          <section>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Prediksi Stok Besok</h2>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Per Menu Item
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(predictionData.stock_predictions).map(([menuName, quantity]) => (
                    <div key={menuName} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="font-medium text-gray-900 text-sm mb-1 capitalize">
                        {menuName}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {quantity}
                      </div>
                      <div className="text-xs text-gray-500">
                        porsi
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-2 mb-1">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Tips Stok</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Prediksi ini sudah mempertimbangkan cuaca besok dan pola penjualan historis. 
                    Siapkan 10-15% lebih untuk menu populer sebagai buffer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

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
                  Hasil Prediksi
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !hasGenerated ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-500 mb-2">Belum Ada Saran Persiapan</h4>
                  <p className="text-sm text-gray-400">
                    Generate prediksi terlebih dahulu untuk mendapatkan
                    <br />
                    saran persiapan yang disesuaikan dengan kondisi besok
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictionData?.preparation_suggestions?.map((suggestion) => (
                    <div 
                      key={suggestion.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleCheck(suggestion.id)}
                    >
                      <Checkbox 
                        id={suggestion.id}
                        checked={checkedItems[suggestion.id] || false}
                        onCheckedChange={() => handleCheck(suggestion.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="border-gray-300 text-white"
                      />
                      <span className="text-lg">{suggestion.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{suggestion.title}</p>
                          {suggestion.weather_related && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              🌤️ Cuaca
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {suggestion.description}
                          {suggestion.quantity && (
                            <span className="ml-1 font-semibold text-primary">
                              <br />({suggestion.quantity} porsi)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )) || (
                    // Fallback suggestions if no AI data
                    <>
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
                    </>
                  )}
                </div>
              )}
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
                  Dari Data
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !hasGenerated ? (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-500 mb-2">Belum Ada Analisis</h4>
                  <p className="text-sm text-gray-400">
                    AI akan menganalisis tren, pola hari, dan dampak cuaca
                    <br />
                    setelah prediksi di-generate
                  </p>
                </div>
              ) : (
                <>
                  {/* Trend Analysis */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">
                            {predictionData?.insights?.trend?.status || 'Tren Penjualan'}
                          </span>
                          <p className="text-sm text-gray-600">Berdasarkan analisis AI</p>
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
                        {predictionData?.insights?.trend?.details?.map((detail, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-700">Hari ini: +18% vs kemarin</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-700">Rata-rata 7 hari: +15% vs minggu lalu</span>
                            </div>
                          </>
                        )}
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
                          <span className="font-semibold text-gray-900">
                            {predictionData?.insights?.day_pattern?.status || 'Pola Hari'}
                          </span>
                          <p className="text-sm text-gray-600">Analisis pola temporal</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleInsight('day_pattern')}
                        className="text-amber-600 hover:bg-amber-100"
                      >
                        {expandedInsight === 'day_pattern' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                    {expandedInsight === 'day_pattern' && (
                      <div className="ml-13 space-y-2 text-sm">
                        {predictionData?.insights?.day_pattern?.details?.map((detail, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              <span className="text-gray-700">Sabtu rata-rata +32% vs hari kerja</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              <span className="text-gray-700">Puncak: 12:00-14:00 & 18:30-20:00</span>
                            </div>
                          </>
                        )}
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
                          <span className="font-semibold text-gray-900">
                            {predictionData?.insights?.weather_impact?.status || 'Kondisi Cuaca'}
                          </span>
                          <p className="text-sm text-gray-600">Analisis dampak cuaca</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleInsight('weather_impact')}
                        className="text-teal-600 hover:bg-teal-100"
                      >
                        {expandedInsight === 'weather_impact' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                    {expandedInsight === 'weather_impact' && (
                      <div className="ml-13 space-y-2 text-sm">
                        {predictionData?.insights?.weather_impact?.details?.map((detail, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              <span className="text-gray-700">Cuaca cerah: +22% kunjungan dine-in</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                              <span className="text-gray-700">Tidak ada hujan diprediksi hingga malam</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}