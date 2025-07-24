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
      <Card className="hover:shadow-lg transition-all duration-300 group border border-gray-200 bg-white rounded-3xl py-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{emoji}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm text-gray-900 font-semibold">{title}</h3>
                <p className="text-xs text-gray-600">{description}</p>
                {(value || subtitle) && (
                  <div className="flex items-center space-x-2 mt-2">
                    {value && <span className="text-lg text-gray-900 font-bold">{value}</span>}
                    {subtitle && <span className="text-xs text-gray-600">{subtitle}</span>}
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 