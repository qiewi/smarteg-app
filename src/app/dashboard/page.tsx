"use client";

import DashboardLayout from "@/components/dashboard/PWALayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BarChart3, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDailySales, getWeeklySales, getMonthlySales, SalesData, menuAPI } from "@/lib/api";

interface MenuItemDisplay {
  id: number;
  emoji: string;
  name: string;
  sold: number;
  revenue: number;
}

interface ChartDataPoint {
  name: string;
  sales: number;
  date: string;
}

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

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"1D" | "1W" | "1M">("1W");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatChartData = (salesData: SalesData[], period: "1D" | "1W" | "1M"): ChartDataPoint[] => {
    return salesData.map((data, index) => {
      let name: string;
      const date = new Date(data.date);
      
      if (period === "1D") {
        name = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      } else if (period === "1W") {
        name = date.toLocaleDateString('id-ID', { weekday: 'short' });
      } else {
        name = `Minggu ${Math.floor(index / 7) + 1}`;
      }
      
      return {
        name,
        sales: data.sales,
        date: data.date
      };
    });
  };

  const fetchMenuData = useCallback(async () => {
    try {
      setMenuLoading(true);
      
      // Fetch menu and sales data in parallel
      const [menuResponse, salesData] = await Promise.all([
        menuAPI.getMenu(),
        fetchSalesDataForPeriod(selectedPeriod)
      ]);

      const menuData = (menuResponse as MenuResponse).data.menu;
      
      // Aggregate sales data across all dates for the selected period
      const salesAggregation: { [key: string]: { sold: number; revenue: number } } = {};
      
      salesData.forEach(dayData => {
        dayData.items.forEach(item => {
          if (!salesAggregation[item.name]) {
            salesAggregation[item.name] = { sold: 0, revenue: 0 };
          }
          salesAggregation[item.name].sold += item.counts;
        });
      });

      // Calculate revenue for each menu item
      const menuItemsWithSales: MenuItemDisplay[] = menuData.map((menuItem, index) => {
        const salesInfo = salesAggregation[menuItem.name] || { sold: 0, revenue: 0 };
        const revenue = salesInfo.sold * menuItem.price;
        
        return {
          id: index + 1,
          emoji: menuItem.icon,
          name: menuItem.name,
          sold: salesInfo.sold,
          revenue: revenue
        };
      });

      setMenuItems(menuItemsWithSales);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setError('Gagal memuat data menu');
      
      // Fallback to static data
      setMenuItems([
        { id: 1, emoji: "🍛", name: "Nasi Gudeg", sold: 47, revenue: 564000 },
        { id: 2, emoji: "🍳", name: "Nasi Telur Dadar", sold: 62, revenue: 496000 },
        { id: 3, emoji: "🐟", name: "Ikan Bakar", sold: 23, revenue: 345000 },
        { id: 4, emoji: "🥬", name: "Sayur Lodeh", sold: 38, revenue: 190000 },
        { id: 5, emoji: "🍗", name: "Ayam Goreng", sold: 31, revenue: 558000 }
      ]);
    } finally {
      setMenuLoading(false);
    }
  }, [selectedPeriod]);

  const fetchSalesDataForPeriod = async (period: "1D" | "1W" | "1M"): Promise<SalesData[]> => {
    if (period === "1D") {
      const response = await getDailySales();
      return [response.data];
    } else if (period === "1W") {
      const response = await getWeeklySales();
      return response.data.weeklySales;
    } else {
      const response = await getMonthlySales();
      return response.data.monthlySales;
    }
  };

  const fetchSalesData = useCallback(async (period: "1D" | "1W" | "1M") => {
    setLoading(true);
    setError(null);
    
    try {
      const salesData = await fetchSalesDataForPeriod(period);
      const formattedData = formatChartData(salesData, period);
      setChartData(formattedData);
    } catch (err) {
      setError('Gagal memuat data penjualan');
      console.error('Error fetching sales data:', err);
      
      // Fallback data untuk demo
      const fallbackData = {
        "1D": [
          { name: "06:00", sales: 12, date: "2025-01-25" },
          { name: "09:00", sales: 19, date: "2025-01-25" },
          { name: "12:00", sales: 25, date: "2025-01-25" },
          { name: "15:00", sales: 22, date: "2025-01-25" },
          { name: "18:00", sales: 28, date: "2025-01-25" },
          { name: "21:00", sales: 32, date: "2025-01-25" }
        ],
        "1W": [
          { name: "Sen", sales: 85, date: "2025-01-20" },
          { name: "Sel", sales: 92, date: "2025-01-21" },
          { name: "Rab", sales: 78, date: "2025-01-22" },
          { name: "Kam", sales: 110, date: "2025-01-23" },
          { name: "Jum", sales: 95, date: "2025-01-24" },
          { name: "Sab", sales: 125, date: "2025-01-25" }
        ],
        "1M": [
          { name: "Minggu 1", sales: 2340, date: "2025-01-01" },
          { name: "Minggu 2", sales: 2150, date: "2025-01-08" },
          { name: "Minggu 3", sales: 2680, date: "2025-01-15" },
          { name: "Minggu 4", sales: 2890, date: "2025-01-22" }
        ]
      };
      setChartData(fallbackData[period]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesData(selectedPeriod);
  }, [selectedPeriod, fetchSalesData]);

  useEffect(() => {
    fetchMenuData();
  }, [selectedPeriod, fetchMenuData]); // Refetch menu data when period changes

  const handlePeriodChange = (period: "1D" | "1W" | "1M") => {
    setSelectedPeriod(period);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <section className="flex items-center space-x-3">
          <Link href="/home" className="p-2 -ml-2 rounded-lg border border-gray-200/60 bg-gray-50/30 backdrop-blur-sm hover:bg-gray-100/60 hover:border-gray-300/70 transition-all duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-medium text-gray-900">Rekap Penjualan</h1>
            <p className="text-sm text-gray-500">Data semua penjualan</p>
          </div>
        </section>

        {/* Filter Section */}
        <section>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Periode:</span>
            {(["1D", "1W", "1M"] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => handlePeriodChange(period)}
                className={`h-8 ${selectedPeriod === period ? "bg-primary text-white" : "bg-white text-gray-700"}`}
              >
                {period}
              </Button>
            ))}
          </div>
        </section>

        {/* Graph Section */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Grafik Penjualan</span>
                {error && (
                  <Badge variant="destructive" className="ml-2">
                    Data demo
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="items-start">
              <div className="h-64">
                {loading ? (
                  <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl mb-2">⏳</div>
                      <p className="text-gray-600 text-sm">Memuat data...</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%" className="justify-start items-start">
                    <LineChart data={chartData} className="max-w-full" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#014B3E"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#014B3E"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #014B3E',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#009098" 
                        strokeWidth={3}
                        dot={{ fill: '#009098', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#009098', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
              
              {error && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Menggunakan data demo karena gagal terhubung ke server
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Menu Cards Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Menu</h2>
            <Link href="/dashboard/add-menu">
              <Button size="sm" className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white">Tambah</span>
              </Button>
            </Link>
          </div>
          
          {menuLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                <div className="text-gray-500">Loading menu...</div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <Card key={item.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <span className="text-2xl">{item.emoji}</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                          <div>
                            <p className="text-xs text-gray-500">Nama Menu</p>
                            <p className="font-medium">{item.name}</p>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500">Total Terjual</p>
                            <p className="font-medium text-secondary-400">{item.sold} porsi</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Total Pendapatan</p>
                            <p className="font-medium text-primary">Rp {item.revenue.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>

                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {selectedPeriod}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
