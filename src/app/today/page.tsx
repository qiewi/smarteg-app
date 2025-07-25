import DashboardLayout from "@/components/dashboard/DashboardLayout";
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
          <Link href="/home" className="inline-flex items-center justify-center w-10 h-10 bg-gray-300/40 backdrop-blur-sm border border-gray-400/30 rounded-md text-white hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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