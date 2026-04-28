import { useState } from 'react'
import type { GitStatus } from '../hooks/useGit'

interface Props {
  status: GitStatus | null
  loading: boolean
  committing: boolean
  onCommit: (message: string) => Promise<{ success: boolean; error?: string }>
  onRefresh: () => void
}

export default function GitPanel({ status, loading, committing, onCommit, onRefresh }: Props) {
  const [message, setMessage] = useState('')
  const [commitError, setCommitError] = useState<string | null>(null)
  const [commitSuccess, setCommitSuccess] = useState(false)

  const allFiles = [
    ...(status?.created ?? []).map((f) => ({ path: f, status: 'A' as const })),
    ...(status?.modified ?? []).map((f) => ({ path: f, status: 'M' as const })),
    ...(status?.deleted ?? []).map((f) => ({ path: f, status: 'D' as const })),
    ...(status?.not_added ?? []).map((f) => ({ path: f, status: '?' as const })),
  ]

  const hasChanges = allFiles.length > 0

  const handleCommit = async () => {
    setCommitError(null)
    setCommitSuccess(false)
    const result = await onCommit(message)
    if (result.success) {
      setCommitSuccess(true)
      setMessage('')
      setTimeout(() => setCommitSuccess(false), 3000)
    } else {
      setCommitError(result.error || 'Commit failed')
    }
  }

  return (
    <div className="bg-white border-t border-slate-200">
      <div className="px-6 py-3 flex items-center gap-4">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          Git Status
          {status && (
            <span className={['text-xs px-2 py-0.5 rounded-full', status.isClean ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'].join(' ')}>
              {status.isClean ? 'Clean' : `${allFiles.length} changes`}
            </span>
          )}
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-slate-500 hover:text-primary-600 disabled:opacity-50 flex items-center gap-1"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {!status?.isClean && hasChanges && (
        <div className="px-6 pb-4 space-y-3">
          <div className="max-h-40 overflow-y-auto border border-slate-100 rounded-md divide-y divide-slate-50">
            {allFiles.map((file) => (
              <div key={file.path} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span
                  className={[
                    'text-xs font-mono font-bold w-5 text-center',
                    file.status === 'A' ? 'text-green-600' : file.status === 'M' ? 'text-amber-600' : file.status === 'D' ? 'text-red-600' : 'text-slate-400',
                  ].join(' ')}
                >
                  {file.status}
                </span>
                <span className="text-slate-700 truncate">{file.path}</span>
              </div>
            ))}
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Commit message</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="feat: add new icons"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <button
              onClick={handleCommit}
              disabled={committing || !message.trim()}
              className="px-5 py-2 text-sm bg-slate-800 text-white rounded-md hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {committing && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Push to Remote
            </button>
          </div>

          {commitError && <p className="text-sm text-red-600">{commitError}</p>}
          {commitSuccess && <p className="text-sm text-green-600">Successfully pushed!</p>}
        </div>
      )}
    </div>
  )
}
