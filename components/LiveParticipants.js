'use client'

import { Users, Clock } from 'lucide-react'

export default function LiveParticipants({ participants = [] }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden sticky top-20">
      <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Live Participants ({participants.length})
        </h2>
      </div>
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {participants.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No active participants</p>
          </div>
        ) : (
          <div className="space-y-2">
            {participants.map((participant, index) => (
              <div
                key={participant.userId || index}
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {participant.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{participant.name}</p>
                    {participant.status && (
                      <p className="text-xs text-gray-400">
                        {participant.status === 'solving' && 'Solving...'}
                        {participant.status === 'submitted' && 'Submitted'}
                      </p>
                    )}
                  </div>
                </div>
                {participant.lastActive && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{participant.lastActive}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

