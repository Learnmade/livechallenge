'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Moon, Sun, Loader2, Maximize2, Minimize2, Settings, FileCode, X, Circle } from 'lucide-react'

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
    
    // Define VS Code-like theme colors
    if (monaco && theme === 'vs-dark') {
      monaco.editor.defineTheme('vs-code-dark', {
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
          'editor.background': '#1e1e1e',
          'editor.foreground': '#d4d4d4',
          'editorLineNumber.foreground': '#858585',
          'editorLineNumber.activeForeground': '#c6c6c6',
          'editor.selectionBackground': '#264f78',
          'editor.lineHighlightBackground': '#2a2d2e',
          'editorCursor.foreground': '#aeafad',
          'editorWhitespace.foreground': '#3b3a32',
          'editorIndentGuide.background': '#404040',
          'editorIndentGuide.activeBackground': '#707070',
        },
      })
      monaco.editor.setTheme('vs-code-dark')
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
      renderWhitespace: 'selection',
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
      className={`w-full relative ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} border ${isDark ? 'border-[#3e3e42]' : 'border-gray-200'} rounded-lg overflow-hidden shadow-2xl`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* VS Code-like Title Bar */}
      <div className={`flex items-center justify-between px-3 sm:px-4 py-2.5 ${isDark ? 'bg-[#2d2d30] border-b border-[#3e3e42]' : 'bg-[#f3f3f3] border-b border-gray-200'}`}>
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="flex items-center space-x-2 min-w-0 group">
            <div className={`flex items-center space-x-1.5 sm:space-x-2 px-2 py-1 rounded ${isDark ? 'bg-[#1e1e1e] hover:bg-[#252526]' : 'bg-white hover:bg-gray-50'} transition-colors cursor-default`}>
              <FileCode className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 ${isDark ? 'text-[#858585]' : 'text-gray-500'}`} />
              <span className={`text-xs sm:text-sm font-medium truncate ${isDark ? 'text-[#cccccc]' : 'text-gray-800'}`}>
                {fileName}.{languageMap[language] || 'js'}
              </span>
            </div>
            <div className={`text-[10px] sm:text-xs px-2 py-0.5 rounded font-semibold flex-shrink-0 ${isDark ? 'bg-[#1e1e1e] text-[#858585] border border-[#3e3e42]' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
              <span className="hidden sm:inline">{languageMap[language]?.toUpperCase() || 'JAVASCRIPT'}</span>
              <span className="sm:hidden">{languageMap[language]?.toUpperCase().slice(0, 3) || 'JS'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
          {showThemeToggle && !readOnly && (
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-1.5 sm:p-2 rounded-md transition-all ${isDark ? 'hover:bg-[#3e3e42] text-[#cccccc] hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
              title={isDark ? 'Switch to Light Theme (Ctrl+K Ctrl+T)' : 'Switch to Dark Theme (Ctrl+K Ctrl+T)'}
            >
              {isDark ? <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 sm:p-2 rounded-md transition-all ${isDark ? 'hover:bg-[#3e3e42] text-[#cccccc] hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
            title="Editor Settings"
          >
            <Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className={`p-1.5 sm:p-2 rounded-md transition-all ${isDark ? 'hover:bg-[#3e3e42] text-[#cccccc] hover:text-white' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`absolute top-12 right-2 z-30 ${isDark ? 'bg-[#252526] border-[#3e3e42]' : 'bg-white border-gray-200'} border rounded-md shadow-2xl p-4 min-w-[220px] sm:min-w-[240px]`}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <h3 className={`text-sm font-semibold ${isDark ? 'text-[#cccccc]' : 'text-gray-800'}`}>Editor Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className={`p-1 rounded hover:bg-opacity-20 ${isDark ? 'hover:bg-white text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`text-xs font-medium ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                  Font Size
                </label>
                <span className={`text-xs font-mono ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>{fontSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#007acc]"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className={`text-xs font-medium ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                Word Wrap
              </label>
              <button
                type="button"
                onClick={() => setWordWrap(!wordWrap)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  wordWrap ? (isDark ? 'bg-[#007acc]' : 'bg-primary-600') : (isDark ? 'bg-[#3e3e42]' : 'bg-gray-300')
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                    wordWrap ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label className={`text-xs font-medium ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
                Minimap
              </label>
              <button
                type="button"
                onClick={() => setMinimap(!minimap)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  minimap ? (isDark ? 'bg-[#007acc]' : 'bg-primary-600') : (isDark ? 'bg-[#3e3e42]' : 'bg-gray-300')
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
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
            renderWhitespace: 'selection',
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

      {/* VS Code-like Status Bar */}
      <div className={`flex items-center justify-between px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs ${isDark ? 'bg-[#007acc] text-white' : 'bg-[#0078d4] text-white'} border-t ${isDark ? 'border-[#005a9e]' : 'border-[#005a9e]'}`}>
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <div className="flex items-center space-x-1.5">
            <Circle className="h-2 w-2 fill-current" />
            <span className="font-medium truncate">{languageMap[language]?.toUpperCase() || 'JAVASCRIPT'}</span>
          </div>
          <span className="hidden sm:inline opacity-90">Spaces: 2</span>
          <span className="hidden md:inline opacity-90">UTF-8</span>
          <span className="hidden lg:inline opacity-90">LF</span>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
          {value && (
            <>
              <span className="hidden sm:inline opacity-90">Ln {value.split('\n').length}, Col {value.split('\n').pop().length + 1}</span>
              <span className="hidden md:inline opacity-90">{value.split('\n').length} lines</span>
            </>
          )}
          <span className="opacity-90">{value ? value.length : 0} chars</span>
        </div>
      </div>
    </div>
  )
}
