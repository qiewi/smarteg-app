import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Instrument_Sans } from 'next/font/google'
import { StagewiseToolbar } from '@stagewise/toolbar-next'
import ReactPlugin from '@stagewise-plugins/react'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Smarteg - Kurangi Limbah, Tingkatkan Efisiensi, Maksimalkan Pendapatan',
  description: 'Smarteg adalah aplikasi manajemen Warteg berbasis suara yang membantu UMKM Indonesia mengurangi limbah makanan, meningkatkan efisiensi operasional, dan memaksimalkan pendapatan melalui pengelolaan stok dan prediksi kebutuhan yang cerdas.',
  keywords: ['warteg', 'manajemen limbah', 'efisiensi operasional', 'umkm', 'pengelolaan stok', 'pendapatan warteg', 'ai', 'aplikasi suara', 'indonesia', 'sustainability'],
  authors: [{ name: 'Tim Smarteg' }],
  creator: 'Tim Smarteg',
  publisher: 'Smarteg',
  applicationName: 'Smarteg',
  generator: 'Next.js',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Smarteg',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Smarteg',
    'application-name': 'Smarteg',
    'msapplication-TileColor': '#014B3E',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#014B3E',
    'description': 'Aplikasi PWA untuk Warteg yang membantu mengurangi limbah makanan, meningkatkan efisiensi operasional, dan memaksimalkan pendapatan melalui pengelolaan stok dan prediksi kebutuhan yang cerdas.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#009098',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#014B3E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Smarteg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="description" content="Smarteg adalah aplikasi manajemen Warteg berbasis suara yang membantu UMKM Indonesia mengurangi limbah makanan, meningkatkan efisiensi operasional, dan memaksimalkan pendapatan melalui pengelolaan stok dan prediksi kebutuhan yang cerdas." />
        <meta name="keywords" content="warteg, manajemen limbah, efisiensi operasional, umkm, pengelolaan stok, pendapatan warteg, ai, aplikasi suara, indonesia, sustainability" />
        <meta name="author" content="Tim Smarteg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/bg-hero.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/bg-cta.jpg" as="image" type="image/jpeg" />
<<<<<<< HEAD
        <script async src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
=======
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />

>>>>>>> 3669eb593a3161bde948c71e96fe8d1a22f7bcd8
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${instrumentSans.className} antialiased`}>
        {children}
        <StagewiseToolbar 
          config={{
            plugins: [ReactPlugin],
          }}
        />
      </body>
    </html>
  )
}