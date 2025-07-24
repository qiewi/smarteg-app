'use client'

import { useEffect, useState } from 'react'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (isOnline) {
      // Redirect to home when back online
      window.location.href = '/'
    }
  }, [isOnline])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#014B3E] to-[#016A4F]">
      <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
        <div className="mb-6">
          <div className="w-20 h-20 bg-[#014B3E] rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#014B3E] mb-2">
            Smarteg Offline
          </h1>
          <p className="text-gray-600 mb-4">
            Tidak ada koneksi internet. Aplikasi akan otomatis tersambung kembali saat koneksi tersedia.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-pulse">
              <div className="w-3 h-3 bg-[#014B3E] rounded-full"></div>
            </div>
            <span className="text-sm text-gray-500">Menunggu koneksi...</span>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#014B3E] text-white px-6 py-3 rounded-lg hover:bg-[#016A4F] transition-colors w-full"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  )
} 