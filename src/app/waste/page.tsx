import DashboardLayout from "@/components/dashboard/PWALayout";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import WasteClient from "@/components/waste/WasteClient";

export default function WastePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <section className="flex items-center space-x-3">
          <Link href="/home" className="p-2 -ml-2 rounded-lg border border-gray-200/60 bg-gray-50/30 backdrop-blur-sm hover:bg-gray-100/60 hover:border-gray-300/70 transition-all duration-200">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-medium text-gray-900">Sisa Makanan</h1>
            <p className="text-sm text-gray-500">Manajemen limbah makanan</p>
          </div>
        </section>

        {/* Client-side content with real data */}
        <WasteClient />
      </div>
    </DashboardLayout>
  );
} 