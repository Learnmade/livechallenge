'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { BattleProvider } from '@/contexts/BattleContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Community Coding Battles - Learnmade</title>
        <meta name="description" content="Real-time competitive coding battles for live streams" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <BattleProvider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#1e1e1e',
                    color: '#fff',
                    border: '1px solid #333',
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

