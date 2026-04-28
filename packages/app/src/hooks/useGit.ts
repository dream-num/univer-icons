import { useCallback, useEffect, useState } from 'react'

export interface GitStatus {
  modified: string[]
  created: string[]
  deleted: string[]
  renamed: { from: string; to: string }[]
  staged: string[]
  not_added: string[]
  ahead: number
  behind: number
  tracking: string | null
  current: string | null
  isClean: boolean
  files: Array<{
    path: string
    index: string
    working_dir: string
  }>
}

export function useGit() {
  const [status, setStatus] = useState<GitStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [committing, setCommitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/git/status')
      if (!res.ok) throw new Error('Failed to load git status')
      const data = (await res.json()) as GitStatus
      setStatus(data)
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const commit = useCallback(
    async (message: string): Promise<{ success: boolean; error?: string }> => {
      setCommitting(true)
      setError(null)
      try {
        const res = await fetch('/api/git/commit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        })
        const data = await res.json()
        if (!res.ok || data.error) {
          throw new Error(data.error || data.details || 'Commit failed')
        }
        await fetchStatus()
        return { success: true }
      } catch (e: any) {
        setError(e.message)
        return { success: false, error: e.message }
      } finally {
        setCommitting(false)
      }
    },
    [fetchStatus]
  )

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return { status, loading, committing, error, refresh: fetchStatus, commit }
}
