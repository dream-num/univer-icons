import { useCallback, useEffect, useState } from 'react'

export interface IconMeta {
  name: string
  componentName: string
  group: string
  path: string
}

export type IconManifest = Record<string, IconMeta[]>

export function useIcons() {
  const [manifest, setManifest] = useState<IconManifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIcons = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/icons')
      if (!res.ok) throw new Error('Failed to load icons')
      const data = (await res.json()) as IconManifest
      setManifest(data)
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIcons()
  }, [fetchIcons])

  return { manifest, loading, error, refresh: fetchIcons }
}

export function useIconContent(group: string, name: string) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!group || !name) return
    setLoading(true)
    fetch(`/api/icons/${group}/${name}`)
      .then((r) => r.text())
      .then((text) => {
        setContent(text)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [group, name])

  return { content, loading }
}
