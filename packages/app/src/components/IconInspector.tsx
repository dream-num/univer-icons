import React, { useMemo } from 'react'
import type { IconEntry } from '../catalogue.ts'
import { getIconFileName, getIconManifestPath, productLabels } from '../catalogue.ts'
import { buildExportSvg, buildReactSnippet, buildVueSnippet } from '../snippets.ts'
import type { CodeFramework, DemoState } from '../state.ts'
import { defaultDemoState } from '../state.ts'
import { IconPreview } from './IconPreview.tsx'
import { CheckGlyph, CloseGlyph, CopyGlyph, DownloadGlyph } from './ui-icons.tsx'

const PREVIEW_SIZES = [16, 20, 24, 32, 48] as const

type IconInspectorProps = {
  copiedKey: string | null
  icon: IconEntry
  isRecent: boolean
  onClose: () => void
  onCopy: (key: string, text: string, label: string) => void
  onFilterByKeyword: (keyword: string) => void
  onFilterByProduct: (product: string) => void
  onSelectCodeTab: (tab: CodeFramework) => void
  state: DemoState
}

export function IconInspector({
  copiedKey,
  icon,
  isRecent,
  onClose,
  onCopy,
  onFilterByKeyword,
  onFilterByProduct,
  onSelectCodeTab,
  state,
}: IconInspectorProps) {
  const fileName = getIconFileName(icon)
  const manifestPath = getIconManifestPath(icon)
  const previewSettings = useMemo(
    () => ({
      color: state.color,
      colorChannel1: state.colorChannel1,
      preserveStrokeWidth: state.preserveStrokeWidth,
      size: state.size,
    }),
    [state.color, state.colorChannel1, state.preserveStrokeWidth, state.size],
  )

  const codeSnippet = useMemo(() => {
    if (state.codeTab === 'react') {
      return buildReactSnippet(icon, previewSettings)
    }
    if (state.codeTab === 'vue') {
      return buildVueSnippet(icon, previewSettings)
    }
    return buildExportSvg(icon, previewSettings)
  }, [icon, previewSettings, state.codeTab])

  function handleDownloadSvg() {
    const svgContent = buildExportSvg(icon, previewSettings)
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.svg`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <dialog
      aria-labelledby='inspector-title'
      aria-modal='true'
      className='fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none justify-end border-0 bg-transparent p-0'
      open
    >
      <button
        aria-label='Close inspector backdrop'
        className='fixed inset-0 cursor-default bg-zinc-950/30 backdrop-blur-[2px] transition-opacity'
        onClick={onClose}
        type='button'
      />

      <aside className='relative z-10 flex h-full w-full max-w-[460px] flex-col overflow-hidden border-l border-zinc-200 bg-white shadow-2xl'>
        {/* Header */}
        <div className='flex items-start justify-between gap-3 border-b border-zinc-200/80 px-5 py-4'>
          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2
                className='truncate font-mono text-base font-semibold text-zinc-950'
                id='inspector-title'
              >
                {icon.name}
              </h2>
              {icon.updatedVer && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    isRecent
                      ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  v{icon.updatedVer}
                </span>
              )}
            </div>
            <p className='mt-1 truncate font-mono text-xs text-zinc-500'>{manifestPath}</p>
          </div>
          <button
            aria-label='Close icon inspector'
            className='inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900'
            onClick={onClose}
            type='button'
          >
            <CloseGlyph className='h-4 w-4' />
          </button>
        </div>

        {/* Scrollable body */}
        <div className='flex-1 space-y-5 overflow-y-auto px-5 py-5'>
          {/* Dual-surface preview cards */}
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-4'>
              <span className='self-start text-[11px] font-medium text-zinc-400'>Light</span>
              <div className='flex h-20 items-center justify-center' style={{ color: state.color }}>
                <IconPreview icon={icon} size={Math.max(32, Math.min(state.size, 64))} />
              </div>
              <span className='font-mono text-[11px] text-zinc-400'>
                {state.color.toLowerCase()}
              </span>
            </div>

            <div className='flex flex-col items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4'>
              <span className='self-start text-[11px] font-medium text-zinc-500'>Dark</span>
              <div
                className='flex h-20 items-center justify-center'
                style={{
                  color:
                    state.color.toLowerCase() === defaultDemoState.color ? '#f4f4f5' : state.color,
                }}
              >
                <IconPreview icon={icon} size={Math.max(32, Math.min(state.size, 64))} />
              </div>
              <span className='font-mono text-[11px] text-zinc-500'>
                {state.color.toLowerCase() === defaultDemoState.color
                  ? '#f4f4f5'
                  : state.color.toLowerCase()}
              </span>
            </div>
          </div>

          {/* Multi-size scale strip */}
          <div className='rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3.5'>
            <div className='mb-3 flex items-center justify-between'>
              <span className='text-xs font-medium text-zinc-600'>Optical scale</span>
              <span className='text-[11px] text-zinc-400'>
                {state.preserveStrokeWidth ? 'Stroke preserved (16px base)' : 'Proportional stroke'}
              </span>
            </div>
            <div className='flex items-end justify-between gap-2 px-1'>
              {PREVIEW_SIZES.map((previewSize) => (
                <div className='flex flex-col items-center gap-2' key={previewSize}>
                  <div
                    className='flex h-12 items-center justify-center'
                    style={{ color: state.color }}
                  >
                    <IconPreview icon={icon} size={previewSize} />
                  </div>
                  <span className='font-mono text-[10px] text-zinc-400'>{previewSize}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick copy actions */}
          <div className='grid grid-cols-3 gap-2'>
            <button
              className='flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50'
              onClick={() => onCopy('name', icon.name, `Copied ${icon.name}`)}
              type='button'
            >
              {copiedKey === 'name' ? (
                <CheckGlyph className='h-3.5 w-3.5 text-emerald-600' />
              ) : (
                <CopyGlyph className='h-3.5 w-3.5 text-zinc-400' />
              )}
              <span>Name</span>
            </button>
            <button
              className='flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50'
              onClick={() => onCopy('kebab', fileName, `Copied ${fileName}`)}
              type='button'
            >
              {copiedKey === 'kebab' ? (
                <CheckGlyph className='h-3.5 w-3.5 text-emerald-600' />
              ) : (
                <CopyGlyph className='h-3.5 w-3.5 text-zinc-400' />
              )}
              <span>Filename</span>
            </button>
            <button
              className='flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-2 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50'
              onClick={handleDownloadSvg}
              type='button'
            >
              <DownloadGlyph className='h-3.5 w-3.5 text-zinc-400' />
              <span>.svg</span>
            </button>
          </div>

          {/* Code snippets */}
          <div className='overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 text-zinc-100'>
            <div className='flex items-center justify-between border-b border-zinc-800 px-3 py-2'>
              <div className='flex items-center gap-1' role='tablist'>
                {(
                  [
                    { id: 'react', label: 'React' },
                    { id: 'vue', label: 'Vue 3' },
                    { id: 'svg', label: 'SVG' },
                  ] as Array<{ id: CodeFramework; label: string }>
                ).map((tab) => (
                  <button
                    aria-selected={state.codeTab === tab.id}
                    className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      state.codeTab === tab.id
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                    key={tab.id}
                    onClick={() => onSelectCodeTab(tab.id)}
                    role='tab'
                    type='button'
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                className='inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-700 hover:text-white'
                onClick={() =>
                  onCopy('snippet', codeSnippet, `Copied ${state.codeTab.toUpperCase()} snippet`)
                }
                type='button'
              >
                {copiedKey === 'snippet' ? (
                  <>
                    <CheckGlyph className='h-3.5 w-3.5 text-emerald-400' />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyGlyph className='h-3.5 w-3.5' />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className='max-h-56 overflow-y-auto p-3.5 font-mono text-xs leading-relaxed wrap-break-word whitespace-pre-wrap text-zinc-200'>
              <code>{codeSnippet}</code>
            </pre>
          </div>

          {/* Metadata details */}
          <div className='space-y-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4'>
            {icon.description && (
              <div>
                <div className='text-[11px] font-medium text-zinc-400'>Description</div>
                <p className='mt-0.5 text-sm text-zinc-700'>{icon.description}</p>
              </div>
            )}

            <div className='grid grid-cols-2 gap-3 text-xs'>
              <div>
                <div className='text-[11px] font-medium text-zinc-400'>Color mode</div>
                <div className='mt-1 font-medium text-zinc-800 capitalize'>{icon.group}</div>
              </div>
              <div>
                <div className='text-[11px] font-medium text-zinc-400'>Stroke preservation</div>
                <div className='mt-1'>
                  {icon.preserveStrokeWidthSupport === 'full' ? (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200'>
                      <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                      Full support
                    </span>
                  ) : (
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600'>
                      Filled / fixed
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className='text-[11px] font-medium text-zinc-400'>Category</div>
                <div className='mt-1 font-medium text-zinc-800 capitalize'>{icon.category}</div>
              </div>
              <div>
                <div className='text-[11px] font-medium text-zinc-400'>Role</div>
                <div className='mt-1 font-medium text-zinc-800 capitalize'>{icon.role}</div>
              </div>
            </div>

            {icon.products.length > 0 && (
              <div>
                <div className='text-[11px] font-medium text-zinc-400'>Products</div>
                <div className='mt-1.5 flex flex-wrap gap-1.5'>
                  {icon.products.map((product) => (
                    <button
                      className='cursor-pointer rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
                      key={product}
                      onClick={() => onFilterByProduct(product)}
                      title={`Filter by ${productLabels[product] ?? product}`}
                      type='button'
                    >
                      {productLabels[product] ?? product}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(icon.keywords.length > 0 || icon.aliases.length > 0) && (
              <div>
                <div className='text-[11px] font-medium text-zinc-400'>Keywords & aliases</div>
                <div className='mt-1.5 flex flex-wrap gap-1.5'>
                  {Array.from(new Set([...icon.aliases, ...icon.keywords])).map((term) => (
                    <button
                      className='cursor-pointer rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 transition-colors hover:bg-zinc-200 hover:text-zinc-900'
                      key={term}
                      onClick={() => onFilterByKeyword(term)}
                      title={`Search "${term}"`}
                      type='button'
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </dialog>
  )
}
