'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Moon, Sun, Loader2, Maximize2, Minimize2, Settings, FileCode } from 'lucide-react'

// Configure Monaco Editor workers - use simpler approach
if (typeof window !== 'undefined') {
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

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#007acc] mx-auto mb-2" />
          <p className="text-gray-400">Loading VS Code editor...</p>
        </div>
      </div>
    )
  }
)

export default function CodeEditor({ language, value, onChange, theme: initialTheme = 'vs-dark', height = '500px', readOnly = false, showThemeToggle = true, fileName = 'solution' }) {
  const editorRef = useRef(null)
  const [theme, setTheme] = useState(initialTheme)
  const [isMounted, setIsMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [wordWrap, setWordWrap] = useState(true)
  const [minimap, setMinimap] = useState(false)

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
    
    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: minimap },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: wordWrap ? 'on' : 'off',
      lineNumbers: 'on',
      roundedSelection: false,
      cursorStyle: 'line',
      cursorBlinking: 'smooth',
      readOnly: readOnly,
      contextmenu: !readOnly,
      selectOnLineNumbers: true,
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      acceptSuggestionOnEnter: 'on',
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        useShadows: true,
        verticalScrollbarSize: 14,
        horizontalScrollbarSize: 14,
      },
      renderWhitespace: 'selection',
      renderLineHighlight: 'all',
      matchBrackets: 'always',
    })

    // Add keyboard shortcuts
    if (monaco) {
      try {
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          const submitButton = document.querySelector('button[type="button"]')
          if (submitButton && !submitButton.disabled) {
            submitButton.click()
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

  const toggleTheme = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setTheme(prevTheme => prevTheme === 'vs-dark' ? 'vs' : 'vs-dark')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
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

  const isDark = theme === 'vs-dark'
  const editorHeight = isFullscreen ? 'calc(100vh - 100px)' : `calc(${height} - 100px)`

  if (!isMounted) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#007acc] mx-auto mb-2" />
          <p className="text-gray-400">Initializing VS Code editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`w-full relative ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden shadow-xl`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* VS Code-like Title Bar */}
      <div className={`flex items-center justify-between px-4 py-2 ${isDark ? 'bg-[#2d2d30] border-b border-gray-700' : 'bg-[#f3f3f3] border-b border-gray-200'}`}>
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <FileCode className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {fileName}.{languageMap[language] || 'js'}
            </span>
          </div>
          <div className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-[#1e1e1e] text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
            {languageMap[language]?.toUpperCase() || 'JAVASCRIPT'}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showThemeToggle && !readOnly && (
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-1.5 rounded hover:bg-opacity-20 ${isDark ? 'hover:bg-white text-gray-400 hover:text-white' : 'hover:bg-gray-800 text-gray-600 hover:text-gray-900'} transition-colors`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded hover:bg-opacity-20 ${isDark ? 'hover:bg-white text-gray-400 hover:text-white' : 'hover:bg-gray-800 text-gray-600 hover:text-gray-900'} transition-colors`}
            title="Editor Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-1.5 rounded hover:bg-opacity-20 ${isDark ? 'hover:bg-white text-gray-400 hover:text-white' : 'hover:bg-gray-800 text-gray-600 hover:text-gray-900'} transition-colors`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-10 right-2 z-30 ${isDark ? 'bg-[#252526] border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-2xl p-4 min-w-[200px]`}>
          <div className="space-y-3">
            <div>
              <label className={`text-xs font-medium block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Word Wrap
              </label>
              <button
                type="button"
                onClick={() => setWordWrap(!wordWrap)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  wordWrap ? (isDark ? 'bg-[#007acc]' : 'bg-primary-600') : (isDark ? 'bg-gray-600' : 'bg-gray-300')
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    wordWrap ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Minimap
              </label>
              <button
                type="button"
                onClick={() => setMinimap(!minimap)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  minimap ? (isDark ? 'bg-[#007acc]' : 'bg-primary-600') : (isDark ? 'bg-gray-600' : 'bg-gray-300')
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    minimap ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Container */}
      <div className="w-full relative" style={{ height: editorHeight, minHeight: '300px' }}>
        <MonacoEditor
          height="100%"
          language={languageMap[language] || 'javascript'}
          value={value ?? ''}
          onChange={handleChange}
          theme={theme}
          onMount={handleEditorDidMount}
          loading={
            <div className={`flex items-center justify-center h-full ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
              <div className="text-center">
                <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-2 ${isDark ? 'text-[#007acc]' : 'text-primary-600'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading editor...</p>
              </div>
            </div>
          }
          options={{
            fontSize: fontSize,
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: wordWrap ? 'on' : 'off',
            lineNumbers: 'on',
            roundedSelection: false,
            cursorStyle: 'line',
            cursorBlinking: 'smooth',
            readOnly: readOnly,
            contextmenu: !readOnly,
            selectOnLineNumbers: true,
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: true,
              verticalScrollbarSize: 14,
              horizontalScrollbarSize: 14,
            },
            renderWhitespace: 'selection',
            renderLineHighlight: 'all',
            matchBrackets: 'always',
          }}
        />
      </div>

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-1 text-xs ${isDark ? 'bg-[#007acc] text-white' : 'bg-[#f3f3f3] text-gray-700'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-4">
          <span className="font-medium">{languageMap[language]?.toUpperCase() || 'JAVASCRIPT'}</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center space-x-4">
          {value && <span>{value.split('\n').length} lines</span>}
          <span>{value ? value.length : 0} characters</span>
        </div>
      </div>
    </div>
  )
}
