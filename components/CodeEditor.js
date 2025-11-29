'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Moon, Sun, Loader2, Maximize2, Minimize2, Settings, FileCode, X, Circle, ChevronRight, ChevronDown, Folder, File } from 'lucide-react'

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
      <div className={`flex items-center justify-center h-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
        <div className="text-center">
          <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-2 ${isDark ? 'text-[#58a6ff]' : 'text-primary-600'}`} />
          <p className={isDark ? 'text-[#8b949e]' : 'text-gray-600'}>Loading editor...</p>
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
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(250)

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
    
    // Define Cursor-like theme colors
    if (monaco && theme === 'vs-dark') {
      monaco.editor.defineTheme('cursor-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: '569CD6' },
          { token: 'string', foreground: 'CE9178' },
          { token: 'number', foreground: 'B5CEA8' },
          { token: 'type', foreground: '4EC9B0' },
          { token: 'function', foreground: 'DCDCAA' },
        ],
        colors: {
          'editor.background': '#1a1a1a',
          'editor.foreground': '#e4e4e4',
          'editorLineNumber.foreground': '#6e7681',
          'editorLineNumber.activeForeground': '#c9d1d9',
          'editor.selectionBackground': '#264f78',
          'editor.lineHighlightBackground': '#161b22',
          'editorCursor.foreground': '#58a6ff',
          'editorWhitespace.foreground': '#30363d',
          'editorIndentGuide.background': '#21262d',
          'editorIndentGuide.activeBackground': '#30363d',
          'editorBracketMatch.background': '#1a472a',
          'editorBracketMatch.border': '#238636',
        },
      })
      monaco.editor.setTheme('cursor-dark')
    }
    
    // Configure editor options with VS Code-like settings
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
      fontLigatures: true,
      minimap: { 
        enabled: minimap,
        side: 'right',
        size: 'proportional',
        showSlider: 'always',
      },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: wordWrap ? 'on' : 'off',
      lineNumbers: 'on',
      lineNumbersMinChars: 3,
      roundedSelection: false,
      cursorStyle: 'line',
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      readOnly: readOnly,
      contextmenu: !readOnly,
      selectOnLineNumbers: true,
      glyphMargin: true,
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      unfoldOnClickAfterEndOfLine: false,
      lineDecorationsWidth: 10,
      acceptSuggestionOnEnter: 'on',
      quickSuggestions: {
        other: true,
        comments: false,
        strings: false,
      },
      suggestOnTriggerCharacters: true,
      suggestSelection: 'first',
      tabCompletion: 'on',
      wordBasedSuggestions: 'matchingDocuments',
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        useShadows: true,
        verticalScrollbarSize: 14,
        horizontalScrollbarSize: 14,
        arrowSize: 11,
        alwaysConsumeMouseWheel: false,
      },
            renderWhitespace: 'none',
            renderLineHighlight: 'all',
            renderIndentGuides: true,
            highlightActiveIndentGuide: true,
            matchBrackets: 'always',
      bracketPairColorization: {
        enabled: true,
      },
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true,
      },
      colorDecorators: true,
      multiCursorModifier: 'ctrlCmd',
      formatOnPaste: true,
      formatOnType: true,
      autoIndent: 'full',
      detectIndentation: false,
      trimAutoWhitespace: true,
      dragAndDrop: true,
      links: true,
      colorDecoratorsLimit: 500,
      overviewRulerBorder: false,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0,
      smoothScrolling: true,
      mouseWheelZoom: false,
      disableLayerHinting: false,
      disableMonospaceOptimizations: false,
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

  // Get file icon color based on language
  const getFileIconColor = (lang) => {
    const colors = {
      javascript: '#F7DF1E',
      python: '#3776AB',
      cpp: '#00599C',
      java: '#ED8B00',
      go: '#00ADD8',
      rust: '#000000',
      csharp: '#239120',
      typescript: '#3178C6',
    }
    return colors[lang] || '#8b949e'
  }

  // Get file extension
  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      python: 'py',
      cpp: 'cpp',
      java: 'java',
      go: 'go',
      rust: 'rs',
      csharp: 'cs',
      typescript: 'ts',
    }
    return extensions[lang] || 'js'
  }

  const isDark = theme === 'vs-dark'
  // Calculate editor height accounting for title bar and status bar
  const titleBarHeight = 60 // Approximate title bar height
  const statusBarHeight = 28 // Approximate status bar height
  const editorHeight = isFullscreen 
    ? `calc(100vh - ${titleBarHeight + statusBarHeight}px)` 
    : `calc(${height} - ${titleBarHeight + statusBarHeight}px)`

  if (!isMounted) {
    return (
      <div style={{ height }} className={`flex items-center justify-center ${isDark ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
        <div className="text-center">
          <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-2 ${isDark ? 'text-[#58a6ff]' : 'text-primary-600'}`} />
          <p className={isDark ? 'text-[#8b949e]' : 'text-gray-600'}>Initializing editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`w-full relative ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]'} ${isDark ? 'border-[#21262d]' : 'border-gray-200'} rounded-xl overflow-hidden shadow-2xl flex flex-col`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* Cursor-like Title Bar - Minimal & Clean */}
      <div 
        className={`flex items-center justify-between px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 ${isDark ? 'bg-[#161b22] border-b border-[#21262d]' : 'bg-[#f6f8fa] border-b border-gray-200'} cursor-default select-none flex-shrink-0`}
        onDoubleClick={toggleFullscreen}
        title="Double-click to toggle fullscreen"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <div className="flex items-center space-x-2.5 min-w-0 group">
            <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-all ${isDark ? 'bg-[#1a1a1a] hover:bg-[#21262d] text-[#c9d1d9]' : 'bg-white hover:bg-gray-50 text-gray-900'} cursor-pointer border ${isDark ? 'border-[#30363d]' : 'border-gray-200'}`}>
              <FileCode className={`h-4 w-4 sm:h-4.5 sm:w-4.5 flex-shrink-0 ${isDark ? 'text-[#58a6ff]' : 'text-primary-600'}`} />
              <span className={`text-sm sm:text-base font-medium truncate ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>
                {fileName}.{languageMap[language] || 'js'}
              </span>
            </div>
            <div className={`text-xs sm:text-sm px-2.5 py-1 rounded-md font-medium flex-shrink-0 ${isDark ? 'bg-[#21262d] text-[#8b949e] border border-[#30363d]' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
              <span className="hidden sm:inline">{languageMap[language]?.toUpperCase() || 'JAVASCRIPT'}</span>
              <span className="sm:hidden">{languageMap[language]?.toUpperCase().slice(0, 3) || 'JS'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          {showThemeToggle && !readOnly && (
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-md transition-all ${isDark ? 'hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5" /> : <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md transition-all ${isDark ? `hover:bg-[#21262d] ${showSettings ? 'bg-[#21262d] text-[#c9d1d9]' : 'text-[#8b949e]'} hover:text-[#c9d1d9]` : `hover:bg-gray-100 ${showSettings ? 'bg-gray-100 text-gray-700' : 'text-gray-500'} hover:text-gray-700`}`}
            title="Editor Settings"
          >
            <Settings className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-2 rounded-md transition-all ${isDark ? 'hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" /> : <Maximize2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
          </button>
        </div>
      </div>

      {/* Settings Panel - Cursor Style */}
      {showSettings && (
        <div className={`absolute top-11 sm:top-12 right-2 sm:right-3 z-30 ${isDark ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'} border rounded-lg shadow-2xl p-4 min-w-[220px] sm:min-w-[240px] md:min-w-[260px]`}>
          <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isDark ? 'border-[#21262d]' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>Editor Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className={`p-1.5 rounded-md transition-all ${isDark ? 'hover:bg-[#21262d] text-[#8b949e] hover:text-[#c9d1d9]' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className={`text-sm font-medium ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>
                  Font Size
                </label>
                <span className={`text-sm font-mono ${isDark ? 'text-[#8b949e]' : 'text-gray-500'}`}>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-[#21262d] accent-[#58a6ff]' : 'bg-gray-200 accent-primary-600'}`}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>
                Word Wrap
              </label>
              <button
                type="button"
                onClick={() => setWordWrap(!wordWrap)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  wordWrap ? (isDark ? 'bg-[#238636]' : 'bg-primary-600') : (isDark ? 'bg-[#21262d]' : 'bg-gray-300')
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${
                    wordWrap ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>
                Minimap
              </label>
              <button
                type="button"
                onClick={() => setMinimap(!minimap)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  minimap ? (isDark ? 'bg-[#238636]' : 'bg-primary-600') : (isDark ? 'bg-[#21262d]' : 'bg-gray-300')
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${
                    minimap ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Sidebar + Editor */}
      <div className="flex flex-1 overflow-hidden" style={{ height: editorHeight, minHeight: '250px' }}>
        {/* File Explorer Sidebar */}
        {sidebarExpanded && (
          <div 
            className={`flex-shrink-0 border-r ${isDark ? 'bg-[#161b22] border-[#21262d]' : 'bg-[#f6f8fa] border-gray-200'}`}
            style={{ width: `${sidebarWidth}px` }}
          >
            <div className={`px-3 py-2 border-b ${isDark ? 'border-[#21262d]' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-[#8b949e]' : 'text-gray-600'}`}>
                  Explorer
                </span>
                <button
                  onClick={() => setSidebarExpanded(false)}
                  className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-[#21262d]' : 'hover:bg-gray-200'}`}
                  title="Hide Sidebar"
                >
                  <ChevronRight className={`h-4 w-4 ${isDark ? 'text-[#8b949e]' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
            <div className="py-2 overflow-y-auto" style={{ height: `calc(${editorHeight} - 40px)` }}>
              {/* File Tree */}
              <div className="px-2">
                <div className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${isDark ? 'hover:bg-[#21262d]' : 'hover:bg-gray-100'}`}>
                  <ChevronDown className={`h-3.5 w-3.5 ${isDark ? 'text-[#8b949e]' : 'text-gray-600'}`} />
                  <Folder className={`h-4 w-4 ${isDark ? 'text-[#58a6ff]' : 'text-primary-600'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>
                    {fileName || 'Challenge'}
                  </span>
                </div>
                <div className="ml-6 mt-1">
                  <div className={`flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer ${isDark ? 'bg-[#1f6feb] bg-opacity-20' : 'bg-blue-50'} border-l-2 ${isDark ? 'border-[#1f6feb]' : 'border-primary-600'} transition-colors`}>
                    <div 
                      className="w-4 h-4 rounded flex items-center justify-center font-bold text-xs"
                      style={{ 
                        backgroundColor: getFileIconColor(language),
                        color: language === 'rust' ? '#fff' : '#000'
                      }}
                    >
                      {languageMap[language]?.charAt(0).toUpperCase() || 'J'}
                    </div>
                    <span className={`text-sm ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>
                      {fileName || 'solution'}.{getFileExtension(language)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Toggle Button (when collapsed) */}
        {!sidebarExpanded && (
          <button
            onClick={() => setSidebarExpanded(true)}
            className={`flex-shrink-0 w-6 border-r ${isDark ? 'bg-[#161b22] border-[#21262d] hover:bg-[#21262d]' : 'bg-[#f6f8fa] border-gray-200 hover:bg-gray-100'} transition-colors flex items-center justify-center`}
            title="Show Sidebar"
          >
            <ChevronRight className={`h-4 w-4 ${isDark ? 'text-[#8b949e]' : 'text-gray-600'}`} />
          </button>
        )}

        {/* Editor Container - Cursor Style */}
        <div className={`flex-1 relative ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]'} overflow-hidden`}>
          <MonacoEditor
          height="100%"
          language={languageMap[language] || 'javascript'}
          value={value ?? ''}
          onChange={handleChange}
          theme={theme}
          onMount={handleEditorDidMount}
          loading={
            <div className={`flex items-center justify-center h-full ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#ffffff]'}`}>
              <div className="text-center">
                <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-2 ${isDark ? 'text-[#58a6ff]' : 'text-primary-600'}`} />
                <p className={isDark ? 'text-[#8b949e]' : 'text-gray-600'}>Loading editor...</p>
              </div>
            </div>
          }
          options={{
            fontSize: fontSize,
            fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
            fontLigatures: true,
            minimap: { 
              enabled: minimap,
              side: 'right',
              size: 'proportional',
              showSlider: 'always',
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: wordWrap ? 'on' : 'off',
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            roundedSelection: false,
            cursorStyle: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            readOnly: readOnly,
            contextmenu: !readOnly,
            selectOnLineNumbers: true,
            glyphMargin: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEndOfLine: false,
            lineDecorationsWidth: 10,
            acceptSuggestionOnEnter: 'on',
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            suggestOnTriggerCharacters: true,
            suggestSelection: 'first',
            tabCompletion: 'on',
            wordBasedSuggestions: 'matchingDocuments',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: true,
              verticalScrollbarSize: 14,
              horizontalScrollbarSize: 14,
              arrowSize: 11,
              alwaysConsumeMouseWheel: false,
            },
            renderWhitespace: 'none',
            renderLineHighlight: 'all',
            renderIndentGuides: true,
            highlightActiveIndentGuide: true,
            matchBrackets: 'always',
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
              highlightActiveIndentation: true,
            },
            colorDecorators: true,
            multiCursorModifier: 'ctrlCmd',
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            detectIndentation: false,
            trimAutoWhitespace: true,
            dragAndDrop: true,
            links: true,
            colorDecoratorsLimit: 500,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            smoothScrolling: true,
            mouseWheelZoom: false,
            disableLayerHinting: false,
            disableMonospaceOptimizations: false,
          }}
        />
        </div>
      </div>

      {/* Cursor-like Status Bar - Minimal & Clean */}
      <div className={`flex items-center justify-between px-4 sm:px-5 md:px-6 py-2 text-xs flex-shrink-0 ${isDark ? 'bg-[#161b22] text-[#8b949e] border-t border-[#21262d]' : 'bg-[#f6f8fa] text-gray-600 border-t border-gray-200'}`}>
        <div className="flex items-center space-x-4 sm:space-x-5 min-w-0">
          <div className="flex items-center space-x-2">
            <Circle className={`h-2 w-2 fill-current flex-shrink-0 ${isDark ? 'text-[#238636]' : 'text-green-600'}`} />
            <span className={`font-medium truncate ${isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}`}>{languageMap[language]?.toUpperCase() || 'JAVASCRIPT'}</span>
          </div>
          <span className="hidden sm:inline">Spaces: 2</span>
          <span className="hidden md:inline">UTF-8</span>
          <span className="hidden lg:inline">LF</span>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-5 flex-shrink-0">
          {value && (
            <>
              <span className="hidden sm:inline">{value.split('\n').length} lines</span>
              <span className="hidden md:inline">Ln {value.split('\n').length}, Col {value.split('\n').pop().length + 1}</span>
            </>
          )}
          <span className={isDark ? 'text-[#c9d1d9]' : 'text-gray-900'}>{value ? value.length : 0} chars</span>
        </div>
      </div>
    </div>
  )
}
