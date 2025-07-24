import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, ChevronRight } from "lucide-react";

interface LandscapeCardProps {
  title: string;
  description: string;
  value?: string;
  subtitle?: string;
  href: string;
  icon: LucideIcon;
}

export default function LandscapeCard({
  title,
  description,
  value,
  subtitle,
  href,
  icon: Icon,
}: LandscapeCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-300 group border-0 rounded-3xl bg-gradient-to-tl from-[#014B3E] to-[#678E79] text-white py-4">
        <CardContent className="px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1 justify-center">
                <h3 className="text-sm text-white font-semibold drop-shadow-sm">{title}</h3>
                <p className="text-xs text-white/90">{description}</p>
                {(value || subtitle) && (
                  <div className="flex items-center space-x-2 mt-2">
                    {value && <span className="text-lg text-white font-bold drop-shadow-sm">{value}</span>}
                    {subtitle && <span className="text-xs text-white/90">{subtitle}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 