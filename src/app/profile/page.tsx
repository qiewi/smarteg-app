import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Bell } from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Profile Header */}
        <Card className="border-0 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <h2 className="text-xl font-semibold">User Name</h2>
                <p>user@smarteg.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Options */}
        <div className="space-y-3">
          <Card className="py-4">
            <CardContent className="px-4">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-3 h-5 w-5" />
                Pengaturan
              </Button>
            </CardContent>
          </Card>

          <Card className="py-4">
            <CardContent className="px-4">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
                <LogOut className="mr-3 h-5 w-5" />
                Keluar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 