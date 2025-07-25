"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import MenuCard from "@/components/today/MenuCard";
import LandscapeCard from "@/components/home/LandscapeCard";
import { menuAPI, salesAPI, DailySalesResponse } from "@/lib/api";

interface MenuItemData {
  id: number;
  emoji: string;
  name: string;
  stock: number;
  sold: number;
  price: number;
  revenue: number;
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

export default function TodayClient() {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch menu and sales data in parallel
        const [menuResponse, salesResponse] = await Promise.all([
          menuAPI.getMenu(),
          salesAPI.getDailySales()
        ]);

        const menuData = (menuResponse as MenuResponse).data.menu;
        const salesData = (salesResponse as DailySalesResponse).data.items;

        // Map menu items with sales data
        const mappedMenuItems: MenuItemData[] = menuData.map((menuItem: any, index: number) => {
          // Find corresponding sales data by name
          const salesItem = salesData.find((sale: any) => sale.name === menuItem.name);
          const sold = salesItem ? salesItem.counts : 0;
          const revenue = sold * menuItem.price;
          
          return {
            id: index + 1,
            emoji: menuItem.icon,
            name: menuItem.name,
            stock: 20, // Default stock as this isn't provided by API
            sold: sold,
            price: menuItem.price,
            revenue: revenue
          };
        });

        setMenuItems(mappedMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const totalRevenue = menuItems.reduce((sum, item) => sum + item.revenue, 0);
  const totalSold = menuItems.reduce((sum, item) => sum + item.sold, 0);

  const handleMenuItemChange = (id: number, data: { stock: number; sold: number; price: number; revenue: number }) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data }
        : item
    ));
  };

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