import type { CSSProperties } from 'react'
import React, {
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createRoot } from 'react-dom/client'
import type { IconEntry, IconGroup, IconSubgroup } from './catalogue.ts'
import {
  filterIconCatalogue,
  getAllIcons,
  getAvailableProducts,
  getCatalogueFacetCounts,
  getGroupIconCount,
  getRecentIconVersions,
  getTotalIconCount,
  groupMeta,
  isRecentIconVersion,
  productLabels,
  subgroupMeta,
} from './catalogue.ts'
import { FamilyComparison } from './components/FamilyComparison.tsx'
import { FilterSidebar } from './components/FilterSidebar.tsx'
import { IconInspector } from './components/IconInspector.tsx'
import { IconPreview } from './components/IconPreview.tsx'
import {
  CheckGlyph,
  CloseGlyph,
  ColumnsGlyph,
  CopyGlyph,
  GridGlyph,
  LayoutGridGlyph,
  MoonGlyph,
  RotateCcwGlyph,
  SearchGlyph,
  SlidersGlyph,
  SunGlyph,
} from './components/ui-icons.tsx'
import { createPreserveStrokeWidthCapture } from './preserve-stroke-width.ts'
import type { DemoState, SurfaceMode } from './state.ts'
import {
  countActiveFilters,
  defaultDemoState,
  hasActiveFilters,
  hasCustomPreviewSettings,
  loadDemoState,
  MAX_ICON_SIZE,
  MIN_ICON_SIZE,
  resetFilters,
  resetPreviewSettings,
  saveDemoState,
  syncDemoStateToUrl,
} from './state.ts'
import { createSvgIconGroups } from './svg-catalogue.ts'

