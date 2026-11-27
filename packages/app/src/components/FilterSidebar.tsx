import React from 'react'
import type {
  CatalogueFacetCounts,
  IconGroupId,
  IconSubgroupId,
  StrokeFilter,
} from '../catalogue.ts'
import { groupMeta, productLabels, subgroupMeta, subgroupOrder } from '../catalogue.ts'
import type { DemoState } from '../state.ts'
import { hasActiveFilters } from '../state.ts'
import { CloseGlyph, SparklesGlyph } from './ui-icons.tsx'

type FilterSidebarProps = {
  availableProducts: string[]
  facets: CatalogueFacetCounts
  onClearFilters: () => void
  onCloseMobile?: () => void
  onUpdate: (patch: Partial<DemoState>) => void
  recentVersionList: string[]
  state: DemoState
}

export function FilterSidebar({
  availableProducts,
  facets,
  onClearFilters,
  onCloseMobile,
  onUpdate,
  recentVersionList,
  state,
}: FilterSidebarProps) {
  const active = hasActiveFilters(state)

  return (
    <div className='flex h-full flex-col gap-5'>
      {onCloseMobile && (
        <div className='flex items-center justify-between border-b border-zinc-200 pb-3'>
          <span className='text-sm font-semibold text-zinc-900'>Filters</span>
          <button
            aria-label='Close filters'
            className='inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900'
            onClick={onCloseMobile}
            type='button'
          >
            <CloseGlyph className='h-4 w-4' />
          </button>
        </div>
      )}

      {/* Quick status toggle: Recently updated */}
      <div>
        <div className='mb-2 flex items-center justify-between'>
          <span className='text-[11px] font-semibold tracking-wider text-zinc-400 uppercase'>
            Highlights
          </span>
          {active && (
            <button
              className='cursor-pointer text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-700'
              onClick={onClearFilters}
              type='button'
            >
              Clear all
            </button>
          )}
        </div>
        <button
          aria-pressed={state.recentOnly}
          className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-all ${
            state.recentOnly
              ? 'border-indigo-200 bg-indigo-50 text-indigo-700 shadow-xs'
              : 'border-zinc-200/80 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
          }`}
          onClick={() => onUpdate({ recentOnly: !state.recentOnly })}
          type='button'
        >
          <span className='flex items-center gap-1.5'>
            <SparklesGlyph className='h-3.5 w-3.5 text-indigo-500' />
            <span>Recently updated</span>
          </span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
              state.recentOnly ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-100 text-zinc-500'
            }`}
          >
            {facets.recent}
          </span>
        </button>
        {recentVersionList.length > 0 && (
          <p className='mt-1.5 px-0.5 text-[11px] text-zinc-400'>
            Latest: {recentVersionList.join(' · ')}
          </p>
        )}
      </div>

      {/* Group filter */}
      <FilterSection title='Color Mode'>
        <FacetButton
          active={state.group === 'all'}
          count={facets.groups.all}
          label='All modes'
          onClick={() => onUpdate({ group: 'all' })}
        />
        {groupMeta.map((group) => (
          <FacetButton
            active={state.group === group.id}
            count={facets.groups[group.id]}
            key={group.id}
            label={group.title}
            onClick={() =>
              onUpdate({
                group: state.group === group.id ? 'all' : (group.id as IconGroupId),
              })
            }
          />
        ))}
      </FilterSection>

      {/* Stroke width support filter */}
      <FilterSection title='Stroke Preservation'>
        {(
          [
            { id: 'all', label: 'All icons' },
            { id: 'full', label: 'Full support', dotClass: 'bg-emerald-500' },
            { id: 'none', label: 'Filled / fixed', dotClass: 'bg-zinc-300' },
          ] as Array<{ dotClass?: string; id: StrokeFilter; label: string }>
        ).map((item) => (
          <FacetButton
            active={state.strokeSupport === item.id}
            count={facets.strokeSupport[item.id]}
            dotClass={item.dotClass}
            key={item.id}
            label={item.label}
            onClick={() =>
              onUpdate({
                strokeSupport: state.strokeSupport === item.id ? 'all' : item.id,
              })
            }
          />
        ))}
      </FilterSection>

      {/* Product filter */}
      <FilterSection title='Product'>
        <FacetButton
          active={state.product === 'all'}
          count={facets.products.all ?? 0}
          label='All products'
          onClick={() => onUpdate({ product: 'all' })}
        />
        {availableProducts.map((product) => (
          <FacetButton
            active={state.product === product}
            count={facets.products[product] ?? 0}
            key={product}
            label={productLabels[product] ?? product}
            onClick={() =>
              onUpdate({
                product: state.product === product ? 'all' : product,
              })
            }
          />
        ))}
      </FilterSection>

      {/* Subgroup filter */}
      <FilterSection title='Category'>
        <FacetButton
          active={state.subgroup === 'all'}
          count={facets.subgroups.all}
          label='All categories'
          onClick={() => onUpdate({ subgroup: 'all' })}
        />
        {subgroupOrder.map((subgroupId) => (
          <FacetButton
            active={state.subgroup === subgroupId}
            count={facets.subgroups[subgroupId]}
            key={subgroupId}
            label={subgroupMeta[subgroupId].title}
            onClick={() =>
              onUpdate({
                subgroup: state.subgroup === subgroupId ? 'all' : (subgroupId as IconSubgroupId),
              })
            }
          />
        ))}
      </FilterSection>
    </div>
  )
}

function FilterSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div>
      <h3 className='mb-1.5 px-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase'>
        {title}
      </h3>
      <div className='flex flex-col gap-0.5'>{children}</div>
    </div>
  )
}

function FacetButton({
  active,
  count,
  dotClass,
  label,
  onClick,
}: {
  active: boolean
  count: number
  dotClass?: string
  label: string
  onClick: () => void
}) {
  const isEmpty = count === 0 && !active

  return (
    <button
      aria-pressed={active}
      className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
        active
          ? 'bg-zinc-900 font-medium text-white shadow-xs'
          : isEmpty
            ? 'text-zinc-400 hover:bg-zinc-100/70'
            : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
      }`}
      onClick={onClick}
      type='button'
    >
      <span className='flex min-w-0 items-center gap-2 truncate'>
        {dotClass && (
          <span
            aria-hidden='true'
            className={`h-2 w-2 shrink-0 rounded-full ${active ? 'bg-emerald-400' : dotClass}`}
          />
        )}
        <span className='truncate'>{label}</span>
      </span>
      <span
        className={`ml-2 shrink-0 text-[11px] tabular-nums ${
          active ? 'text-zinc-300' : 'text-zinc-400'
        }`}
      >
        {count}
      </span>
    </button>
  )
}
