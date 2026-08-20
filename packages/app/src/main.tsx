import type { CSSProperties } from 'react'
import React, { useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'

import type { PreserveStrokeWidthCapture } from './preserve-stroke-width.ts'
import type { IconEntry, IconGroup, IconSubgroup, IconSubgroupId } from './catalogue.ts'
import { createPreserveStrokeWidthCapture } from './preserve-stroke-width.ts'
import {
  filterIconGroups,
  getGroupIconCount,
  getRecentIconVersions,
  getTotalIconCount,
  isRecentIconVersion,
} from './catalogue.ts'
import { createSvgIconGroups } from './svg-catalogue.ts'

const svgModules = import.meta.glob('../../svg/{double,other,single}/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const defaultSettings = {
  preserveStrokeWidth: false,
  color: '#18181b',
  colorChannel1: '#facc15',
  size: 32,
}

const groups = createSvgIconGroups(svgModules)
const recentVersionList = getRecentIconVersions(groups, 3)
const recentVersions = new Set(recentVersionList)
const rootElement = document.querySelector<HTMLElement>('#app')

if (!rootElement) {
  throw new Error('Missing #app root')
}

const root: HTMLElement = rootElement

createRoot(root).render(<DemoShell />)

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getDemoStyle() {
  return {
    '--icon-color': defaultSettings.color,
    '--icon-color-channel-1': defaultSettings.colorChannel1,
    '--icon-size': `${defaultSettings.size}px`,
    '--stage-grid': 'rgb(31 111 91 / 0.075)',
  } as CSSProperties
}

function DemoShell() {
  const preserveStrokeWidthCaptureRef = useRef<PreserveStrokeWidthCapture | null>(null)
  const [preserveStrokeWidth, setPreserveStrokeWidth] = useState(
    defaultSettings.preserveStrokeWidth,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const searchResult = useMemo(
    () => filterIconGroups(groups, deferredSearchTerm),
    [deferredSearchTerm],
  )
  const totalCount = getTotalIconCount(groups)

  useLayoutEffect(() => {
    if (preserveStrokeWidth) {
      preserveStrokeWidthCaptureRef.current ??= createPreserveStrokeWidthCapture()
      preserveStrokeWidthCaptureRef.current?.capture(root)
      return
    }

    preserveStrokeWidthCaptureRef.current?.restore()
    preserveStrokeWidthCaptureRef.current = null
  })

  useLayoutEffect(
    () => () => {
      preserveStrokeWidthCaptureRef.current?.restore()
    },
    [],
  )

  return (
    <main
      className='min-h-screen min-w-80 bg-[#f8f8f5] px-[clamp(14px,3vw,32px)] pt-5 pb-12 text-[#181713] antialiased'
      style={getDemoStyle()}
    >
      <Header />
      <Hero totalCount={totalCount} />
      <Toolbar
        preserveStrokeWidth={preserveStrokeWidth}
        matchCount={searchResult.matchCount}
        onPreserveStrokeWidthChange={setPreserveStrokeWidth}
        onSearchTermChange={setSearchTerm}
        searchTerm={searchTerm}
        totalCount={totalCount}
      />
      <section className='mx-auto mt-8 grid max-w-[1180px] gap-[30px]' aria-label='Icon groups'>
        {searchResult.groups.length === 0 ? (
          <EmptyState searchTerm={searchTerm} />
        ) : (
          searchResult.groups.map((group) => <IconGroupSection group={group} key={group.id} />)
        )}
      </section>
    </main>
  )
}

function Header() {
  return (
    <header className='mx-auto flex max-w-[1180px] items-center justify-start gap-3'>
      <div className='inline-flex h-[30px] min-w-10 items-center justify-center rounded-md bg-[#222018] px-[7px] text-[0.76rem] font-bold text-[#f7f3e7]'>
        SVG
      </div>
      <div className='flex min-w-0 flex-col gap-px'>
        <strong className='text-[0.92rem] leading-[1.2] text-[#181713]'>Univer Icons</strong>
        <span className='truncate text-[0.76rem] text-[#706f67]'>@univerjs/icons-svg</span>
      </div>
    </header>
  )
}

function Hero({ totalCount }: { totalCount: number }) {
  return (
    <section
      className={cx(
        'mx-auto mt-[clamp(32px,7vw,72px)] max-w-[1180px] border-b border-[#deded7] pb-[clamp(22px,4vw,34px)]',
        'max-[560px]:mt-[30px]',
      )}
    >
      <p className='mb-2.5 text-[0.78rem] font-medium text-[#706f67]'>Source catalogue</p>
      <h1 className='m-0 max-w-[820px] text-[clamp(2.2rem,7vw,4rem)] leading-[0.95] font-[720] text-[#181713]'>
        Icons
      </h1>
      <p className='mt-3 max-w-[560px] text-[clamp(0.95rem,1.6vw,1.08rem)] text-[#706f67]'>
        {totalCount} SVG sources grouped for inspection, search, and color preview.
      </p>
      <aside className='mt-4 flex flex-wrap items-center gap-2' aria-label='Icon support legend'>
        <span
          aria-label='Fully supports preserveStrokeWidth'
          className='inline-flex min-h-5 max-w-full items-center rounded-full border border-[#b7d7c4] bg-[#eef7ee] px-2 text-[0.68rem] leading-none font-semibold wrap-anywhere text-[#1f6f5b]'
          title='All visible artwork uses compatible SVG strokes and can preserve its 16 × 16 baseline line width when scaling.'
        >
          Preserve stroke width
        </span>
        <span className='text-[0.78rem] text-[#706f67]'>
          Full 16 × 16 baseline support: all visible artwork uses SVG strokes.
        </span>
      </aside>
    </section>
  )
}

function Toolbar({
  preserveStrokeWidth,
  matchCount,
  onPreserveStrokeWidthChange,
  onSearchTermChange,
  searchTerm,
  totalCount,
}: {
  preserveStrokeWidth: boolean
  matchCount: number
  onPreserveStrokeWidthChange: (value: boolean) => void
  onSearchTermChange: (value: string) => void
  searchTerm: string
  totalCount: number
}) {
  function handleReset() {
    resetSettings()
    onPreserveStrokeWidthChange(defaultSettings.preserveStrokeWidth)
  }

  return (
    <section
      className={cx(
        'sticky top-2.5 z-10 mx-auto mt-[18px] max-w-[1180px] rounded-lg border border-[#deded7]',
        'bg-[color-mix(in_srgb,#fffffb_96%,transparent)] p-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)]',
        'max-[560px]:static',
      )}
      aria-label='Icon preview controls'
    >
      <div className='flex w-full flex-wrap items-center gap-2'>
        <SearchControl
          matchCount={matchCount}
          onSearchTermChange={onSearchTermChange}
          searchTerm={searchTerm}
          totalCount={totalCount}
        />
        <ColorControl defaultValue={defaultSettings.color} label='Color' name='color' />
        <ColorControl
          defaultValue={defaultSettings.colorChannel1}
          label='colorChannel1'
          name='colorChannel1'
        />
        <SizeControl />
        <PreserveStrokeWidthControl
          checked={preserveStrokeWidth}
          onCheckedChange={onPreserveStrokeWidthChange}
        />
        <button
          className={cx(
            'min-h-[38px] flex-none cursor-pointer rounded-lg border border-[#181713]',
            'bg-[#181713] px-3.5 text-[0.86rem] font-medium text-[#f8f8f5]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6f5b]',
            'max-[880px]:flex-1 max-[880px]:basis-[calc(50%-5px)]',
          )}
          onClick={handleReset}
          type='button'
        >
          Reset
        </button>
      </div>
    </section>
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
      className={cx(
        'grid min-h-10 items-center gap-2 rounded-lg border border-[#deded7] bg-[#efefe8] px-2 py-[5px]',
        'max-[880px]:min-w-0 max-[880px]:flex-1 max-[880px]:basis-[calc(50%-5px)]',
        'max-[560px]:basis-full max-[560px]:grid-cols-[auto_1fr_auto]',
        'min-w-max flex-none cursor-pointer grid-cols-[auto_auto_auto]',
      )}
      title='Apply preserveStrokeWidth to every icon preview using its 16 × 16 baseline.'
    >
      <span className='text-[0.78rem] font-medium text-[#706f67]'>Preserve stroke width</span>
      <input
        aria-describedby='preserve-stroke-width-description'
        aria-checked={checked}
        checked={checked}
        className='peer sr-only'
        onChange={(event) => onCheckedChange(event.currentTarget.checked)}
        role='switch'
        type='checkbox'
      />
      <span
        className={cx(
          'relative h-6 w-10 flex-none rounded-full border transition-colors',
          'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1f6f5b]',
          checked ? 'border-[#1f6f5b] bg-[#1f6f5b]' : 'border-[#c8c8c0] bg-[#dcdcd4]',
        )}
        aria-hidden='true'
      >
        <span
          className={cx(
            'absolute top-[3px] left-[3px] h-4 w-4 rounded-full bg-[#fffffb] shadow-sm transition-transform',
            checked && 'translate-x-4',
          )}
        />
      </span>
      <span className='min-w-5 text-[0.78rem] font-medium text-[#706f67]'>
        {checked ? 'On' : 'Off'}
      </span>
      <span className='sr-only' id='preserve-stroke-width-description'>
        Apply preserveStrokeWidth to every icon preview using its 16 × 16 baseline.
      </span>
    </label>
  )
}

function SearchControl({
  matchCount,
  onSearchTermChange,
  searchTerm,
  totalCount,
}: {
  matchCount: number
  onSearchTermChange: (value: string) => void
  searchTerm: string
  totalCount: number
}) {
  return (
    <label
      className={cx(
        'grid min-h-10 items-center gap-2 rounded-lg border border-[#deded7] bg-[#efefe8] px-2 py-[5px]',
        'max-[880px]:min-w-0 max-[880px]:flex-1 max-[880px]:basis-[calc(50%-5px)]',
        'max-[560px]:basis-full max-[560px]:grid-cols-[auto_1fr_auto]',
        'min-w-[min(100%,250px)] flex-1 basis-[250px] grid-cols-[auto_minmax(120px,1fr)_auto]',
        'max-[880px]:basis-full',
      )}
    >
      <span className='text-[0.78rem] font-medium text-[#706f67]'>Search</span>
      <input
        className='h-7 min-w-0 appearance-none rounded-md border border-[#deded7] bg-[#fffffb] px-[9px] text-[#181713] placeholder:text-[#706f67] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6f5b]'
        autoCapitalize='none'
        autoComplete='off'
        onInput={(event) => onSearchTermChange(event.currentTarget.value)}
        placeholder='Icon name'
        spellCheck={false}
        type='search'
        value={searchTerm}
      />
      <span className='min-w-[58px] text-right text-[0.78rem] font-medium text-[#706f67]'>
        {matchCount}/{totalCount}
      </span>
    </label>
  )
}

function ColorControl({
  defaultValue,
  label,
  name,
}: {
  defaultValue: string
  label: string
  name: 'color' | 'colorChannel1'
}) {
  return (
    <label
      className={cx(
        'grid min-h-10 min-w-max items-center gap-2 rounded-lg border border-[#deded7] bg-[#efefe8] px-2 py-[5px]',
        'grid-cols-[auto_auto_auto] max-[880px]:min-w-0 max-[880px]:flex-1 max-[880px]:basis-[calc(50%-5px)]',
        'max-[560px]:basis-full max-[560px]:grid-cols-[auto_1fr_auto]',
      )}
    >
      <span className='text-[0.78rem] font-medium text-[#706f67]'>{label}</span>
      <input
        className='h-[26px] w-7 cursor-pointer appearance-none border-0 bg-transparent p-0'
        data-setting-input={name}
        defaultValue={defaultValue}
        onInput={(event) => updateSetting(name, event.currentTarget.value)}
        type='color'
      />
      <span
        className='min-w-[58px] text-[0.78rem] font-medium text-[#706f67]'
        data-setting-output={name}
      >
        {defaultValue}
      </span>
    </label>
  )
}

function SizeControl() {
  return (
    <label
      className={cx(
        'grid min-h-10 items-center gap-2 rounded-lg border border-[#deded7] bg-[#efefe8] px-2 py-[5px]',
        'max-[880px]:min-w-0 max-[880px]:flex-1 max-[880px]:basis-[calc(50%-5px)]',
        'max-[560px]:basis-full max-[560px]:grid-cols-[auto_1fr_auto]',
        'min-w-[214px] flex-1 basis-[214px] grid-cols-[auto_96px_auto]',
      )}
    >
      <span className='text-[0.78rem] font-medium text-[#706f67]'>Size</span>
      <input
        className='min-w-0 accent-[#1f6f5b]'
        data-setting-input='size'
        defaultValue={defaultSettings.size}
        max={96}
        min={16}
        onInput={(event) => updateSetting('size', event.currentTarget.value)}
        type='range'
      />
      <span
        className='min-w-[58px] text-[0.78rem] font-medium text-[#706f67]'
        data-setting-output='size'
      >
        {defaultSettings.size}px
      </span>
    </label>
  )
}

function IconGroupSection({ group }: { group: IconGroup }) {
  return (
    <section className='grid scroll-mt-28 gap-[18px]' id={`group-${group.id}`}>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <p className='mb-2.5 text-[0.78rem] font-medium text-[#706f67]'>{group.id} icons</p>
          <h2 className='m-0 text-[1.35rem] leading-[1.1] font-[650] text-[#181713]'>
            {group.title}
          </h2>
          <p className='mt-[7px] max-w-[640px] text-[0.92rem] text-[#706f67]'>
            {group.description}
          </p>
        </div>
        <span className='inline-flex h-[30px] min-w-12 items-center justify-center rounded-full border border-[#deded7] bg-[#efefe8] px-3 text-[0.82rem] font-semibold text-[#706f67]'>
          {getGroupIconCount(group)}
        </span>
      </div>
      {group.subgroups.map((subgroup) => (
        <IconSubgroupSection
          key={subgroup.id}
          showHeading={group.subgroups.length > 1}
          subgroup={subgroup}
        />
      ))}
    </section>
  )
}

function IconSubgroupSection({
  showHeading,
  subgroup,
}: {
  showHeading: boolean
  subgroup: IconSubgroup
}) {
  return (
    <section className='grid gap-3'>
      {showHeading && (
        <div className='flex items-center justify-between gap-4 border-t border-[#deded7] pt-3.5'>
          <div>
            <h3 className='m-0 text-[0.98rem] leading-[1.2] font-semibold text-[#181713]'>
              {subgroup.title}
            </h3>
            <p className='mt-[5px] text-[0.84rem] text-[#706f67]'>{subgroup.description}</p>
          </div>
          <span className='inline-flex h-[30px] min-w-12 items-center justify-center rounded-full border border-[#deded7] bg-[#efefe8] px-3 text-[0.82rem] font-semibold text-[#706f67]'>
            {subgroup.items.length}
          </span>
        </div>
      )}
      <div className='grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] gap-2.5 max-[560px]:grid-cols-[repeat(auto-fill,minmax(136px,1fr))]'>
        {subgroup.items.map((icon) => createIconCard(icon, subgroup.id))}
      </div>
    </section>
  )
}

function createIconCard(icon: IconEntry, subgroupId: IconSubgroupId) {
  const isRecent = isRecentIconVersion(icon, recentVersions)
  const hasFullPreserveStrokeWidthSupport = icon.preserveStrokeWidthSupport === 'full'

  return (
    <article
      className={cx(
        'grid min-h-[158px] grid-rows-[96px_1fr] overflow-hidden rounded-lg border text-[#181713]',
        'shadow-[0_1px_2px_rgb(0_0_0/0.04)]',
        isRecent
          ? 'border-[#1f6f5b] bg-[#fbfff9] ring-2 ring-[#d7eadf]'
          : 'border-[#deded7] bg-[#fffffb]',
      )}
      data-preserve-stroke-width-support={icon.preserveStrokeWidthSupport}
      data-recent-version={isRecent ? icon.updatedVer : undefined}
      key={icon.name}
    >
      <div
        className={cx(
          'relative flex items-center justify-center border-b bg-[linear-gradient(90deg,var(--stage-grid)_1px,transparent_1px),linear-gradient(0deg,var(--stage-grid)_1px,transparent_1px)] bg-size-[20px_20px] text-(--icon-color)',
          isRecent ? 'border-[#b7d7c4] bg-[#eef7ee]' : 'border-[#deded7] bg-[#efefe8]',
        )}
      >
        {isRecent && (
          <span className='absolute top-2 right-2 inline-flex h-5 items-center rounded-full bg-[#1f6f5b] px-2 text-[0.68rem] leading-none font-semibold text-[#f8f8f5]'>
            {icon.updatedVer}
          </span>
        )}
        <span
          aria-label={icon.name}
          className='inline-flex text-(length:--icon-size) leading-none text-(--icon-color) [&_svg]:block [&_svg]:h-[1em] [&_svg]:w-[1em]'
          dangerouslySetInnerHTML={{ __html: icon.svg }}
          role='img'
        />
      </div>
      <div className='min-w-0 p-2.5'>
        <h3 className='m-0 text-[0.8rem] leading-tight font-semibold wrap-anywhere text-[#181713]'>
          {icon.name}
        </h3>
        <p className='mt-1.5 text-xs text-[#706f67]'>{subgroupId}</p>
        {hasFullPreserveStrokeWidthSupport && (
          <span
            aria-label='Fully supports preserveStrokeWidth'
            className='mt-2 inline-flex min-h-5 max-w-full items-center rounded-full border border-[#b7d7c4] bg-[#eef7ee] px-2 text-[0.68rem] leading-none font-semibold wrap-anywhere text-[#1f6f5b]'
            title='All visible artwork uses compatible SVG strokes and can preserve its 16 × 16 baseline line width when scaling.'
          >
            Preserve stroke width
          </span>
        )}
      </div>
    </article>
  )
}

function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className='rounded-lg border border-[#deded7] bg-[#fffffb] p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)]'>
      <h2 className='m-0 text-base font-semibold text-[#181713]'>No icons found</h2>
      <p className='mt-1.5 text-[0.86rem] wrap-anywhere text-[#706f67]'>
        {searchTerm.trim() || 'Search'}
      </p>
    </div>
  )
}

function updateSetting(name: 'color' | 'colorChannel1' | 'size', value: string) {
  const shell = document.querySelector<HTMLElement>('main')
  const cssValue = name === 'size' ? `${value}px` : value

  shell?.style.setProperty(getCssVariableName(name), cssValue)
  updateSettingOutput(name, cssValue)
}

function resetSettings() {
  const values = {
    color: defaultSettings.color,
    colorChannel1: defaultSettings.colorChannel1,
    size: `${defaultSettings.size}`,
  }

  Object.entries(values).forEach(([name, value]) => {
    const input = document.querySelector<HTMLInputElement>(`[data-setting-input="${name}"]`)

    if (input) {
      input.value = value
    }

    updateSetting(name as 'color' | 'colorChannel1' | 'size', value)
  })
}

function getCssVariableName(name: 'color' | 'colorChannel1' | 'size') {
  if (name === 'colorChannel1') {
    return '--icon-color-channel-1'
  }

  if (name === 'size') {
    return '--icon-size'
  }

  return '--icon-color'
}

function updateSettingOutput(name: 'color' | 'colorChannel1' | 'size', value: string) {
  document.querySelectorAll<HTMLElement>(`[data-setting-output="${name}"]`).forEach((element) => {
    element.textContent = value
  })
}