const svgModules = import.meta.glob('../../svg/{double,other,single}/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const SIZE_PRESETS = [16, 20, 24, 32, 48] as const
const COLOR_PRESETS = ['#18181b', '#274fee', '#059669', '#e11d48', '#d97706'] as const
const CHANNEL_1_PRESETS = ['#facc15', '#38bdf8', '#fb7185', '#34d399', '#a78bfa'] as const

const groups = createSvgIconGroups(svgModules)
const allIcons = getAllIcons(groups)
const iconByName = new Map(allIcons.map((icon) => [icon.name, icon] as const))
const validIconNames = new Set(iconByName.keys())
const availableProducts = getAvailableProducts(groups)
const validProducts = new Set(availableProducts)
const totalCount = getTotalIconCount(groups)
const recentVersionList = getRecentIconVersions(groups, 3)
const recentVersions = new Set(recentVersionList)

const rootElement = document.querySelector<HTMLElement>('#app')
if (!rootElement) {
  throw new Error('Missing #app root')
}

const root: HTMLElement = rootElement
createRoot(root).render(<DemoShell />)

function getSafeLocalStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function DemoShell() {
  const [state, setState] = useState<DemoState>(() =>
    loadDemoState(window.location.search, getSafeLocalStorage(), {
      validIconNames,
      validProducts,
    }),
  )
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const toastTimerRef = useRef<number | null>(null)

  const deferredSearchTerm = useDeferredValue(state.searchTerm)

  const activeFilterOptions = useMemo(
    () => ({
      group: state.group,
      product: state.product,
      recentOnly: state.recentOnly,
      searchTerm: deferredSearchTerm,
      strokeSupport: state.strokeSupport,
      subgroup: state.subgroup,
    }),
    [
      deferredSearchTerm,
      state.group,
      state.product,
      state.recentOnly,
      state.strokeSupport,
      state.subgroup,
    ],
  )

  const searchResult = useMemo(
    () => filterIconCatalogue(groups, activeFilterOptions, recentVersions),
    [activeFilterOptions],
  )

  const facets = useMemo(
    () => getCatalogueFacetCounts(groups, activeFilterOptions, recentVersions),
    [activeFilterOptions],
  )

  const selectedIcon = state.selectedIcon ? (iconByName.get(state.selectedIcon) ?? null) : null
  const activeFilterCount = countActiveFilters(state)
  const isPreviewCustomized = hasCustomPreviewSettings(state)

  // Persist every config/filter change to both localStorage and URL query params.
  useEffect(() => {
    saveDemoState(state, getSafeLocalStorage())
    syncDemoStateToUrl(state)
  }, [state])

  // Keyboard shortcuts: / or Cmd/Ctrl+K focuses search; Escape closes overlays.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable

      if (event.key === 'Escape') {
        if (state.selectedIcon) {
          setState((prev) => ({ ...prev, selectedIcon: null }))
          return
        }
        if (mobileFiltersOpen) {
          setMobileFiltersOpen(false)
        }
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setState((prev) => (prev.view === 'catalogue' ? prev : { ...prev, view: 'catalogue' }))
        requestAnimationFrame(() => {
          searchInputRef.current?.focus()
          searchInputRef.current?.select()
        })
        return
      }

      if (event.key === '/' && !isEditable && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        setState((prev) => (prev.view === 'catalogue' ? prev : { ...prev, view: 'catalogue' }))
        requestAnimationFrame(() => {
          searchInputRef.current?.focus()
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileFiltersOpen, state.selectedIcon])

  useEffect(
    () => () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current)
      }
    },
    [],
  )

  // Apply preserveStrokeWidth exclusively to rendered Univer icon previews.
  useLayoutEffect(() => {
    if (!state.preserveStrokeWidth) {
      return
    }

    const capture = createPreserveStrokeWidthCapture()
    root.querySelectorAll('[data-icon-preview]').forEach((previewNode) => {
      capture.capture(previewNode)
    })
    return () => capture.restore()
  }, [
    state.preserveStrokeWidth,
    state.view,
    state.familyId,
    searchResult.groups,
    selectedIcon?.name,
  ])

  function updateState(patch: Partial<DemoState>) {
    setState((prev) => ({ ...prev, ...patch }))
  }

  function showToast(message: string, key?: string) {
    setToastMessage(message)
    if (key) {
      setCopiedKey(key)
    }
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null)
      setCopiedKey(null)
    }, 1800)
  }

  function handleCopy(key: string, text: string, label: string) {
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(text).then(
        () => showToast(label, key),
        () => fallbackCopy(text, label, key),
      )
      return
    }
    fallbackCopy(text, label, key)
  }

  function fallbackCopy(text: string, label: string, key: string) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      showToast(label, key)
    } finally {
      textarea.remove()
    }
  }

  const effectiveCatalogueColor =
    state.surface === 'dark' && state.color.toLowerCase() === defaultDemoState.color
      ? '#f4f4f5'
      : state.color

  const demoStyle = {
    '--icon-color': effectiveCatalogueColor,
    '--icon-color-channel-1': state.colorChannel1,
    '--icon-size': `${state.size}px`,
  } as CSSProperties

  return (
    <div className='min-h-screen bg-zinc-50 text-zinc-950' style={demoStyle}>
      {/* Top navigation bar */}
      <header className='sticky top-0 z-30 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md'>
        <div className='mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6'>
          {/* Brand */}
          <div className='flex min-w-0 items-center gap-2.5'>
            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-xs font-bold text-white shadow-xs'>
              U
            </div>
            <div className='flex min-w-0 items-baseline gap-2'>
              <span className='truncate text-sm font-semibold tracking-tight text-zinc-950'>
                Univer Icons
              </span>
              <span className='hidden rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500 tabular-nums sm:inline-flex'>
                {totalCount} icons
              </span>
            </div>
          </div>

          {/* Center view switcher */}
          <nav
            aria-label='Workspace view'
            className='inline-flex items-center rounded-lg border border-zinc-200/80 bg-zinc-100/80 p-0.5'
          >
            <button
              aria-current={state.view === 'catalogue' ? 'page' : undefined}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                state.view === 'catalogue'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              onClick={() => updateState({ view: 'catalogue' })}
              type='button'
            >
              <LayoutGridGlyph className='h-3.5 w-3.5' />
              <span>Catalogue</span>
            </button>
            <button
              aria-current={state.view === 'compare' ? 'page' : undefined}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                state.view === 'compare'
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
              onClick={() => updateState({ view: 'compare' })}
              type='button'
            >
              <ColumnsGlyph className='h-3.5 w-3.5' />
              <span>Compare families</span>
            </button>
          </nav>

          {/* Right surface switcher */}
          <div className='flex items-center gap-2'>
            {state.view === 'catalogue' && (
              <div
                aria-label='Icon card surface'
                className='hidden items-center rounded-lg border border-zinc-200/80 bg-zinc-100/80 p-0.5 sm:inline-flex'
                role='group'
              >
                {(
                  [
                    { id: 'light', icon: <SunGlyph />, label: 'Light surface' },
                    { id: 'grid', icon: <GridGlyph />, label: 'Grid surface' },
                    { id: 'dark', icon: <MoonGlyph />, label: 'Dark surface' },
                  ] as Array<{ icon: React.ReactNode; id: SurfaceMode; label: string }>
                ).map((mode) => (
                  <button
                    aria-label={mode.label}
                    aria-pressed={state.surface === mode.id}
                    className={`inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all ${
                      state.surface === mode.id
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                    key={mode.id}
                    onClick={() => updateState({ surface: mode.id })}
                    title={mode.label}
                    type='button'
                  >
                    {mode.icon}
                  </button>
                ))}
              </div>
            )}
            <a
              className='hidden rounded-lg border border-zinc-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-950 md:inline-flex'
              href='https://github.com/dream-num/univer-icons'
              rel='noreferrer'
              target='_blank'
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Sticky Studio Control Bar */}
      <section
        aria-label='Icon preview controls'
        className='sticky top-14 z-20 border-b border-zinc-200/80 bg-white/95 backdrop-blur-md'
      >
        <div className='mx-auto max-w-[1440px] px-4 py-2.5 sm:px-6'>
          <div className='flex flex-wrap items-center gap-2.5'>
            {state.view === 'catalogue' && (
              <>
                {/* Search input */}
                <div className='relative min-w-[220px] flex-1'>
                  <SearchGlyph className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400' />
                  <input
                    aria-label='Search icons'
                    autoCapitalize='none'
                    autoComplete='off'
                    className='h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50/70 pr-24 pl-9 text-sm text-zinc-950 transition-colors placeholder:text-zinc-400 hover:border-zinc-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 focus:outline-none'
                    onChange={(event) => updateState({ searchTerm: event.currentTarget.value })}
                    placeholder='Search 721 icons by name, keyword, Chinese...'
                    ref={searchInputRef}
                    spellCheck={false}
                    type='text'
                    value={state.searchTerm}
                  />
                  <div className='absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1.5'>
                    {state.searchTerm && (
                      <button
                        aria-label='Clear search'
                        className='inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-200/70 hover:text-zinc-700'
                        onClick={() => updateState({ searchTerm: '' })}
                        type='button'
                      >
                        <CloseGlyph className='h-3 w-3' />
                      </button>
                    )}
                    <span className='rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-zinc-500 tabular-nums'>
                      {searchResult.matchCount}/{totalCount}
                    </span>
                    {!state.searchTerm && (
                      <kbd className='hidden rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline-block'>
                        /
                      </kbd>
                    )}
                  </div>
                </div>

                {/* Mobile filter drawer trigger */}
                <button
                  className='inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 lg:hidden'
                  onClick={() => setMobileFiltersOpen(true)}
                  type='button'
                >
                  <SlidersGlyph className='h-3.5 w-3.5' />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className='inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-semibold text-white'>
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className='hidden h-5 w-px bg-zinc-200 xl:block' />

                {/* Size selector */}
                <SizeControl onChange={(size) => updateState({ size })} value={state.size} />

                {/* Color controls */}
                <ColorControl
                  label='Color'
                  onChange={(color) => updateState({ color })}
                  presets={COLOR_PRESETS}
                  value={state.color}
                />
                <ColorControl
                  label='Channel 1'
                  onChange={(colorChannel1) => updateState({ colorChannel1 })}
                  presets={CHANNEL_1_PRESETS}
                  value={state.colorChannel1}
                />
              </>
            )}

            {state.view === 'compare' && (
              <p className='mr-auto text-xs text-zinc-500'>
                Comparing families at 16 / 20 / 24 / 32 px on standard Light & Dark palettes.
              </p>
            )}

            {/* Preserve stroke width switch (shared across both views) */}
            <PreserveStrokeWidthControl
              checked={state.preserveStrokeWidth}
              onCheckedChange={(preserveStrokeWidth) => updateState({ preserveStrokeWidth })}
            />

            {/* Reset preview settings */}
            <button
              className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors ${
                isPreviewCustomized
                  ? 'border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-800'
              }`}
              onClick={() => setState((prev) => resetPreviewSettings(prev))}
              title='Reset size, colors, surface, and preserveStrokeWidth to defaults'
              type='button'
            >
              <RotateCcwGlyph className='h-3.5 w-3.5' />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className='mx-auto max-w-[1440px] px-4 py-6 sm:px-6'>
        {state.view === 'compare' ? (
          <FamilyComparison
            familyId={state.familyId}
            groups={groups}
            onFamilyChange={(familyId) => updateState({ familyId })}
            onSelectIcon={(icon) => updateState({ selectedIcon: icon.name })}
            onToggleGuides={() => updateState({ showGuides: !state.showGuides })}
            preserveStrokeWidth={state.preserveStrokeWidth}
            showGuides={state.showGuides}
          />
        ) : (
          <div className='flex items-start gap-7'>
            {/* Desktop Filter Rail */}
            <aside
              aria-label='Filter icons'
              className='sticky top-[128px] hidden max-h-[calc(100vh-152px)] w-[224px] shrink-0 overflow-y-auto pr-2 lg:block'
            >
              <FilterSidebar
                availableProducts={availableProducts}
                facets={facets}
                onClearFilters={() => setState((prev) => resetFilters(prev))}
                onUpdate={updateState}
                recentVersionList={recentVersionList}
                state={state}
              />
            </aside>

            {/* Catalogue Content */}
            <div className='min-w-0 flex-1 space-y-6'>
              {/* Legend & active filter pills */}
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <ActiveFilterPills
                  onClearAll={() => setState((prev) => resetFilters(prev))}
                  onUpdate={updateState}
                  state={state}
                />
                <div className='ml-auto flex flex-wrap items-center gap-3 text-xs text-zinc-500'>
                  <span className='inline-flex items-center gap-1.5'>
                    <span className='h-2 w-2 rounded-full bg-emerald-500' />
                    Supports{' '}
                    <code className='font-mono text-[11px] text-zinc-700'>preserveStrokeWidth</code>
                  </span>
                  <span className='hidden text-zinc-300 sm:inline'>·</span>
                  <span className='hidden sm:inline'>Click any icon to inspect & copy code</span>
                </div>
              </div>

              {/* Icon groups */}
              {searchResult.groups.length === 0 ? (
                <EmptyState
                  onClearFilters={() => setState((prev) => resetFilters(prev))}
                  searchTerm={state.searchTerm}
                />
              ) : (
                <div className='space-y-9'>
                  {searchResult.groups.map((group) => (
                    <IconGroupSection
                      copiedKey={copiedKey}
                      group={group}
                      key={group.id}
                      onCopy={handleCopy}
                      onSelectIcon={(icon) => updateState({ selectedIcon: icon.name })}
                      selectedIconName={state.selectedIcon}
                      size={state.size}
                      surface={state.surface}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          aria-label='Filter icons'
          aria-modal='true'
          className='fixed inset-0 z-50 flex lg:hidden'
          role='dialog'
        >
          <button
            aria-label='Close filter drawer'
            className='fixed inset-0 bg-zinc-950/35 backdrop-blur-[2px]'
            onClick={() => setMobileFiltersOpen(false)}
            type='button'
          />
          <aside className='relative z-10 h-full w-72 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-2xl'>
            <FilterSidebar
              availableProducts={availableProducts}
              facets={facets}
              onClearFilters={() => setState((prev) => resetFilters(prev))}
              onCloseMobile={() => setMobileFiltersOpen(false)}
              onUpdate={(patch) => updateState(patch)}
              recentVersionList={recentVersionList}
              state={state}
            />
          </aside>
        </div>
      )}

      {/* Icon Inspector Drawer */}
      {selectedIcon && (
        <IconInspector
          copiedKey={copiedKey}
          icon={selectedIcon}
          isRecent={isRecentIconVersion(selectedIcon, recentVersions)}
          onClose={() => updateState({ selectedIcon: null })}
          onCopy={handleCopy}
          onFilterByKeyword={(keyword) =>
            updateState({
              searchTerm: keyword,
              selectedIcon: null,
              view: 'catalogue',
            })
          }
          onFilterByProduct={(product) =>
            updateState({
              product,
              selectedIcon: null,
              view: 'catalogue',
            })
          }
          onSelectCodeTab={(codeTab) => updateState({ codeTab })}
          state={state}
        />
      )}

      {/* Floating Copy Toast */}
      {toastMessage && (
        <div
          aria-live='polite'
          className='fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-xl bg-zinc-950 px-3.5 py-2.5 text-xs font-medium text-white shadow-lg ring-1 ring-white/10'
          role='status'
        >
          <CheckGlyph className='h-3.5 w-3.5 text-emerald-400' />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

function SizeControl({ onChange, value }: { onChange: (value: number) => void; value: number }) {
  return (
    <div className='flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5'>
      <span className='text-[11px] font-medium text-zinc-500'>Size</span>
      <div className='hidden items-center gap-0.5 2xl:flex'>
        {SIZE_PRESETS.map((preset) => (
          <button
            className={`cursor-pointer rounded px-1.5 py-0.5 font-mono text-[11px] transition-colors ${
              value === preset
                ? 'bg-zinc-900 font-semibold text-white'
                : 'text-zinc-500 hover:bg-zinc-200/70 hover:text-zinc-900'
            }`}
            key={preset}
            onClick={() => onChange(preset)}
            type='button'
          >
            {preset}
          </button>
        ))}
      </div>
      <input
        aria-label='Icon size in pixels'
        className='w-20 cursor-pointer accent-indigo-600'
        max={MAX_ICON_SIZE}
        min={MIN_ICON_SIZE}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        type='range'
        value={value}
      />
      <span className='w-9 text-right font-mono text-[11px] font-medium text-zinc-700 tabular-nums'>
        {value}px
      </span>
    </div>
  )
}

function ColorControl({
  label,
  onChange,
  presets,
  value,
}: {
  label: string
  onChange: (value: string) => void
  presets: readonly string[]
  value: string
}) {
  return (
    <div className='flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/70 px-2.5'>
      <label className='flex cursor-pointer items-center gap-1.5'>
        <span className='text-[11px] font-medium text-zinc-500'>{label}</span>
        <input
          aria-label={label}
          className='h-5 w-5 cursor-pointer appearance-none border-0 bg-transparent p-0'
          onChange={(event) => onChange(event.currentTarget.value)}
          type='color'
          value={value}
        />
      </label>
      <span className='hidden w-[54px] font-mono text-[11px] text-zinc-600 sm:inline'>
        {value.toLowerCase()}
      </span>
      <div className='hidden items-center gap-1 border-l border-zinc-200 pl-1.5 2xl:flex'>
        {presets.map((preset) => (
          <button
            aria-label={`Set ${label} to ${preset}`}
            className={`h-3.5 w-3.5 cursor-pointer rounded-full border transition-transform hover:scale-115 ${
              value.toLowerCase() === preset
                ? 'border-zinc-900 ring-1 ring-zinc-900 ring-offset-1'
                : 'border-black/15'
            }`}
            key={preset}
            onClick={() => onChange(preset)}
            style={{ backgroundColor: preset }}
            title={preset}
            type='button'
          />
        ))}
      </div>
    </div>
  )
}

function PreserveStrokeWidthControl({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <label
      className={`flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-2.5 transition-colors select-none ${
        checked
          ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
          : 'border-zinc-200 bg-zinc-50/70 text-zinc-700 hover:border-zinc-300'
      }`}
      title='Apply preserveStrokeWidth to every icon preview using its 16 × 16 baseline.'
    >
      <span className='text-xs font-medium'>Preserve stroke</span>
      <input
        aria-checked={checked}
        checked={checked}
        className='peer sr-only'
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
        role='switch'
        type='checkbox'
      />
      <span
        aria-hidden='true'
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600 ${
          checked ? 'bg-emerald-600' : 'bg-zinc-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </span>
    </label>
  )
}

function ActiveFilterPills({
  onClearAll,
  onUpdate,
  state,
}: {
  onClearAll: () => void
  onUpdate: (patch: Partial<DemoState>) => void
  state: DemoState
}) {
  if (!hasActiveFilters(state)) {
    return null
  }

  const groupLabel = groupMeta.find((item) => item.id === state.group)?.title

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {state.searchTerm.trim() && (
        <FilterChip
          label={`Search: "${state.searchTerm.trim()}"`}
          onRemove={() => updateOrClear(onUpdate, { searchTerm: '' })}
        />
      )}
      {state.group !== 'all' && (
        <FilterChip
          label={`Mode: ${groupLabel ?? state.group}`}
          onRemove={() => updateOrClear(onUpdate, { group: 'all' })}
        />
      )}
      {state.subgroup !== 'all' && (
        <FilterChip
          label={`Category: ${subgroupMeta[state.subgroup].title}`}
          onRemove={() => updateOrClear(onUpdate, { subgroup: 'all' })}
        />
      )}
      {state.product !== 'all' && (
        <FilterChip
          label={`Product: ${productLabels[state.product] ?? state.product}`}
          onRemove={() => updateOrClear(onUpdate, { product: 'all' })}
        />
      )}
      {state.strokeSupport !== 'all' && (
        <FilterChip
          label={state.strokeSupport === 'full' ? 'Stroke: Full support' : 'Stroke: Filled / fixed'}
          onRemove={() => updateOrClear(onUpdate, { strokeSupport: 'all' })}
        />
      )}
      {state.recentOnly && (
        <FilterChip
          label='Recently updated'
          onRemove={() => updateOrClear(onUpdate, { recentOnly: false })}
        />
      )}
      <button
        className='ml-1 cursor-pointer text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900'
        onClick={onClearAll}
        type='button'
      >
        Clear filters
      </button>
    </div>
  )
}

function updateOrClear(onUpdate: (patch: Partial<DemoState>) => void, patch: Partial<DemoState>) {
  onUpdate(patch)
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className='inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50/80 py-0.5 pr-1.5 pl-2.5 text-xs font-medium text-indigo-700'>
      <span>{label}</span>
      <button
        aria-label={`Remove ${label}`}
        className='inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-indigo-500 transition-colors hover:bg-indigo-200/70 hover:text-indigo-900'
        onClick={onRemove}
        type='button'
      >
        <CloseGlyph className='h-2.5 w-2.5' />
      </button>
    </span>
  )
}

function IconGroupSection({
  copiedKey,
  group,
  onCopy,
  onSelectIcon,
  selectedIconName,
  size,
  surface,
}: {
  copiedKey: string | null
  group: IconGroup
  onCopy: (key: string, text: string, label: string) => void
  onSelectIcon: (icon: IconEntry) => void
  selectedIconName: string | null
  size: number
  surface: SurfaceMode
}) {
  return (
    <section className='space-y-5' id={`group-${group.id}`}>
      <div className='flex items-end justify-between gap-4 border-b border-zinc-200/80 pb-3'>
        <div>
          <div className='flex items-center gap-2'>
            <h2 className='text-lg font-semibold tracking-tight text-zinc-950'>{group.title}</h2>
            <span className='rounded-full bg-zinc-200/70 px-2 py-0.5 text-xs font-medium text-zinc-600 tabular-nums'>
              {getGroupIconCount(group)}
            </span>
          </div>
          <p className='mt-0.5 text-xs text-zinc-500'>{group.description}</p>
        </div>
      </div>

      <div className='space-y-6'>
        {group.subgroups.map((subgroup) => (
          <IconSubgroupSection
            copiedKey={copiedKey}
            key={subgroup.id}
            onCopy={onCopy}
            onSelectIcon={onSelectIcon}
            selectedIconName={selectedIconName}
            showHeading={group.subgroups.length > 1}
            size={size}
            subgroup={subgroup}
            surface={surface}
          />
        ))}
      </div>
    </section>
  )
}

function IconSubgroupSection({
  copiedKey,
  onCopy,
  onSelectIcon,
  selectedIconName,
  showHeading,
  size,
  subgroup,
  surface,
}: {
  copiedKey: string | null
  onCopy: (key: string, text: string, label: string) => void
  onSelectIcon: (icon: IconEntry) => void
  selectedIconName: string | null
  showHeading: boolean
  size: number
  subgroup: IconSubgroup
  surface: SurfaceMode
}) {
  const minCardWidth = size > 64 ? 156 : 132

  return (
    <section className='space-y-3'>
      {showHeading && (
        <div className='flex items-baseline justify-between gap-3'>
          <div className='flex flex-wrap items-baseline gap-2'>
            <h3 className='text-sm font-semibold text-zinc-800'>{subgroup.title}</h3>
            <span className='text-xs text-zinc-400'>{subgroup.description}</span>
          </div>
          <span className='shrink-0 text-xs font-medium text-zinc-400 tabular-nums'>
            {subgroup.items.length}
          </span>
        </div>
      )}
      <div
        className='grid gap-2.5'
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
        }}
      >
        {subgroup.items.map((icon) => (
          <IconCard
            copiedKey={copiedKey}
            icon={icon}
            key={icon.name}
            onCopy={onCopy}
            onSelect={() => onSelectIcon(icon)}
            selected={selectedIconName === icon.name}
            size={size}
            surface={surface}
          />
        ))}
      </div>
    </section>
  )
}

function IconCard({
  copiedKey,
  icon,
  onCopy,
  onSelect,
  selected,
  size,
  surface,
}: {
  copiedKey: string | null
  icon: IconEntry
  onCopy: (key: string, text: string, label: string) => void
  onSelect: () => void
  selected: boolean
  size: number
  surface: SurfaceMode
}) {
  const isRecent = isRecentIconVersion(icon, recentVersions)
  const hasFullStrokeSupport = icon.preserveStrokeWidthSupport === 'full'
  const copyId = `card:${icon.name}`
  const isCopied = copiedKey === copyId
  const isDark = surface === 'dark'
  const stageMinHeight = Math.max(76, size + 36)

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all ${
        isDark ? 'bg-[#181b20]' : 'bg-white'
      } ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-500/25'
          : isDark
            ? 'border-zinc-800 hover:border-zinc-600'
            : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'
      }`}
      data-preserve-stroke-width-support={icon.preserveStrokeWidthSupport}
      data-recent-version={isRecent ? icon.updatedVer : undefined}
    >
      <button
        aria-label={`Inspect ${icon.name}`}
        className={`relative flex w-full flex-1 cursor-pointer items-center justify-center text-(--icon-color) transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-indigo-600 ${
          surface === 'grid'
            ? 'icon-stage-grid bg-zinc-50/70'
            : isDark
              ? 'bg-[#181b20] group-hover:bg-white/[0.03]'
              : 'bg-zinc-50/40 group-hover:bg-zinc-50/90'
        }`}
        onClick={onSelect}
        style={{ minHeight: stageMinHeight }}
        type='button'
      >
        {/* Subtle stroke preservation indicator */}
        {hasFullStrokeSupport && (
          <span
            className='absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-emerald-500'
            title='Fully supports preserveStrokeWidth'
          />
        )}

        {/* Recent version micro badge */}
        {isRecent && (
          <span
            className={`absolute top-1.5 right-1.5 rounded-full px-1.5 py-0.5 font-mono text-[9px] leading-none font-semibold ${
              isDark
                ? 'bg-indigo-500/20 text-indigo-300'
                : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/80'
            }`}
          >
            {icon.updatedVer}
          </span>
        )}

        <IconPreview icon={icon} />
      </button>

      {/* Name Footer + dedicated non-overlapping quick-copy button */}
      <div
        className={`flex min-w-0 items-center justify-between gap-1 border-t px-2 py-1.5 ${
          isDark ? 'border-zinc-800/90 bg-[#181b20]' : 'border-zinc-100 bg-white'
        }`}
      >
        <button
          className={`min-w-0 flex-1 cursor-pointer truncate text-left font-mono text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-indigo-600 ${
            isDark ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-zinc-950'
          }`}
          onClick={onSelect}
          title={icon.name}
          type='button'
        >
          {icon.name.replace(/Icon$/, '')}
        </button>

        <button
          aria-label={`Copy ${icon.name}`}
          className={`inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded transition-all focus-visible:opacity-100 ${
            isCopied
              ? 'bg-emerald-600 text-white opacity-100'
              : isDark
                ? 'text-zinc-500 opacity-0 group-hover:opacity-100 hover:bg-zinc-800 hover:text-zinc-100'
                : 'text-zinc-400 opacity-0 group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-900'
          }`}
          onClick={() => onCopy(copyId, `<${icon.name} />`, `Copied <${icon.name} />`)}
          title={`Copy <${icon.name} />`}
          type='button'
        >
          {isCopied ? <CheckGlyph className='h-3 w-3' /> : <CopyGlyph className='h-3 w-3' />}
        </button>
      </div>
    </article>
  )
}

function EmptyState({
  onClearFilters,
  searchTerm,
}: {
  onClearFilters: () => void
  searchTerm: string
}) {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center'>
      <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400'>
        <SearchGlyph className='h-5 w-5' />
      </div>
      <h2 className='mt-4 text-sm font-semibold text-zinc-900'>No matching icons</h2>
      <p className='mt-1 max-w-sm text-xs text-zinc-500'>
        {searchTerm.trim()
          ? `No icons matched "${searchTerm.trim()}" with the current filters.`
          : 'No icons match the active filter combination.'}
      </p>
      <button
        className='mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800'
        onClick={onClearFilters}
        type='button'
      >
        <RotateCcwGlyph className='h-3.5 w-3.5' />
        <span>Clear all filters</span>
      </button>
    </div>
  )
}
