import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import LoginButton from '@/components/auth/LoginButton'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <Header />
      <main className="flex items-center justify-center py-20">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">SG</span>
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Masuk ke SmartEG
            </CardTitle>
            <CardDescription className="text-gray-600">
              Kelola Warteg Anda dengan teknologi AI dan Voice Recognition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginButton />
            
            <div className="text-center text-sm text-gray-600">
              <p>Dengan masuk, Anda menyetujui</p>
              <p>
                <a href="#" className="text-primary hover:text-primary/80 hover:underline">
                  Syarat dan Ketentuan
                </a>
                {' '}serta{' '}
                <a href="#" className="text-primary hover:text-primary/80 hover:underline">
                  Kebijakan Privasi
                </a>
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="text-center text-sm text-gray-600">
                <p className="font-semibold mb-3 text-primary">Fitur yang tersedia:</p>
                <div className="grid grid-cols-1 gap-2">
                  <Badge variant="outline" className="justify-start border-secondary/20 text-secondary">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
                    Voice-based Stock Recording
                  </Badge>
                  <Badge variant="outline" className="justify-start border-primary/20 text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Real-time Sales Tracking
                  </Badge>
                  <Badge variant="outline" className="justify-start border-accent/20 text-accent">
                    <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                    AI Supply Prediction
                  </Badge>
                  <Badge variant="outline" className="justify-start border-primary/20 text-primary">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Waste Management Reports
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-primary mb-1">
                🚀 Khusus UMKM Indonesia
              </p>
              <p className="text-xs text-gray-600">
                Gratis 30 hari pertama • Setup 5 menit • Support 24/7
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
} 