import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import TodayClient from "@/components/today/TodayClient";
import { ArrowLeft } from "lucide-react";

export default function TodayPage() {
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
        <TodayClient />
      </div>
    </DashboardLayout>
  );
} 