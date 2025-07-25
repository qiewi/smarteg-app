"use client";

import { ReactNode } from "react";
import BottomNav from "@/components/common/BottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

const DashboardLayout = ({ children, noPadding = false }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className={noPadding ? "" : "p-6 pb-32"}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default DashboardLayout; 