"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
          <h1 className="text-xl font-bold text-primary">Smarteg Dashboard</h1>
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
      <main className="p-4">
        {children}
      </main>

      {/* PWA Bottom Navigation */}
      <motion.nav 
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg"
      >
        <div className="grid grid-cols-4 gap-1 p-2">
          <Button variant="ghost" className="flex flex-col items-center py-3 text-xs">
            <div className="w-6 h-6 bg-blue-100 rounded mb-1"></div>
            Dashboard
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3 text-xs">
            <div className="w-6 h-6 bg-green-100 rounded mb-1"></div>
            Stock
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3 text-xs">
            <div className="w-6 h-6 bg-yellow-100 rounded mb-1"></div>
            Sales
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3 text-xs">
            <div className="w-6 h-6 bg-red-100 rounded mb-1"></div>
            Reports
          </Button>
        </div>
      </motion.nav>

      {/* Add bottom padding to avoid bottom nav overlap */}
      <div className="h-20"></div>
    </div>
  );
};

export default DashboardLayout; 