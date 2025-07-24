import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StagewiseToolbar } from '@stagewise/toolbar-next'
import ReactPlugin from '@stagewise-plugins/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SmartEG - Smart Warteg Management',
  description: 'Smart Warteg Management App for Indonesian Food Stalls',
  keywords: ['warteg', 'management', 'indonesia', 'food', 'umkm', 'ai', 'voice'],
  authors: [{ name: 'SmartEG Team' }],
  creator: 'SmartEG',
  publisher: 'SmartEG',
  applicationName: 'SmartEG',
  generator: 'Next.js',
  manifest: '/manifest.json',
  themeColor: '#000000',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SmartEG',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SmartEG',
    'application-name': 'SmartEG',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* PWA iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmartEG" />
        
        {/* Additional PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="SmartEG" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Microsoft tile */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        
        {/* Stagewise Toolbar - Only renders in development mode */}
        <StagewiseToolbar 
          config={{
            plugins: [ReactPlugin]
          }}
        />
        
        {/* Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function (registration) {
                      console.log('ServiceWorker registration successful');
                    })
                    .catch(function (err) {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
