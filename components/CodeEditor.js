'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Moon, Sun, Loader2 } from 'lucide-react'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }
)

export default function CodeEditor({ language, value, onChange, theme: initialTheme = 'vs-dark', height = '500px', readOnly = false, showThemeToggle = true }) {
  const editorRef = useRef(null)
  const [theme, setTheme] = useState(initialTheme)
  const [isMounted, setIsMounted] = useState(false)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    setIsMounted(true)
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
    })

    // Add keyboard shortcuts
    if (monaco) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        // Trigger submit on Ctrl/Cmd + Enter
        const submitButton = document.querySelector('button[type="button"]')
        if (submitButton && !submitButton.disabled) {
          submitButton.click()
        }
      })
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
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'vs-dark' ? 'vs' : 'vs-dark'
      return newTheme
    })
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

  return (
    <div style={{ height }} className="w-full relative bg-white">
      {showThemeToggle && !readOnly && (
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-3 right-3 z-20 bg-white border-2 border-gray-300 rounded-lg p-2.5 hover:bg-gray-50 hover:border-primary-400 transition-all shadow-lg hover:shadow-xl"
          title={theme === 'vs-dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label="Toggle theme"
        >
          {theme === 'vs-dark' ? (
            <Sun className="h-5 w-5 text-yellow-600" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </button>
      )}
      <div className="w-full h-full">
        <MonacoEditor
          key={`${theme}-${language}`}
          height="100%"
          language={languageMap[language] || 'javascript'}
          value={value || ''}
          onChange={handleChange}
          theme={theme}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-2" />
                <p className="text-gray-600">Loading editor...</p>
              </div>
            </div>
          }
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            roundedSelection: false,
            cursorStyle: 'line',
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
          }}
        />
      </div>
    </div>
  )
}

