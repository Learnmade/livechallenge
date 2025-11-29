'use client'

import { FileText, AlertCircle, CheckCircle } from 'lucide-react'

export default function ProblemDisplay({ problem }) {
  if (!problem) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-600">No problem available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-primary-50 px-6 py-4 border-b border-gray-200 flex items-center space-x-2">
        <FileText className="h-5 w-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Problem Statement</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{problem.description}</p>
        </div>

        {problem.examples && problem.examples.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Examples:</h4>
            {problem.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700">Input:</span>
                  <pre className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border border-gray-200">
                    {example.input}
                  </pre>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Output:</span>
                  <pre className="mt-1 text-sm text-gray-900 bg-white p-3 rounded border border-gray-200">
                    {example.output}
                  </pre>
                </div>
                {example.explanation && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">Explanation:</span>
                    <p className="mt-1 text-sm text-gray-600">{example.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {problem.constraints && (
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
              Constraints:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {problem.constraints.map((constraint, index) => (
                <li key={index} className="text-sm">{constraint}</li>
              ))}
          </ul>
          </div>
        )}

        {problem.note && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">{problem.note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

