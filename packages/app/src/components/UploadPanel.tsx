import { useRef, useState } from 'react'

interface Props {
  groups: string[]
  onUploaded: () => void
}

export default function UploadPanel({ groups, onUploaded }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [targetGroup, setTargetGroup] = useState(groups[0] || '')
  const [newGroup, setNewGroup] = useState('')
  const [fileName, setFileName] = useState('')
  const [content, setContent] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeGroup = newGroup.trim() || targetGroup

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.svg')) {
      setError('Only .svg files are allowed')
      return
    }
    const text = await file.text()
    if (!text.trim().toLowerCase().startsWith('<svg')) {
      setError('Invalid SVG file')
      return
    }
    setFileName(file.name)
    setContent(text)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleUpload = async () => {
    if (!activeGroup || !fileName || !content) {
      setError('Please select a file and target directory')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: activeGroup, fileName, content }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Upload failed')
      }
      setFileName('')
      setContent('')
      setNewGroup('')
      setIsOpen(false)
      onUploaded()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Upload Icon
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Upload SVG Icon</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Target Directory</label>
                <select
                  value={targetGroup}
                  onChange={(e) => {
                    setTargetGroup(e.target.value)
                    setNewGroup('')
                  }}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  {groups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-slate-500">or create new:</span>
                  <input
                    type="text"
                    value={newGroup}
                    onChange={(e) => {
                      setNewGroup(e.target.value)
                      if (e.target.value) setTargetGroup('')
                    }}
                    placeholder="new-group"
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={[
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  dragOver ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-slate-300',
                ].join(' ')}
              >
                <input ref={inputRef} type="file" accept=".svg" className="hidden" onChange={handleInputChange} />
                {fileName ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700">{fileName}</p>
                    <p className="text-xs text-slate-400">Click to replace</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="w-8 h-8 mx-auto text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <p className="text-sm text-slate-500">Drag & drop an SVG file here, or click to browse</p>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !fileName}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {uploading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Confirm Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
