import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Bell } from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">User Name</h2>
                <p className="text-gray-500">user@smarteg.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Options */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-3 h-5 w-5" />
                Pengaturan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-3 h-5 w-5" />
                Notifikasi
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
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