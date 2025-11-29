'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
)

export default function CodeEditor({ language, value, onChange, theme = 'vs-dark', height = '500px', readOnly = false }) {
  const editorRef = useRef(null)

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
    <div style={{ height }} className="w-full">
      <MonacoEditor
        height="100%"
        language={languageMap[language] || 'javascript'}
        value={value}
        onChange={onChange}
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

