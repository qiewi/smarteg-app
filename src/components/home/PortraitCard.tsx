import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface PortraitCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradientType: "sales" | "prediction";
}

const getGradientClasses = (type: PortraitCardProps["gradientType"]) => {
  switch (type) {
    case "sales":
      return "bg-gradient-to-tl from-[#014B3E] to-[#678E79] text-white";
    case "prediction":
      return "bg-gradient-to-tl from-[#014B3E] to-[#678E79] text-white";
    default:
      return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800";
  }
};

export default function PortraitCard({
  title,
  description,
  href,
  icon: Icon,
  gradientType,
}: PortraitCardProps) {
  const gradientClasses = getGradientClasses(gradientType);

  return (
    <Link href={href} className="flex-1">
      <Card className={`hover:shadow-lg transition-all duration-300 group border-0 rounded-3xl h-40 ${gradientClasses}`}>
        <CardContent className="p-4 h-full py-8">
          <div className="flex flex-col items-start justify-center h-full space-y-3">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="space-y-1 items-start">
              <h3 className="text-sm text-white font-semibold drop-shadow-sm">{title}</h3>
              <p className="text-xs text-white/90">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 