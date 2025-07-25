"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, Trash2, Target, AlertTriangle, Leaf, Brain, RefreshCw, Info, Lightbulb, TreePine } from "lucide-react";
import { menuAPI, salesAPI, stockAPI, geminiAPI, DailySalesResponse } from "@/lib/api";
import { GenAIService } from "@/services/ai/GenAIService";

interface MenuResponse {
  data: {
    menu: {
      name: string;
      icon: string;
      capital: number;
      price: number;
    }[];
  };
}

interface StockResponse {
  data: {
    stocks: {
      menu_name: string;
      initial_quantity: number;
      current_quantity: number;
      unit: string;
    }[];
  };
}

interface WasteData {
  name: string;
  icon: string;
  waste: number;
  wastePercentage: number;
  initialStock: number;
  sold: number;
}

interface AIWasteAnalysis {
  waste_analysis: {
    total_waste_kg: number;
    total_waste_percentage: number;
    waste_trend: "improving" | "worsening" | "stable";
    efficiency_score: number;
  };
  problem_areas: Array<{
    menu_name: string;
    waste_percentage: number;
    waste_amount: number;
    severity: "low" | "medium" | "high" | "critical";
    root_causes: string[];
    recommendations: Array<{
      action: string;
      impact: string;
      priority: "immediate" | "short_term" | "long_term";
      cost: "low" | "medium" | "high";
    }>;
  }>;
  environmental_impact: {
    food_waste_kg_saved: number;
    carbon_footprint_reduced_kg: number;
    water_saved_liters: number;
    economic_savings_idr: number;
    sustainability_score: number;
    impact_reasoning: string[];
  };
  actionable_insights: Array<{
    title: string;
    description: string;
    implementation: string;
    expected_reduction: string;
  }>;
  sustainability_recommendations?: Array<{
    category: "operational" | "menu_planning" | "customer_engagement" | "community_partnership";
    title: string;
    description: string;
    benefits: string[];
    implementation_steps: string[];
  }>;
}

