'use client'

import Link from 'next/link'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-600 mb-6">
          Maaf, terjadi kesalahan pada aplikasi Smarteg.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => reset()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-4"
          >
            Coba Lagi
          </button>
          <Link 
            href="/" 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
} 