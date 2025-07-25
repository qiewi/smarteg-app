import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import TodayClient from "@/components/today/TodayClient";
import { ArrowLeft } from "lucide-react";

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
      <section className="flex items-center space-x-3">
          <Link href="/home" className="p-2 -ml-2 rounded-lg border border-gray-200/60 bg-gray-50/30 backdrop-blur-sm hover:bg-gray-100/60 hover:border-gray-300/70 transition-all duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-medium text-gray-900">Data Penjualan</h1>
            <p className="text-sm text-gray-500">Penjualan hari ini</p>
          </div>
        </section>

        {/* Client-side content */}
        <TodayClient initialMenuItems={initialMenuItems} />
      </div>
    </DashboardLayout>
  );
} 