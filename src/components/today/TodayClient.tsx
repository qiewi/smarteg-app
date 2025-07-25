"use client";

import { Card, CardContent } from "@/components/ui/card";
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

interface TodayClientProps {
  initialMenuItems: MenuItemData[];
}

export default function TodayClient({ initialMenuItems }: TodayClientProps) {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>(initialMenuItems);

  const totalRevenue = menuItems.reduce((sum, item) => sum + item.revenue, 0);
  const totalSold = menuItems.reduce((sum, item) => sum + item.sold, 0);

  const handleMenuItemChange = (id: number, data: { stock: number; sold: number; price: number; revenue: number }) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data }
        : item
    ));
  };

  return (
    <>
      {/* Section Summary */}
      <div className="flex flex-col space-y-3">
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
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
          href="/ai"
          emoji="🎤"
        />
      </div>

      {/* Section Cards */}
      <div className="space-y-3">
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
            onDataChange={handleMenuItemChange}
          />
        ))}
      </div>
    </>
  );
} 