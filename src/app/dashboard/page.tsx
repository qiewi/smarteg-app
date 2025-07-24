"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MenuItemDisplay {
  id: number;
  emoji: string;
  name: string;
  sold: number;
  revenue: number;
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"1D" | "1W" | "1M">("1W");

  const menuItems: MenuItemDisplay[] = [
    {
      id: 1,
      emoji: "🍛",
      name: "Nasi Gudeg",
      sold: 47,
      revenue: 564000
    },
    {
      id: 2,
      emoji: "🍳",
      name: "Nasi Telur Dadar",
      sold: 62,
      revenue: 496000
    },
    {
      id: 3,
      emoji: "🐟",
      name: "Ikan Bakar",
      sold: 23,
      revenue: 345000
    },
    {
      id: 4,
      emoji: "🥬",
      name: "Sayur Lodeh",
      sold: 38,
      revenue: 190000
    },
    {
      id: 5,
      emoji: "🍗",
      name: "Ayam Goreng",
      sold: 31,
      revenue: 558000
    }
  ];

  const chartData = {
    "1D": [12, 19, 15, 25, 22, 18, 28, 32],
    "1W": [85, 92, 78, 110, 95, 88, 125],
    "1M": [2340, 2150, 2680, 2420, 2890]
  };

  const chartLabels = {
    "1D": ["06:00", "09:00", "12:00", "15:00", "18:00", "21:00", "24:00", "03:00"],
    "1W": ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    "1M": ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5"]
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
              <p className="text-gray-600">Analisis data penjualan</p>
            </div>
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
                onClick={() => setSelectedPeriod(period)}
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
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-600 text-sm">
                    Grafik {selectedPeriod === "1D" ? "Per Jam" : selectedPeriod === "1W" ? "Per Hari" : "Per Minggu"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Data: {chartData[selectedPeriod].join(", ")} porsi terjual
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Menu Cards Section */}
        <section className="pb-32">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Daftar Menu</h2>
            <Link href="/dashboard/add-menu">
              <Button size="sm" className="flex items-center space-x-2">
                <Plus className="w-4 h-4 text-white" />
                <span className="text-white">Tambah</span>
              </Button>
            </Link>
          </div>
          
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
                          <p className="font-medium text-blue-600">{item.sold} porsi</p>
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
        </section>
      </div>
    </DashboardLayout>
  );
}
