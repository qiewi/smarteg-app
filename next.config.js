import withPWA from 'next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  buildExcludes: [/manifest\.json$/],
  fallbacks: {
    document: '/offline'
  },
  runtimeCaching: [
    {
      urlPattern: /^https?.*/, 
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Turbopack configuration (moved from experimental)
  },
  
  // Environment variables yang bisa diakses di browser
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // API Proxy/Rewrites untuk backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://api.smarteg.app'}/:path*`,
      },
    ]
  },

  // Headers untuk CORS jika diperlukan
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_API_URL || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  }
}

export default pwaConfig(nextConfig); 