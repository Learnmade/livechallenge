'use client'

import { FileText, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'
import Badge from './ui/Badge'

export default function ProblemDisplay({ problem }) {
  if (!problem) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center border-dashed border-2 border-white/20">
        <p className="text-gray-400">No problem selected.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-[#030712] rounded-xl border border-white/10 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#0B1121] px-6 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
            <FileText className="h-5 w-5 text-primary-400" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Problem Statement</h2>
        </div>
        {problem.difficulty && (
          <Badge variant={
            problem.difficulty === 'easy' ? 'success' :
              problem.difficulty === 'medium' ? 'warning' : 'primary'
          } size="sm">
            {problem.difficulty}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6 md:space-y-8 overflow-y-auto flex-1 custom-scrollbar">
        {/* Title & Description */}
        <div className="prose prose-invert max-w-none">
          <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            {problem.title}
            <span className="text-sm font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-md border border-white/10">
              #{problem.challengeNumber || 1}
            </span>
          </h1>
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
            {problem.description}
          </div>
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" /> Examples
            </h3>
            <div className="grid gap-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    <div className="p-4">
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Input</span>
                      <code className="text-blue-300 font-mono text-sm bg-blue-500/10 px-2 py-1 rounded">
                        {example.input}
                      </code>
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Output</span>
                      <code className="text-green-300 font-mono text-sm bg-green-500/10 px-2 py-1 rounded">
                        {example.output}
                      </code>
                    </div>
                  </div>
                  {example.explanation && (
                    <div className="px-4 py-3 bg-white/5 border-t border-white/10">
                      <p className="text-sm text-gray-400 italic">
                        <span className="font-semibold text-gray-300 not-italic">Explanation: </span>
                        {example.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary-400" /> Constraints
            </h3>
            <ul className="grid gap-2">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-300 bg-white/5 px-4 py-3 rounded-lg border border-white/5">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

