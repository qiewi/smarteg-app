import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import LoginButton from '@/components/auth/LoginButton'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex items-center justify-center py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Masuk ke SmartEG
            </CardTitle>
            <CardDescription>
              Kelola Warteg Anda dengan teknologi AI dan Voice Recognition
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <LoginButton />
            
            <div className="text-center text-sm text-gray-600">
              <p>Dengan masuk, Anda menyetujui</p>
              <p>
                <a href="#" className="text-blue-600 hover:underline">
                  Syarat dan Ketentuan
                </a>
                {' '}serta{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </a>
              </p>
            </div>
            
            <div className="border-t pt-6">
              <div className="text-center text-sm text-gray-600">
                <p className="font-semibold mb-2">Fitur yang tersedia:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Voice-based Stock Recording</li>
                  <li>✓ Real-time Sales Tracking</li>
                  <li>✓ AI Supply Prediction</li>
                  <li>✓ Waste Management Reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
} 