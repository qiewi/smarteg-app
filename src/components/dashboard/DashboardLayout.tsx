"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import BottomNav from "@/components/common/BottomNav";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* PWA Header */}
      <motion.header 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b sticky top-0 z-10"
      >
        <div className="px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">SmartEG Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Profile
            </Button>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default DashboardLayout; 