/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Production optimizations
  swcMinify: true,
  productionBrowserSourceMaps: false, // Disable source maps in production for security
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    
    // Exclude Monaco Editor from server-side bundle
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        '@monaco-editor/react': 'commonjs @monaco-editor/react',
      })
    }
    
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
            },
            monaco: {
              test: /[\\/]node_modules[\\/]@monaco-editor[\\/]/,
              name: 'monaco',
              priority: 20,
            },
          },
        },
      }
    }
    
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https:",
              "connect-src 'self' ws: wss: https://challenge.learn-made.in https://cdn.jsdelivr.net blob:",
              "worker-src 'self' blob: https://cdn.jsdelivr.net",
              "frame-ancestors 'self'",
            ].join('; ')
          }
        ]
      }
    ]
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig

