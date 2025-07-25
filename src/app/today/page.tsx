import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TodayClient from "@/components/today/TodayClient";

interface MenuItemData {
  id: number;
  emoji: string;
  name: string;
  stock: number;
  sold: number;
  price: number;
  revenue: number;
}

// Server-side data - this could come from a database
const getMenuItems = (): MenuItemData[] => {
  return [
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
  ];
};

export default function TodayPage() {
  const initialMenuItems = getMenuItems();

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        {/* Client-side content */}
        <TodayClient initialMenuItems={initialMenuItems} />
      </div>
    </DashboardLayout>
  );
} 