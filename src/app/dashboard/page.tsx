"use client";

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const todayDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang di SmartEG
          </h1>
          <p className="text-gray-600">{todayDate}</p>
          <Badge variant="outline" className="mt-2">
            Demo Mode - Task 1 Complete
          </Badge>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <DashboardCard
            title="Penjualan Hari Ini"
            value="Coming Soon"
            subtitle="Target: Rp 500,000"
            color="blue"
            trend="up"
          />
          <DashboardCard
            title="Stok Tersedia"
            value="Coming Soon"
            subtitle="10 menu items"
            color="green"
            trend="stable"
          />
          <DashboardCard
            title="Waste Hari Ini"
            value="Coming Soon"
            subtitle="Target: < 5%"
            color="yellow"
            trend="down"
          />
          <DashboardCard
            title="Prediksi Besok"
            value="Coming Soon"
            subtitle="AI Processing"
            color="purple"
            trend="up"
          />
        </div>

        {/* Voice Commands Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Voice Commands Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="h-12 justify-start">
                🎤 &quot;Stok ayam goreng 20 potong&quot;
              </Button>
              <Button variant="outline" className="h-12 justify-start">
                🎤 &quot;Jual nasi, ayam, tempe&quot;
              </Button>
              <Button variant="outline" className="h-12 justify-start">
                🎤 &quot;Rendang ready 15 porsi&quot;
              </Button>
              <Button variant="outline" className="h-12 justify-start">
                🎤 &quot;Tutup hari&quot;
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Voice commands akan diaktifkan di Task 5 & 6
            </p>
          </CardContent>
        </Card>

        {/* AI Features Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Features Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Supply Prediction</p>
                  <p className="text-sm text-blue-700">Frontend algorithm ready</p>
                </div>
                <Badge variant="secondary">✓ Ready</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">Voice Processing</p>
                  <p className="text-sm text-yellow-700">STT/TTS services ready</p>
                </div>
                <Badge variant="secondary">✓ Ready</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">WebSocket AI</p>
                  <p className="text-sm text-green-700">Real-time processing ready</p>
                </div>
                <Badge variant="secondary">✓ Ready</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Development Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge variant="default">Task 2</Badge>
                <span>Google OAuth Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Task 3</Badge>
                <span>IndexedDB Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Task 4</Badge>
                <span>WebSocket Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default">Task 5-6</Badge>
                <span>Voice Recognition (STT/TTS)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 