export default function WasteClient() {
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // AI Analysis states
  const [aiAnalysis, setAiAnalysis] = useState<AIWasteAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  
  // Store raw API data for AI analysis
  const [rawSalesData, setRawSalesData] = useState<any>(null);
  const [rawStockData, setRawStockData] = useState<any>(null);

  // Utility function to format large numbers
  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toFixed(1);
    }
  };

  // Utility function to format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1000000) {
      return 'Rp' + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return 'Rp' + (amount / 1000).toFixed(0) + 'K';
    } else {
      return 'Rp' + amount.toLocaleString('id-ID');
    }
  };

  // Get new token for AI analysis
  const getNewToken = async (): Promise<{ name: string }> => {
    try {
      const response = await geminiAPI.getToken();
      console.log('Token response structure:', response);
      
      // Handle nested response structure
      if (response && typeof response === 'object' && response !== null) {
        if ('data' in response && response.data && typeof response.data === 'object' && response.data !== null && 'name' in response.data) {
          return { name: String(response.data.name) };
        }
        if ('name' in response) {
          return { name: String(response.name) };
        }
      }
      
      // Fallback to environment variable
      const fallbackKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (fallbackKey) {
        console.log('Using fallback API key from environment');
        return { name: fallbackKey };
      }
      
      throw new Error(`Invalid token structure: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error('Failed to get Gemini token from API:', error);
      
      // Fallback to environment variable
      const fallbackKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (fallbackKey) {
        console.log('Using fallback API key from environment');
        return { name: fallbackKey };
      }
      
      throw error;
    }
  };

  // Generate AI waste analysis
  const generateWasteAnalysis = async () => {
    if (!wasteData.length || !rawSalesData || !rawStockData) {
      setAnalysisError('Data not available for analysis');
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);

      console.log('Generating waste analysis...');
      const analysis = await GenAIService.getWasteAnalysis(
        wasteData,
        rawSalesData,
        rawStockData,
        getNewToken
      );

      console.log('Generated waste analysis:', analysis);
      setAiAnalysis(analysis);
      setHasGenerated(true);
      const timestamp = new Date();
      setLastGenerated(timestamp);
      
      // Save to localStorage
      localStorage.setItem('warteg_waste_analysis', JSON.stringify(analysis));
      localStorage.setItem('warteg_waste_analysis_timestamp', timestamp.toISOString());
      
    } catch (error) {
      console.error('Failed to generate waste analysis:', error);
      setAnalysisError(`Failed to generate analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Fallback analysis data
      const fallbackAnalysis: AIWasteAnalysis = {
        waste_analysis: {
          total_waste_kg: 2.5,
          total_waste_percentage: 8.2,
          waste_trend: "stable",
          efficiency_score: 85
        },
        problem_areas: [
          {
            menu_name: "ayam goreng",
            waste_percentage: 12.5,
            waste_amount: 5,
            severity: "high",
            root_causes: ["Overproduction saat jam sepi", "Estimasi demand kurang akurat"],
            recommendations: [
              {
                action: "Kurangi produksi ayam goreng 15% di jam 14:00-16:00",
                impact: "Mengurangi waste hingga 40%",
                priority: "immediate",
                cost: "low"
              }
            ]
          }
        ],
        environmental_impact: {
          food_waste_kg_saved: 1.8,
          carbon_footprint_reduced_kg: 5.4,
          water_saved_liters: 150,
          economic_savings_idr: 45000,
          sustainability_score: 78,
          impact_reasoning: [
            "Pengurangan limbah makanan sebesar 1.8kg mencegah emisi metana dari pembusukan organik",
            "Penghematan air sebesar 150 liter karena mengurangi produksi makanan berlebih",
            "Efisiensi operasional menghemat Rp 45.000 per hari dari bahan baku yang tidak terbuang"
          ]
        },
        actionable_insights: [
          {
            title: "Optimalisasi Jam Produksi",
            description: "Berdasarkan pola data, produksi berlebih terjadi di jam sepi (14:00-16:00)",
            implementation: "Kurangi batch cooking di jam tersebut dan fokus pada made-to-order",
            expected_reduction: "30-40%"
          }
        ],

      };
      
      setAiAnalysis(fallbackAnalysis);
      setHasGenerated(true);
      const timestamp = new Date();
      setLastGenerated(timestamp);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load saved analysis on mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('warteg_waste_analysis');
    const savedTimestamp = localStorage.getItem('warteg_waste_analysis_timestamp');
    
    if (savedAnalysis && savedTimestamp) {
      try {
        setAiAnalysis(JSON.parse(savedAnalysis));
        setLastGenerated(new Date(savedTimestamp));
        setHasGenerated(true);
      } catch (error) {
        console.error('Failed to load saved analysis:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching waste data...');

        // Fetch all data in parallel with individual error handling
        const [menuResponse, stockResponse, salesResponse] = await Promise.all([
          menuAPI.getMenu().catch(err => {
            console.error('Menu API failed:', err);
            throw new Error(`Menu API failed: ${err.message}`);
          }),
          stockAPI.getDailyStock().catch(err => {
            console.error('Stock API failed:', err);
            console.log('Stock API might not be available, using fallback');
            return { data: { stocks: [] } }; // Fallback to empty stocks
          }),
          salesAPI.getDailySales().catch(err => {
            console.error('Sales API failed:', err);
            throw new Error(`Sales API failed: ${err.message}`);
          })
        ]);

        console.log('Menu response:', menuResponse);
        console.log('Stock response:', stockResponse);
        console.log('Sales response:', salesResponse);

        const menuData = (menuResponse as MenuResponse).data.menu;
        const stockData = (stockResponse as StockResponse).data?.stocks || [];
        const salesData = (salesResponse as DailySalesResponse).data.items;

        console.log('Parsed data:', { menuData, stockData, salesData });

        // Store raw data for AI analysis
        setRawSalesData(salesResponse);
        setRawStockData(stockResponse);

        // Calculate waste for each menu item
        const wasteItems: WasteData[] = menuData.map((menuItem) => {
          // Find corresponding stock data
          const stockItem = stockData.find((stock: any) => stock.menu_name === menuItem.name);
          const salesItem = salesData.find((sale: any) => sale.name === menuItem.name);
          
          // Use default values if no stock data available
          const initialStock = stockItem ? stockItem.initial_quantity : 20; // Default stock
          const currentStock = stockItem ? (stockItem.current_quantity || 0) : 0;
          const sold = salesItem ? salesItem.counts : 0;
          
          // Calculate waste: initial stock - sold - current stock
          const waste = Math.max(0, initialStock - sold - currentStock);
          const wastePercentage = initialStock > 0 ? (waste / initialStock) * 100 : 0;
          
          console.log(`${menuItem.name}: initial=${initialStock}, sold=${sold}, current=${currentStock}, waste=${waste}`);
          
          return {
            name: menuItem.name,
            icon: menuItem.icon,
            waste,
            wastePercentage,
            initialStock,
            sold
          };
        });

        console.log('Final waste items:', wasteItems);
        setWasteData(wasteItems);
      } catch (error) {
        console.error('Error fetching waste data:', error);
        setError(`Failed to load waste data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWasteData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Calculate totals
  const totalWaste = wasteData.reduce((sum, item) => sum + item.waste, 0);
  const totalInitialStock = wasteData.reduce((sum, item) => sum + item.initialStock, 0);
  const totalWastePercentage = totalInitialStock > 0 ? (totalWaste / totalInitialStock) * 100 : 0;
  const targetWaste = 5; // 5% target
  const efficiency = Math.max(0, 100 - totalWastePercentage);

  // Categorize items
  const problemItems = wasteData.filter(item => item.wastePercentage > 7);
  const goodItems = wasteData.filter(item => item.wastePercentage <= 3);

  return (
    <>
      {/* Main Waste Analysis - Similar to Prediction Style */}
      <section className="flex flex-col items-center justify-between gap-4">
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
          <CardContent className="p-6 py-2">
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-white/80">Generating AI waste analysis...</p>
                </div>
              </div>
            ) : !hasGenerated ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                  <Brain className="w-12 h-12 text-white/60 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Analisis Limbah</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Klik tombol "Generate" di bawah untuk mendapatkan analisis AI
                      <br />
                      tentang waste management dan keberlanjutan
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
                      Score: {aiAnalysis?.environmental_impact?.sustainability_score || 85}/100
                    </Badge>
                    {lastGenerated && (
                      <Badge variant="outline" className="bg-white/10 text-white/80 border-white/20 text-xs">
                        {lastGenerated.toLocaleDateString('id-ID')} {lastGenerated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Leaf className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Waste Analysis</span>
                    {analysisError && (
                      <Badge variant="outline" className="ml-2 bg-yellow-500/20 text-yellow-100 border-yellow-300/30 text-xs">
                        Fallback
                      </Badge>
                    )}
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {aiAnalysis?.waste_analysis?.efficiency_score || 85}% Efficient
                  </p>
                  <p className="text-sm my-2">
                    {aiAnalysis?.waste_analysis?.waste_trend === 'improving' ? 
                      'Waste management menunjukkan tren perbaikan yang konsisten. Tingkatkan strategi berkelanjutan.' :
                      aiAnalysis?.waste_analysis?.waste_trend === 'worsening' ?
                      'Perlu perhatian khusus untuk mengurangi waste. Implementasikan rekomendasi AI segera.' :
                      'Waste management stabil. Fokus pada optimasi untuk hasil lebih baik.'
                    }
                  </p>
                  {aiAnalysis?.environmental_impact && (
                    <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                      <div className="flex items-center space-x-2 mb-1">
                        <TreePine className="w-4 h-4 text-white" />
                        <span className="text-sm font-medium text-white">Dampak Lingkungan <br/> Hari Ini</span>
                      </div>
                      <p className="text-sm text-white/90">
                        Hemat <b>{aiAnalysis.environmental_impact.economic_savings_idr ? formatCurrency(aiAnalysis.environmental_impact.economic_savings_idr) : 'Rp45K'}</b>
                        <br/>Menyelamatkan <b>{aiAnalysis.environmental_impact.food_waste_kg_saved ? formatLargeNumber(aiAnalysis.environmental_impact.food_waste_kg_saved) : '1.8'} kg</b> makanan dari terbuang
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Button 
          onClick={generateWasteAnalysis}
          disabled={isAnalyzing || !wasteData.length}
          variant="outline"
          size="sm"
          className="flex items-center py-4 space-x-2 w-full bg-gradient-to-br from-primary-400 to-primary-600"
        >
          <RefreshCw className={`w-4 h-4 text-white ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span className="text-sm text-white">{isAnalyzing ? 'Analyzing...' : 'Generate'}</span>
        </Button>
        {lastGenerated && (
          <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 text-xs">
            Terakhir: {lastGenerated.toLocaleDateString('id-ID')} {lastGenerated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </Badge>
        )}
      </section>

      {/* Waste Reduction Summary Section */}
      <section>
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
          <CardContent className="p-6 py-2">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-white/20 text-white border-white/30 mb-2">
                  {totalWastePercentage <= targetWaste ? "Excellent!" : "Needs Improvement"}
                </Badge>
                <div className="flex items-center space-x-2 mb-2">
                  <Leaf className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {totalWastePercentage <= targetWaste ? "Di Bawah Target" : "Di Atas Target"}
                  </span>
                </div>
                <p className="text-3xl font-bold mb-1">
                  {totalWastePercentage <= targetWaste 
                    ? `${(targetWaste - totalWastePercentage).toFixed(1)}%`
                    : `+${(totalWastePercentage - targetWaste).toFixed(1)}%`
                  }
                </p>
                <p className="text-white/80">
                  {totalWastePercentage <= targetWaste 
                    ? `Di bawah target ${targetWaste}%`
                    : `Melebihi target ${targetWaste}%`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Waste Statistics Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-gray-500 text-sm font-medium">Sisa Hari Ini</p>
                  <p className="text-2xl font-bold text-black">{totalWaste} porsi</p>
                  <p className="text-gray-500 text-xs">{totalWastePercentage.toFixed(1)}% dari total produksi</p>
                </div>
                <Trash2 className="w-8 h-8 text-primary-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-gray-500 text-sm font-medium">Target Sisa</p>
                  <p className="text-2xl font-bold text-black">{targetWaste}%</p>
                  <p className="text-gray-500 text-xs">Target bulanan</p>
                </div>
                <Target className="w-8 h-8 text-primary-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-gray-500 text-sm font-medium">Efisiensi</p>
                  <p className="text-2xl font-bold text-black">{efficiency.toFixed(1)}%</p>
                  <p className="text-gray-500 text-xs">
                    {efficiency > 95 ? "Semakin baik!" : "Perlu ditingkatkan"}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-primary-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Problem Areas Section - AI Enhanced */}
      {(aiAnalysis?.problem_areas.length || problemItems.length > 0) && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <span>Area yang Perlu Perhatian</span>
                {aiAnalysis && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Insights
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* AI-Generated Problem Areas */}
                {aiAnalysis?.problem_areas.map((item, index) => {
                  const getSeverityColor = (severity: string) => {
                    switch (severity) {
                      case 'critical': return 'text-red-800 bg-red-50 border-red-200';
                      case 'high': return 'text-orange-800 bg-orange-50 border-orange-200';
                      case 'medium': return 'text-yellow-800 bg-accent-100 border-accent-500';
                      default: return 'text-blue-800 bg-blue-50 border-blue-200';
                    }
                  };

                  const getSeverityBadgeColor = (severity: string) => {
                    switch (severity) {
                      case 'critical': return 'text-white bg-red-600 border-red-600';
                      case 'high': return 'text-white bg-orange-600 border-orange-600';
                      case 'medium': return 'text-white bg-yellow-600 border-yellow-600';
                      default: return 'text-white bg-blue-600 border-blue-600';
                    }
                  };

                  const getPriorityBadgeColor = (priority: string) => {
                    switch (priority) {
                      case 'immediate': return 'text-white bg-red-600 border-red-600';
                      case 'short_term': return 'text-white bg-orange-600 border-orange-600';
                      case 'long_term': return 'text-white bg-blue-600 border-blue-600';
                      default: return 'text-white bg-gray-600 border-gray-600';
                    }
                  };

                  const getCostBadgeColor = (cost: string) => {
                    switch (cost) {
                      case 'low': return 'text-white bg-green-600 border-green-600';
                      case 'medium': return 'text-white bg-yellow-600 border-yellow-600';
                      case 'high': return 'text-white bg-red-600 border-red-600';
                      default: return 'text-white bg-gray-600 border-gray-600';
                    }
                  };

                  return (
                    <div key={`ai-${index}`} className={`p-4 rounded-xl border ${getSeverityColor(item.severity)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xl font-semibold mb-1">{item.menu_name}</p>
                          <p className="text-sm mb-2">
                            Waste <b>{item.waste_percentage.toFixed(1)}% ({item.waste_amount} porsi)</b>
                          </p>
                          <Badge variant="outline" className={`text-xs ${getSeverityBadgeColor(item.severity)}`}>
                            {item.severity === 'critical' ? 'Kritis' : 
                             item.severity === 'high' ? 'Tinggi' : 
                             item.severity === 'medium' ? 'Sedang' : 'Rendah'}
                          </Badge>
                        </div>
                      </div>

                      {/* Root Causes */}
                      <div className="mb-3">
                        <h4 className="font-medium text-sm mb-2 flex items-center">
                          <Info className="w-3 h-3 mr-1" />
                          Penyebab:
                        </h4>
                        <ul className="text-xs space-y-1">
                          {item.root_causes.map((cause, causeIndex) => (
                            <li key={causeIndex} className="flex items-start">
                              <span className="w-1 h-1 rounded-full bg-current mt-1.5 mr-2 flex-shrink-0"></span>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center">
                          <Lightbulb className="w-3 h-3 mr-1" />
                          Rekomendasi AI:
                        </h4>
                        <div className="space-y-2">
                          {item.recommendations.map((rec, recIndex) => (
                            <div key={recIndex} className="text-xs">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge variant="outline" className={`text-xs px-1 py-0 ${getPriorityBadgeColor(rec.priority)}`}>
                                  {rec.priority === 'immediate' ? 'Segera' : 
                                   rec.priority === 'short_term' ? 'Jangka Pendek' : 'Jangka Panjang'}
                                </Badge>
                                <Badge variant="outline" className={`text-xs px-1 py-0 ${getCostBadgeColor(rec.cost)}`}>
                                  Cost: {rec.cost === 'low' ? 'Rendah' : rec.cost === 'medium' ? 'Sedang' : 'Tinggi'}
                                </Badge>
                              </div>
                              <p className="font-medium">{rec.action}</p>
                              <p className="text-opacity-80">{rec.impact}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Fallback to basic problem areas if no AI analysis */}
                {!aiAnalysis && problemItems.map((item, index) => (
                  <div key={`basic-${index}`} className="flex items-start space-x-3 p-4 bg-accent-50 rounded-xl">
                    <div>
                      <p className="text-xl font-semibold text-orange-800 mb-2">{item.icon} {item.name}</p>
                      <p className="text-orange-700 text-sm mb-4">
                        Sisa <b>{item.wastePercentage.toFixed(1)}% ({item.waste} porsi)</b> <br/>di atas rata-rata
                      </p>
                      <p className="text-orange-600 text-xs">
                        Rekomendasi: {item.wastePercentage > 15 ? "Kurangi porsi masak atau buat promo" : "Pantau demand pagi vs sore"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Good Performance Section */}
      {goodItems.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-4">
                <Leaf className="w-8 h-8 text-green-500" />
                <span>Menu dengan <br/> Performa Baik</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goodItems.map((item, index) => {
                  const getBadgeText = (percentage: number) => {
                    if (percentage < 1) return "Amazing!";
                    if (percentage < 2) return "Excellent!";
                    if (percentage < 3) return "Great!";
                    return "Perfect!";
                  };

                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-green-800">{item.icon} {item.name}</p>
                        <p className="text-green-600 text-sm">
                          Waste hanya {item.wastePercentage.toFixed(1)}% ({item.waste} porsi)
                        </p>
                      </div>
                      <Badge className="bg-primary-600 text-white">{getBadgeText(item.wastePercentage)}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Environmental Impact Section - AI Enhanced */}
      <section>
        <Card className="border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardContent className="p-8">
            {aiAnalysis ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🌱</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Dampak Lingkungan AI Analysis</h3>
                  <div className="flex items-center justify-center space-x-4 my-6">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Score: {aiAnalysis.environmental_impact.sustainability_score}/100
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <TreePine className="w-3 h-3 mr-1" />
                      Sustainable
                    </Badge>
                  </div>
                </div>

                {/* Impact Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-xl font-bold text-green-600">
                      {formatLargeNumber(aiAnalysis.environmental_impact.food_waste_kg_saved)}kg
                    </div>
                    <div className="text-xs text-gray-600">Makanan Diselamatkan</div>
                  </div>
                  
                  <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                    <div className="text-xl font-bold text-blue-600">
                      {formatLargeNumber(aiAnalysis.environmental_impact.carbon_footprint_reduced_kg)}kg
                    </div>
                    <div className="text-xs text-gray-600">CO₂ Dikurangi</div>
                  </div>
                  
                  <div className="text-center p-3 bg-white rounded-lg border border-cyan-100">
                    <div className="text-xl font-bold text-cyan-600">
                      {formatLargeNumber(aiAnalysis.environmental_impact.water_saved_liters)}L
                    </div>
                    <div className="text-xs text-gray-600">Air <br/>Dihemat</div>
                  </div>
                  
                  <div className="text-center p-3 bg-white rounded-lg border border-emerald-100">
                    <div className="text-xl font-bold text-emerald-600">
                      {formatCurrency(aiAnalysis.environmental_impact.economic_savings_idr)}
                    </div>
                    <div className="text-xs text-gray-600">Hemat Biaya</div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="bg-white rounded-lg p-4 border border-gray-100">
                  <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Brain className="w-16 h-16 mr-2 text-primary" />
                    Analisis Dampak Lingkungan
                  </h5>
                  <div className="space-y-3">
                    {aiAnalysis.environmental_impact.impact_reasoning.map((reason, index) => (
                      <div key={index} className="flex items-start text-sm text-gray-600">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-green-600 text-xs font-semibold">{index + 1}</span>
                        </div>
                        <p>{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Insights */}
                {aiAnalysis.actionable_insights.length > 0 && (
                  <div className="mt-6 bg-white rounded-lg p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
                      Insight Keberlanjutan
                    </h4>
                    <div className="space-y-4">
                      {aiAnalysis.actionable_insights.map((insight, index) => (
                        <div key={index} className="border-l-4 border-amber-200 pl-4">
                          <h5 className="font-medium text-gray-800 mb-1">{insight.title}</h5>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                            <div className="flex flex-col text-xs">
                             <Badge variant="outline" className="bg-amber-600 text-white border-amber-600 mb-2 w-fit">
                               Pengurangan: {insight.expected_reduction}
                             </Badge>
                             <span className="text-gray-500">Implementasi: {insight.implementation}</span>
                            </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Fallback static content
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Dampak Lingkungan</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Dengan waste hanya {totalWastePercentage.toFixed(1)}%, Anda telah menghemat sekitar {Math.round(totalWaste * 0.15)}kg makanan hari ini!
                </p>
                {!hasGenerated && (
                  <p className="text-gray-500 text-xs">
                    Klik "Analisis AI" untuk mendapatkan insight mendalam tentang dampak lingkungan
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      
    </>
  );
} 