import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface LandscapeCardProps {
  title: string;
  description: string;
  value?: string;
  subtitle?: string;
  href: string;
  emoji: string;
}

export default function LandscapeCard({
  title,
  description,
  value,
  subtitle,
  href,
  emoji,
}: LandscapeCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-all duration-300 group border border-gray-200 bg-gradient-to-br from-primary-500 to-accent rounded-3xl py-2 relative overflow-hidden">
        {/* Glass overlay */}
        <div className="absolute inset-2 bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl pointer-events-none"></div>
        
        <CardContent className="p-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm text-white font-bold">{title}</h3>
                <p className="text-xs text-white">{description}</p>
                {(value || subtitle) && (
                  <div className="flex items-center space-x-2 mt-2">
                    {value && <span className="text-lg text-accent-300 font-bold">{value}</span>}
                    {subtitle && <span className="text-xs text-white">{subtitle}</span>}
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