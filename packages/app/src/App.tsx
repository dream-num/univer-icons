import { useMemo, useState } from 'react'
import DirectoryTree from './components/DirectoryTree'
import GitPanel from './components/GitPanel'
import IconGrid from './components/IconGrid'
import UploadPanel from './components/UploadPanel'
import { useGit } from './hooks/useGit'
import { useIcons } from './hooks/useIcons'

export default function App() {
  const { manifest, loading, error, refresh: refreshIcons } = useIcons()
  const { status, loading: gitLoading, committing, refresh: refreshGit, commit } = useGit()

  const groups = useMemo(() => (manifest ? Object.keys(manifest) : []), [manifest])
  const [activeGroup, setActiveGroup] = useState(() => groups[0] || 'single')

  // keep activeGroup valid when manifest loads
  if (groups.length > 0 && !groups.includes(activeGroup)) {
    setActiveGroup(groups[0])
  }

  const handleUploaded = () => {
    refreshIcons()
    refreshGit()
  }

  return (
    <div className='h-screen flex flex-col bg-slate-50'>
      {/* Header */}
      <header className='h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
            <svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          </div>
          <h1 className='text-base font-semibold text-slate-800'>Univer Icons Manager</h1>
        </div>
        <UploadPanel groups={groups} onUploaded={handleUploaded} />
      </header>

      {/* Main */}
      <div className='flex-1 flex overflow-hidden'>
        {loading && !manifest ? (
          <div className='flex-1 flex items-center justify-center'>
            <div className='w-8 h-8 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin' />
          </div>
        ) : error ? (
          <div className='flex-1 flex items-center justify-center text-red-600'>{error}</div>
        ) : (
          <>
            <DirectoryTree
              manifest={manifest}
              activeGroup={activeGroup}
              onSelect={setActiveGroup}
            />
            <IconGrid manifest={manifest} activeGroup={activeGroup} />
          </>
        )}
      </div>

      {/* Git Panel */}
      <GitPanel
        status={status}
        loading={gitLoading}
        committing={committing}
        onCommit={commit}
        onRefresh={refreshGit}
      />
    </div>
  )
}
