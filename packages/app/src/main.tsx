import React, { type CSSProperties, useDeferredValue, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  filterIconGroups,
  getGroupIconCount,
  getTotalIconCount,
  type IconEntry,
  type IconGroup,
  type IconSubgroup,
  type IconSubgroupId,
} from './catalogue.ts'
import { createSvgIconGroups } from './svg-catalogue.ts'

const svgModules = import.meta.glob('../../svg/{double,other,single}/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const defaultSettings = {
  color: '#18181b',
  colorChannel1: '#facc15',
  size: 32,
}

const groups = createSvgIconGroups(svgModules)
const root = document.querySelector<HTMLElement>('#app')

const shellClass = [
  'min-h-screen min-w-80 bg-[#f8f8f5] px-[clamp(14px,3vw,32px)] pt-5 pb-12',
  'text-[#181713] antialiased',
].join(' ')
const containerClass = 'mx-auto max-w-[1180px]'
const eyebrowClass = 'mb-2.5 text-[0.78rem] font-medium text-[#706f67]'
const controlFieldClass = [
  'grid min-h-10 min-w-max items-center gap-2 rounded-lg border border-[#deded7]',
  'bg-[#efefe8] px-2 py-[5px]',
  'max-[880px]:min-w-0 max-[880px]:flex-1 max-[880px]:basis-[calc(50%-5px)]',
  'max-[560px]:basis-full max-[560px]:grid-cols-[auto_1fr_auto]',
].join(' ')
const controlTextClass = 'text-[0.78rem] font-medium text-[#706f67]'

if (!root) {
  throw new Error('Missing #app root')
}

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
  const [searchTerm, setSearchTerm] = useState('')
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const searchResult = useMemo(
    () => filterIconGroups(groups, deferredSearchTerm),
    [deferredSearchTerm],
  )
  const totalCount = getTotalIconCount(groups)

  return (
    <main className={shellClass} style={getDemoStyle()}>
      <Header />
      <Hero totalCount={totalCount} />
      <Toolbar
        matchCount={searchResult.matchCount}
        onSearchTermChange={setSearchTerm}
        searchTerm={searchTerm}
        totalCount={totalCount}
      />
      <section className={cx(containerClass, 'mt-8 grid gap-[30px]')} aria-label='Icon groups'>
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
    <header className={cx(containerClass, 'flex items-center justify-start gap-3')}>
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
        containerClass,
        'mt-[clamp(32px,7vw,72px)] border-b border-[#deded7] pb-[clamp(22px,4vw,34px)]',
        'max-[560px]:mt-[30px]',
      )}
    >
      <p className={eyebrowClass}>Source catalogue</p>
      <h1 className='m-0 max-w-[820px] text-[clamp(2.2rem,7vw,4rem)] leading-[0.95] font-[720] text-[#181713]'>
        Icons
      </h1>
      <p className='mt-3 max-w-[560px] text-[clamp(0.95rem,1.6vw,1.08rem)] text-[#706f67]'>
        {totalCount} SVG sources grouped for inspection, search, and color preview.
      </p>
    </section>
  )
}

function Toolbar({
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
    <section
      className={cx(
        containerClass,
        'sticky top-2.5 z-10 mt-[18px] rounded-lg border border-[#deded7]',
        'bg-[color-mix(in_srgb,#fffffb_96%,transparent)] p-2.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)]',
        'max-[560px]:static',
      )}
      aria-label='Icon preview controls'
    >
      <div className='flex w-full flex-wrap items-center gap-2.5'>
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
        <button
          className={cx(
            'min-h-[38px] flex-none cursor-pointer rounded-lg border border-[#181713]',
            'bg-[#181713] px-3.5 text-[0.86rem] font-medium text-[#f8f8f5]',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f6f5b]',
            'max-[880px]:flex-1 max-[880px]:basis-[calc(50%-5px)]',
          )}
          onClick={resetSettings}
          type='button'
        >
          Reset
        </button>
      </div>
    </section>
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
        controlFieldClass,
        'min-w-[min(100%,280px)] flex-1 basis-80 grid-cols-[auto_minmax(120px,1fr)_auto]',
        'max-[880px]:basis-full',
      )}
    >
      <span className={controlTextClass}>Search</span>
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
      <span className={cx(controlTextClass, 'min-w-[58px] text-right')}>
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
    <label className={cx(controlFieldClass, 'grid-cols-[auto_auto_auto]')}>
      <span className={controlTextClass}>{label}</span>
      <input
        className='h-[26px] w-7 cursor-pointer appearance-none border-0 bg-transparent p-0'
        data-setting-input={name}
        defaultValue={defaultValue}
        onInput={(event) => updateSetting(name, event.currentTarget.value)}
        type='color'
      />
      <span className={cx(controlTextClass, 'min-w-[58px]')} data-setting-output={name}>
        {defaultValue}
      </span>
    </label>
  )
}

function SizeControl() {
  return (
    <label className={cx(controlFieldClass, 'flex-1 basis-[250px] grid-cols-[auto_118px_auto]')}>
      <span className={controlTextClass}>Size</span>
      <input
        className='min-w-0 accent-[#1f6f5b]'
        data-setting-input='size'
        defaultValue={defaultSettings.size}
        max={96}
        min={16}
        onInput={(event) => updateSetting('size', event.currentTarget.value)}
        type='range'
      />
      <span className={cx(controlTextClass, 'min-w-[58px]')} data-setting-output='size'>
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
          <p className={eyebrowClass}>{group.id} icons</p>
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
  return (
    <article
      className='grid min-h-[158px] grid-rows-[96px_1fr] overflow-hidden rounded-lg border border-[#deded7] bg-[#fffffb] text-[#181713] shadow-[0_1px_2px_rgb(0_0_0/0.04)]'
      key={icon.name}
    >
      <div className='flex items-center justify-center border-b border-[#deded7] bg-[#efefe8] bg-[image:linear-gradient(90deg,var(--stage-grid)_1px,transparent_1px),linear-gradient(0deg,var(--stage-grid)_1px,transparent_1px)] bg-[length:20px_20px] text-[var(--icon-color)]'>
        <span
          aria-label={icon.name}
          className='inline-flex text-[length:var(--icon-size)] leading-none text-[var(--icon-color)] [&_svg]:block [&_svg]:h-[1em] [&_svg]:w-[1em]'
          dangerouslySetInnerHTML={{ __html: icon.svg }}
          role='img'
        />
      </div>
      <div className='min-w-0 p-2.5'>
        <h3 className='m-0 text-[0.8rem] leading-tight font-semibold text-[#181713] [overflow-wrap:anywhere]'>
          {icon.name}
        </h3>
        <p className='mt-1.5 text-xs text-[#706f67]'>{subgroupId}</p>
      </div>
    </article>
  )
}

function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className='rounded-lg border border-[#deded7] bg-[#fffffb] p-6 shadow-[0_1px_2px_rgb(0_0_0/0.04)]'>
      <h2 className='m-0 text-base font-semibold text-[#181713]'>No icons found</h2>
      <p className='mt-1.5 text-[0.86rem] text-[#706f67] [overflow-wrap:anywhere]'>
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
