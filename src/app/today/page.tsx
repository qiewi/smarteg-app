"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MenuCard from "@/components/today/MenuCard";
import LandscapeCard from "@/components/home/LandscapeCard";

interface MenuItemData {
  id: number;
  emoji: string;
  name: string;
  stock: number;
  sold: number;
  price: number;
  revenue: number;
}

export default function TodayPage() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([
    {
      id: 1,
      emoji: "🍛",
      name: "Nasi Gudeg",
      stock: 15,
      sold: 8,
      price: 12000,
      revenue: 96000
    },
    {
      id: 2,
      emoji: "🍳",
      name: "Nasi Telur Dadar",
      stock: 20,
      sold: 12,
      price: 8000,
      revenue: 96000
    },
    {
      id: 3,
      emoji: "🐟",
      name: "Ikan Bakar",
      stock: 10,
      sold: 6,
      price: 15000,
      revenue: 90000
    },
    {
      id: 4,
      emoji: "🥬",
      name: "Sayur Lodeh",
      stock: 25,
      sold: 10,
      price: 5000,
      revenue: 50000
    },
    {
      id: 5,
      emoji: "🍗",
      name: "Ayam Goreng",
      stock: 8,
      sold: 12,
      price: 18000,
      revenue: 216000
    }
  ]);

  const totalRevenue = menuItems.reduce((sum, item) => sum + item.revenue, 0);
  const totalSold = menuItems.reduce((sum, item) => sum + item.sold, 0);

  const handleSave = (id: number) => {
    // Update revenue based on sold and price
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, revenue: item.sold * item.price }
        : item
    ));
  };

  const updateMenuItem = (id: number, field: string, value: number) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, [field]: value }
        : item
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/home">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Penjualan Hari Ini</h1>
            <p className="text-gray-600">Ringkasan dan kelola menu</p>
          </div>
        </div>

        {/* Section Summary */}
        <div className="flex flex-col space-y-3">
          <Card className="border-0 bg-gradient-to-r from-primary to-[#014B3E] text-white">
            <CardContent className="px-6">
              <div className="text-center space-y-4">
                <div className="flex flex-col items-start justify-center gap-2">
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-white/90 text-sm font-medium">Total Pendapatan</p>
                    <p className="text-3xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <p className="text-white/90 text-sm font-medium">Total Menu Terjual</p>
                    <p className="text-xl font-bold">{totalSold} porsi</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <LandscapeCard
            title="Mau lebih mudah?"
            description="Ubah pakai suara aja"
            value=""
            subtitle=""
            href="/ai"
            icon={Mic}
          />
        </div>

        {/* Section Cards */}
        <div className="space-y-3 pb-32">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Menu</h2>
          {menuItems.map((item) => (
            <MenuCard
              key={item.id}
              id={item.id}
              emoji={item.emoji}
              name={item.name}
              stock={item.stock}
              sold={item.sold}
              price={item.price}
              revenue={item.revenue}
              onUpdate={updateMenuItem}
              onSave={handleSave}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 