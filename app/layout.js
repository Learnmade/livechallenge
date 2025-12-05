'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { BattleProvider } from '@/contexts/BattleContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import dynamic from 'next/dynamic'

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Community Coding Battles - Learnmade</title>
        <meta name="description" content="Real-time competitive coding battles for live streams" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0284c7" />
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body className={`${inter.className} bg-gray-50`}>
        <ErrorBoundary>
          <AuthProvider>
            <BattleProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#1f2937',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  },
                }}
              />
            </BattleProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

