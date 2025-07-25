import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface PortraitCardProps {
  title: string;
  description: string;
  href: string;
  emoji: string;
}

export default function PortraitCard({
  title,
  description,
  href,
  emoji,
}: PortraitCardProps) {
  return (
    <Link href={href} className="block w-full">
      <Card className="hover:shadow-lg transition-all duration-300 group border border-gray-200 bg-white rounded-3xl h-40">
        <CardContent className="p-4 h-full">
          <div className="flex flex-col items-start justify-center h-full space-y-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">{emoji}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm text-gray-900 font-semibold">{title}</h3>
              <p className="text-xs text-gray-600">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 