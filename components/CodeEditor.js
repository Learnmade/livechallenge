'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Moon, Sun, Loader2, Maximize2, Minimize2, Settings, FileCode, X, Circle, ChevronRight, ChevronDown, Folder, Play, CheckCircle } from 'lucide-react'
import Button from './ui/Button'

// Configure Monaco Editor workers - use simpler approach
// Only configure on client side to avoid SSR issues
if (typeof window !== 'undefined' && typeof self !== 'undefined') {
  if (!window.MonacoEnvironment) {
    window.MonacoEnvironment = {
      getWorkerUrl: function (moduleId, label) {
        // Use CDN for workers as fallback
        if (label === 'json') {
          return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/json/json.worker.js'
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/css/css.worker.js'
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/html/html.worker.js'
        }
        if (label === 'typescript' || label === 'javascript') {
          return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/language/typescript/ts.worker.js'
        }
        return 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.worker.js'
      }
    }
  }
}

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[#030712]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary-500" />
          <p className="text-gray-400">Loading editor...</p>
        </div>
      </div>
    )
  }
)

export default function CodeEditor({
  language,
  value,
  onChange,
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  theme: initialTheme = 'vs-dark',
  height = '100%',
  readOnly = false,
  showThemeToggle = true,
  fileName = 'solution'
}) {
  const editorRef = useRef(null)
  const [theme, setTheme] = useState(initialTheme)
  const [isMounted, setIsMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState(true)
  const [minimap, setMinimap] = useState(false)

  // New Layout State
  const [activeTab, setActiveTab] = useState('code')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editorRef.current && isMounted) {
      editorRef.current.updateOptions({
        fontSize,
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap },
      })
    }
  }, [fontSize, wordWrap, minimap, isMounted])

  const handleEditorDidMount = (editor, monaco) => {
    if (!editor) return

    editorRef.current = editor

    // Define Obsidian/Premium Dark Theme
    if (monaco) {
      monaco.editor.defineTheme('obsidian-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6272A4', fontStyle: 'italic' },
          { token: 'keyword', foreground: 'FF79C6', fontStyle: 'bold' },
          { token: 'string', foreground: 'F1FA8C' },
          { token: 'number', foreground: 'BD93F9' },
          { token: 'type', foreground: '8BE9FD' },
          { token: 'function', foreground: '50FA7B' },
          { token: 'variable', foreground: 'F8F8F2' },
          { token: 'constant', foreground: 'BD93F9' },
        ],
        colors: {
          'editor.background': '#030712', // Matches tailwind background
          'editor.foreground': '#F8F8F2',
          'editorLineNumber.foreground': '#6272A4',
          'editorLineNumber.activeForeground': '#F8F8F2',
          'editor.selectionBackground': '#44475A',
          'editor.lineHighlightBackground': '#44475A22',
          'editorCursor.foreground': '#F8F8F2',
          'editorWhitespace.foreground': '#6272A4',
          'editorIndentGuide.background': '#6272A4',
          'editorIndentGuide.activeBackground': '#F8F8F2',
        },
      })
      monaco.editor.setTheme('obsidian-dark')
    }

    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
      fontLigatures: true,
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      padding: { top: 16, bottom: 16 },
      roundedSelection: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      formatOnPaste: true,
      formatOnType: true,
    })

    // Keyboard shortcuts
    if (monaco) {
      try {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          if (onRun && !isRunning && !isSubmitting) {
            onRun()
          }
        })
      } catch (error) {
        console.warn('Could not add keyboard shortcuts:', error)
      }
    }
  }

  const handleChange = (newValue) => {
    if (onChange && typeof onChange === 'function') {
      onChange(newValue || '')
    }
  }

  const languageMap = {
    javascript: 'javascript',
    python: 'python',
    cpp: 'cpp',
    java: 'java',
    go: 'go',
    rust: 'rust',
    csharp: 'csharp',
    typescript: 'typescript',
  }

  if (!isMounted) return null

  return (
    <div
      className={`flex flex-col w-full h-full bg-[#030712] border border-white/10 rounded-xl overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Premium Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#0B1121]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
              <FileCode className="h-4 w-4 text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{fileName}</p>
              <p className="text-xs text-primary-400 font-mono uppercase tracking-wider">
                {languageMap[language] || 'JS'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Actions */}
          <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/5 mr-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-md transition-all ${showSettings ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              title="Editor Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-md transition-all text-gray-400 hover:text-white hover:bg-white/5"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="hidden sm:flex"
          >
            {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
            <span className="ml-2">Run</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="hidden sm:flex bg-green-600 hover:bg-green-700 text-white border-none"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            <span className="ml-2">Submit</span>
          </Button>
        </div>
      </div>

      {/* Settings Panel Overlay */}
      {showSettings && (
        <div className="absolute top-14 right-4 z-30 w-64 bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <h3 className="text-sm font-semibold text-white">Editor Settings</h3>
            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Font Size: {fontSize}px</label>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Word Wrap</label>
              <button
                onClick={() => setWordWrap(!wordWrap)}
                className={`w-10 h-5 rounded-full transition-colors relative ${wordWrap ? 'bg-primary-600' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${wordWrap ? 'translate-x-5' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Minimap</label>
              <button
                onClick={() => setMinimap(!minimap)}
                className={`w-10 h-5 rounded-full transition-colors relative ${minimap ? 'bg-primary-600' : 'bg-gray-700'}`}
              >
                <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${minimap ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 relative bg-[#030712]">
        <MonacoEditor
          height="100%"
          language={languageMap[language] || 'javascript'}
          value={value ?? ''}
          onChange={handleChange}
          theme="obsidian-dark" // Forces our custom theme
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full bg-[#030712]">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          }
          options={{
            // Options are updated in handleEditorDidMount and useEffect
            minimap: { enabled: minimap }
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#0B1121] border-t border-white/10 text-xs text-gray-500 font-mono">
        <div className="flex items-center space-x-3">
          <span>Ln {value ? value.split('\n').length : 1}</span>
          <span>Col {1}</span>
          <span>UTF-8</span>
        </div>
        <div>
          {value ? value.length : 0} chars
        </div>
      </div>
    </div>
  )
}
