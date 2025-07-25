"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Trash2, Target, AlertTriangle, Leaf } from "lucide-react";
import { menuAPI, salesAPI, stockAPI, DailySalesResponse } from "@/lib/api";

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

export default function WasteClient() {
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      {/* Problem Areas Section */}
      {problemItems.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <span>Area yang Perlu Perhatian</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {problemItems.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-accent-50 rounded-xl">
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

      {/* Environmental Impact Section */}
      <section>
        <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Dampak Lingkungan</h3>
            <p className="text-gray-600 text-sm mb-4">
              Dengan waste hanya {totalWastePercentage.toFixed(1)}%, Anda telah menghemat sekitar {Math.round(totalWaste * 0.15)}kg makanan hari ini!
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
} 