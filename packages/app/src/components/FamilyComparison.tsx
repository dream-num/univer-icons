import React from 'react'
import type { IconEntry, IconGroup } from '../catalogue.ts'
import { comparisonFamilies, getFamilyIcons } from '../catalogue.ts'
import { IconPreview } from './IconPreview.tsx'
import { CrosshairGlyph } from './ui-icons.tsx'

const COMPARISON_SIZES = [16, 20, 24, 32] as const

type FamilyComparisonProps = {
  familyId: string
  groups: IconGroup[]
  onFamilyChange: (id: string) => void
  onSelectIcon: (icon: IconEntry) => void
  onToggleGuides: () => void
  preserveStrokeWidth: boolean
  showGuides: boolean
}

export function FamilyComparison({
  familyId,
  groups,
  onFamilyChange,
  onSelectIcon,
  onToggleGuides,
  preserveStrokeWidth,
  showGuides,
}: FamilyComparisonProps) {
  const family = comparisonFamilies.find((item) => item.id === familyId) ?? comparisonFamilies[0]
  const icons = getFamilyIcons(groups, family.icons)

  return (
    <section aria-labelledby='family-comparison-title' className='space-y-5'>
      {/* Header + quick family pills */}
      <div className='rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2'>
              <h2
                className='text-lg font-semibold tracking-tight text-zinc-950'
                id='family-comparison-title'
              >
                Compare families
              </h2>
              <span className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums'>
                {icons.length} icons
              </span>
            </div>
            <p className='mt-1 max-w-2xl text-sm text-zinc-500'>
              Verify optical weight, spacing, centering, and clipping at 16–32 px on standard light
              and dark surfaces. Independent of catalogue search, size, and color; stroke width
              preservation applies here too.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <button
              aria-pressed={showGuides}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                showGuides
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
              onClick={onToggleGuides}
              title='Show 1em bounding box guides around each icon'
              type='button'
            >
              <CrosshairGlyph className='h-3.5 w-3.5' />
              <span>Bounds guides</span>
            </button>
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                preserveStrokeWidth
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-500'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  preserveStrokeWidth ? 'bg-emerald-500' : 'bg-zinc-300'
                }`}
              />
              Stroke preserve: {preserveStrokeWidth ? 'On' : 'Off'}
            </span>
          </div>
        </div>

        {/* One-click family pills */}
        <fieldset
          aria-label='Icon families'
          className='mt-4 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-4'
        >
          {comparisonFamilies.map((item) => {
            const selected = item.id === family.id
            return (
              <button
                aria-pressed={selected}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selected
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
                }`}
                key={item.id}
                onClick={() => onFamilyChange(item.id)}
                type='button'
              >
                <span>{item.title}</span>
                <span
                  className={`text-[10px] tabular-nums ${
                    selected ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                >
                  {item.icons.length}
                </span>
              </button>
            )
          })}
        </fieldset>
      </div>

      {/* Light & Dark comparison matrices */}
      <div className='grid gap-4 xl:grid-cols-2'>
        {(['Light', 'Dark'] as const).map((theme) => {
          const isLight = theme === 'Light'
          return (
            <section
              aria-label={`${theme} ${family.title} comparison`}
              className={`min-w-0 overflow-x-auto rounded-2xl border p-5 shadow-xs ${
                isLight
                  ? 'border-zinc-200/80 bg-white text-[#18181b]'
                  : 'border-zinc-800 bg-[#181b20] text-[#f4f4f5]'
              }`}
              key={theme}
            >
              <table
                className='w-full table-fixed border-collapse text-center'
                style={{ minWidth: 64 + icons.length * 96 }}
              >
                <caption className='pb-4 text-left text-sm font-semibold'>
                  <span className='inline-flex items-center gap-2'>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isLight ? 'bg-amber-400' : 'bg-indigo-400'
                      }`}
                    />
                    {theme} · {family.title}
                  </span>
                </caption>
                <thead>
                  <tr>
                    <th
                      className={`w-14 pb-3 text-left text-[11px] font-medium ${
                        isLight ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                      scope='col'
                    >
                      Size
                    </th>
                    {icons.map((icon) => (
                      <th
                        className={`px-1 pb-3 font-mono text-[10px] font-medium wrap-anywhere ${
                          isLight ? 'text-zinc-500' : 'text-zinc-400'
                        }`}
                        key={icon.name}
                        scope='col'
                      >
                        {icon.name.replace(/Icon$/, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_SIZES.map((size) => (
                    <tr
                      className={`border-t ${isLight ? 'border-zinc-100' : 'border-zinc-800'}`}
                      key={size}
                    >
                      <th
                        className={`py-4 text-left font-mono text-[11px] font-medium ${
                          isLight ? 'text-zinc-400' : 'text-zinc-500'
                        }`}
                        scope='row'
                      >
                        {size}px
                      </th>
                      {icons.map((icon) => (
                        <td className='py-3 align-middle' key={icon.name}>
                          <button
                            aria-label={`Inspect ${icon.name} at ${size}px on ${theme} background`}
                            className={`inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors ${
                              isLight ? 'hover:bg-zinc-100' : 'hover:bg-white/10'
                            }`}
                            onClick={() => onSelectIcon(icon)}
                            title={`Inspect ${icon.name}`}
                            type='button'
                          >
                            <span
                              className={
                                showGuides
                                  ? isLight
                                    ? 'inline-flex ring-1 ring-indigo-500/40'
                                    : 'inline-flex ring-1 ring-indigo-400/50'
                                  : 'inline-flex'
                              }
                            >
                              <IconPreview icon={icon} size={size} />
                            </span>
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )
        })}
      </div>
    </section>
  )
}
