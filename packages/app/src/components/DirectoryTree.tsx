import type { IconManifest } from '../hooks/useIcons'

interface Props {
  manifest: IconManifest | null
  activeGroup: string
  onSelect: (group: string) => void
}

export default function DirectoryTree({ manifest, activeGroup, onSelect }: Props) {
  if (!manifest) return null

  const groups = Object.keys(manifest)

  return (
    <div className='w-56 bg-white border-r border-slate-200 flex flex-col h-full'>
      <div className='px-4 py-3 border-b border-slate-100'>
        <h2 className='text-sm font-semibold text-slate-700'>目录</h2>
      </div>
      <div className='flex-1 overflow-y-auto p-2 space-y-1'>
        {groups.map((group) => {
          const count = manifest[group]?.length ?? 0
          const isActive = group === activeGroup
          return (
            <button
              key={group}
              onClick={() => onSelect(group)}
              className={[
                'w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              <span className='flex items-center gap-2'>
                <svg
                  className='w-4 h-4 opacity-60'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z'
                  />
                </svg>
                {group}
              </span>
              <span
                className={[
                  'text-xs px-1.5 py-0.5 rounded-full',
                  isActive ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500',
                ].join(' ')}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
