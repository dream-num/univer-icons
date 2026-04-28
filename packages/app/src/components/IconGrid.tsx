import { useState } from 'react'
import type { IconMeta, IconManifest } from '../hooks/useIcons'
import { useIconContent } from '../hooks/useIcons'

function IconCard({ icon }: { icon: IconMeta }) {
  const { content, loading } = useIconContent(icon.group, icon.name)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className='group relative bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow flex flex-col items-center gap-3'>
      <div className='w-12 h-12 flex items-center justify-center text-slate-700'>
        {loading ? (
          <div className='w-6 h-6 border-2 border-slate-200 border-t-primary-500 rounded-full animate-spin' />
        ) : content ? (
          <div
            className='w-full h-full [&_svg]:w-full [&_svg]:h-full'
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <span className='text-xs text-slate-400'>Error</span>
        )}
      </div>
      <div className='text-center'>
        <p className='text-xs text-slate-700 font-medium truncate max-w-[140px]' title={icon.name}>
          {icon.name}
        </p>
        <p className='text-[10px] text-slate-400 mt-0.5'>{icon.componentName}</p>
      </div>
      {content && (
        <button
          onClick={handleCopy}
          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-slate-100 text-slate-500'
          title='Copy SVG'
        >
          {copied ? (
            <svg
              className='w-3.5 h-3.5 text-green-600'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
          ) : (
            <svg
              className='w-3.5 h-3.5'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
              <path d='M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1' />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}

interface Props {
  manifest: IconManifest | null
  activeGroup: string
}

export default function IconGrid({ manifest, activeGroup }: Props) {
  const icons = manifest?.[activeGroup] ?? []
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? icons.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()))
    : icons

  return (
    <div className='flex-1 flex flex-col h-full overflow-hidden'>
      <div className='px-6 py-4 border-b border-slate-200 bg-white flex items-center gap-4'>
        <h1 className='text-lg font-semibold text-slate-800 capitalize'>{activeGroup}</h1>
        <span className='text-sm text-slate-400'>{icons.length} icons</span>
        <div className='ml-auto relative'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search icons...'
            className='pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-300 w-56'
          />
          <svg
            className='w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='M21 21l-4.35-4.35' />
          </svg>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto p-6'>
        {filtered.length === 0 ? (
          <div className='text-center text-slate-400 py-20'>
            <p>No icons found</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {filtered.map((icon) => (
              <IconCard key={icon.name} icon={icon} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
