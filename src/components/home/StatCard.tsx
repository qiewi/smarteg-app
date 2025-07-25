import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  description: string;
  value: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
  gradientType: "sales" | "prediction" | "waste";
}

const getGradientClasses = (type: StatCardProps["gradientType"]) => {
  switch (type) {
    case "sales":
      return "bg-gradient-to-r from-[#014B3E] to-[#678E79] text-white";
    case "prediction":
      return "bg-gradient-to-r from-[#014B3E] to-[#678E79] text-white";
    case "waste":
      return "bg-gradient-to-r from-[#014B3E] to-[#678E79] text-white";
    default:
      return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800";
  }
};

const getIconBgClass = (type: StatCardProps["gradientType"]) => {
  switch (type) {
    case "sales":
      return "bg-white/20 backdrop-blur-sm";
    case "prediction":
      return "bg-white/20 backdrop-blur-sm";
    case "waste":
      return "bg-white/20 backdrop-blur-sm";
    default:
      return "bg-gray-500";
  }
};

const getTextClasses = (type: StatCardProps["gradientType"]) => {
  switch (type) {
    case "sales":
      return {
        title: "text-white font-semibold drop-shadow-sm",
        description: "text-white/90",
        value: "text-white font-bold drop-shadow-sm",
        subtitle: "text-white/90",
      };
    case "prediction":
      return {
        title: "text-white font-semibold drop-shadow-sm",
        description: "text-white/90",
        value: "text-white font-bold drop-shadow-sm",
        subtitle: "text-white/90",
      };
    case "waste":
      return {
        title: "text-white font-semibold drop-shadow-sm",
        description: "text-white/90",
        value: "text-white font-bold drop-shadow-sm",
        subtitle: "text-white/90",
      };
    default:
      return {
        title: "text-gray-800 font-semibold",
        description: "text-gray-600",
        value: "text-gray-900 font-bold",
        subtitle: "text-gray-600",
      };
  }
};

export default function StatCard({
  title,
  description,
  href,
  icon: Icon,
  gradientType,
}: StatCardProps) {
  const gradientClasses = getGradientClasses(gradientType);
  const iconBgClass = getIconBgClass(gradientType);
  const textClasses = getTextClasses(gradientType);
  const iconColor = "text-white";

  return (
    <Link href={href} className="flex-1">
      <Card className={`hover:shadow-lg transition-all duration-300 group border-0 rounded-3xl h-40 ${gradientClasses}`}>
        <CardContent className="p-4 h-full">
          <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
            <div className={`w-12 h-12 rounded-full ${iconBgClass} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className="space-y-1">
              <h3 className={`text-sm ${textClasses.title} font-semibold`}>{title}</h3>
              <p className={`text-xs ${textClasses.description}`}>{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 