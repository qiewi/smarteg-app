import LoginButton from '@/components/auth/LoginButton'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col" style={{ backgroundImage: 'url(/bg-cta.jpg)' }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Back Button */}
        <div className="px-6 pt-6">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white hover:bg-white/30 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        {/* Header Section */}
        <div className="px-6 pt-8 pb-8">
          <div className="space-y-6">
            {/* Logo */}
            <Image src="/just-icon.png" alt="Smarteg" width={64} height={64} className="w-16 h-16" />
            
            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">
                Masuk ke <span className="text-white text-4xl font-eb-garamond italic font-normal leading-tight">Smarteg</span>
              </h1>
              <p className="text-white/80 text-base">
                Kelola warteg Anda dengan teknologi AI
              </p>
            </div>
          </div>
        </div>

        {/* Login Content - White background with rounded top corners */}
        <div className="flex-1 bg-white rounded-t-3xl px-6 pb-8 pt-8">
          <div className="max-w-sm space-y-6">
            
            {/* Separator above button */}
            <div className="flex items-center justify-center">
              <div className="w-24 h-1 bg-gray-200 rounded-full"></div>
            </div>
            
            {/* Login Button */}
            <LoginButton />

            {/* Separator */}
            <div className="flex items-center justify-center">
              <div className="w-full h-px bg-gray-200 rounded-full"></div>
            </div>

            {/* Terms and Privacy */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Dengan masuk ke Smarteg, Anda menyetujui{' '}
              <a href="#" className="text-primary-600 hover:underline">Syarat Layanan</a>
              {' '}dan{' '}
              <a href="#" className="text-primary-600 hover:underline">Kebijakan Privasi</a>
              {' '}kami.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-gray-900 font-medium">Fitur Unggulan</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🤖</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">AI Prediksi Penjualan</p>
                      <p className="text-gray-600 text-xs">Prediksi akurat untuk stok dan penjualan</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🎤</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">Voice Recognition</p>
                      <p className="text-gray-600 text-xs">Update data dengan perintah suara</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primer/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">Analytics Dashboard</p>
                      <p className="text-gray-600 text-xs">Laporan penjualan real-time</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 