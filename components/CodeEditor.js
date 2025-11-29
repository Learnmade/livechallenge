'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Moon, Sun } from 'lucide-react'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
)

export default function CodeEditor({ language, value, onChange, theme: initialTheme = 'vs-dark', height = '500px', readOnly = false, showThemeToggle = true }) {
  const editorRef = useRef(null)
  const [theme, setTheme] = useState(initialTheme)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
    
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
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Trigger submit on Ctrl/Cmd + Enter
      const submitButton = document.querySelector('button[type="button"]')
      if (submitButton && !submitButton.disabled) {
        submitButton.click()
      }
    })
  }

  const handleChange = (newValue) => {
    if (onChange) {
      onChange(newValue || '')
    }
  }

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'vs-dark' ? 'vs' : 'vs-dark')
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
    <div style={{ height }} className="w-full relative">
      {showThemeToggle && !readOnly && (
        <button
          onClick={toggleTheme}
          className="absolute top-3 right-3 z-10 bg-white border-2 border-gray-300 rounded-lg p-2.5 hover:bg-gray-50 hover:border-primary-400 transition-all shadow-lg hover:shadow-xl"
          title={theme === 'vs-dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {theme === 'vs-dark' ? (
            <Sun className="h-5 w-5 text-yellow-600" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </button>
      )}
      <MonacoEditor
        height="100%"
        language={languageMap[language] || 'javascript'}
        value={value || ''}
        onChange={handleChange}
        theme={theme}
        onMount={handleEditorDidMount}
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
        }}
      />
    </div>
  )
}

