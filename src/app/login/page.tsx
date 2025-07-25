import LoginButton from '@/components/auth/LoginButton'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-accent flex flex-col">
      {/* PWA Header */}
      <div className="relative overflow-hidden px-6 pt-16 pb-8 text-white">
        {/* Decorative Elements */}
        <div className="absolute top-8 right-8 opacity-20">
          <div className="w-16 h-16 rounded-full border-2 border-white/30"></div>
        </div>
        <div className="absolute bottom-0 right-0 opacity-10">
          <div className="w-24 h-24 rounded-full bg-white/20 transform translate-x-6 translate-y-6"></div>
        </div>

        {/* Logo and Title */}
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center border border-white/30">
            <span className="text-3xl font-bold text-white">SG</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Masuk ke SmartEG</h1>
          <p className="text-white/80 text-lg">Kelola Warteg Anda dengan teknologi AI</p>
        </div>
      </div>

      {/* Login Content */}
      <div className="bg-white rounded-t-3xl p-6 space-y-6 flex-1">
        <div className="space-y-6">
          <LoginButton />
  
        </div>

        {/* Features Preview */}
        <div className="mt-12 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 text-center">Fitur Unggulan</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">AI Prediksi Penjualan</p>
                <p className="text-xs text-gray-600">Prediksi akurat untuk stok dan penjualan</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎤</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Voice Recognition</p>
                <p className="text-xs text-gray-600">Update data dengan perintah suara</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Analytics Dashboard</p>
                <p className="text-xs text-gray-600">Laporan penjualan real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 