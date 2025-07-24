export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-primary-600 mb-4">
          Anda Sedang Offline
        </h1>
        <p className="text-gray-600 mb-6">
          Tidak ada koneksi internet. SmartEG akan kembali normal saat koneksi tersedia.
        </p>
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-primary-200 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  )
} 