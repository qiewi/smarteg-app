"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "stable";
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  color = "blue" 
}: DashboardCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-700 border-red-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };

  const getTrendIcon = () => {
    if (trend === "up") return "↗️";
    if (trend === "down") return "↘️";
    return "➡️";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`${colorClasses[color]} hover:shadow-md transition-shadow`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium opacity-70">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {value}
            </div>
            {trend && (
              <div className="text-sm">
                {getTrendIcon()}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs opacity-60 mt-1">
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardCard; 