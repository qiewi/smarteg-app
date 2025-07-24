"use client";

import { ReactNode } from "react";
import BottomNav from "@/components/common/BottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default DashboardLayout; 