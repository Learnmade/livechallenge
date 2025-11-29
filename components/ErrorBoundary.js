'use client'

import { Component } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
    // Log to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
          <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-[#c9d1d9]">Something went wrong</h1>
            </div>
            <p className="text-[#8b949e] mb-6 leading-relaxed">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page or returning to the home page.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Page</span>
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-4 py-3 rounded-lg transition-colors font-medium border border-[#30363d]"
                >
                  Try Again
                </button>
                <Link
                  href="/"
                  className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] px-4 py-3 rounded-lg transition-colors font-medium border border-[#30363d] flex items-center justify-center space-x-2"
                >
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </Link>
              </div>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6">
                <summary className="text-sm text-[#8b949e] cursor-pointer hover:text-[#c9d1d9] transition-colors">
                  Error Details (Development Only)
                </summary>
                <div className="mt-3 bg-[#0d1117] border border-[#30363d] rounded-lg p-4 overflow-auto max-h-64">
                  <pre className="text-xs text-red-400 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.error.stack && `\n\n${this.state.error.stack}`}
                    {this.state.errorInfo && `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

