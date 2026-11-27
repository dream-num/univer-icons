import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { DemoState, StorageLike } from '../state.ts'
import {
  DEMO_STATE_STORAGE_KEY,
  defaultDemoState,
  hasActiveFilters,
  hasCustomPreviewSettings,
  loadDemoState,
  resetFilters,
  resetPreviewSettings,
  saveDemoState,
  serializeDemoStateToSearch,
} from '../state.ts'

function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const map = new Map<string, string>(Object.entries(initial))
  return {
    getItem(key) {
      return map.get(key) ?? null
    },
    setItem(key, value) {
      map.set(key, value)
    },
  }
}

test('default state serializes to an empty query string', () => {
  assert.equal(serializeDemoStateToSearch(defaultDemoState), '')
  assert.equal(hasActiveFilters(defaultDemoState), false)
  assert.equal(hasCustomPreviewSettings(defaultDemoState), false)
})

test('saving to localStorage preserves filters and preview settings across reloads without URL params', () => {
  const storage = createMemoryStorage()
  const modified: DemoState = {
    ...defaultDemoState,
    codeTab: 'vue',
    color: '#274fee',
    colorChannel1: '#38bdf8',
    familyId: 'charts',
    group: 'double',
    preserveStrokeWidth: true,
    product: 'sheets',
    recentOnly: true,
    searchTerm: 'filter',
    selectedIcon: 'FilterAppliedIcon',
    showGuides: true,
    size: 32,
    strokeSupport: 'full',
    subgroup: 'double',
    surface: 'dark',
    view: 'compare',
  }

  saveDemoState(modified, storage)
  const restored = loadDemoState('', storage, {
    validIconNames: new Set(['FilterAppliedIcon']),
    validProducts: new Set(['sheets', 'docs']),
  })

  assert.deepEqual(restored, {
    ...modified,
    // selectedIcon is only restored from URL, not forced open from localStorage
    selectedIcon: null,
  })
})

test('URL query params override localStorage and support full round-trip including selectedIcon', () => {
  const storage = createMemoryStorage()
  saveDemoState(
    {
      ...defaultDemoState,
      group: 'single',
      size: 24,
      surface: 'grid',
    },
    storage,
  )

  const target: DemoState = {
    ...defaultDemoState,
    codeTab: 'svg',
    color: '#059669',
    colorChannel1: '#fb7185',
    familyId: 'arrows',
    group: 'double',
    preserveStrokeWidth: true,
    product: 'docs',
    recentOnly: true,
    searchTerm: 'table',
    selectedIcon: 'TableIcon',
    showGuides: true,
    size: 48,
    strokeSupport: 'none',
    subgroup: 'double',
    surface: 'dark',
    view: 'catalogue',
  }

  const search = serializeDemoStateToSearch(target)
  const restored = loadDemoState(search, storage, {
    validIconNames: new Set(['TableIcon']),
    validProducts: new Set(['docs', 'sheets']),
  })

  assert.deepEqual(restored, target)
})

test('invalid URL and storage values safely fall back to defaults and clamp size', () => {
  const storage = createMemoryStorage({
    [DEMO_STATE_STORAGE_KEY]: JSON.stringify({
      color: 'not-a-color',
      group: 'unknown',
      size: 999,
      surface: 'neon',
    }),
  })

  const restored = loadDemoState('?size=4&group=invalid&product=missing&icon=Nope', storage, {
    validIconNames: new Set(['SearchIcon']),
    validProducts: new Set(['common']),
  })

  assert.equal(restored.color, defaultDemoState.color)
  assert.equal(restored.group, defaultDemoState.group)
  assert.equal(restored.surface, defaultDemoState.surface)
  assert.equal(restored.size, 16)
  assert.equal(restored.product, 'all')
  assert.equal(restored.selectedIcon, null)
})

test('resetFilters and resetPreviewSettings only reset their own slice of state', () => {
  const modified: DemoState = {
    ...defaultDemoState,
    color: '#e11d48',
    group: 'single',
    preserveStrokeWidth: true,
    recentOnly: true,
    searchTerm: 'chart',
    size: 40,
    surface: 'dark',
  }

  const afterFilterReset = resetFilters(modified)
  assert.equal(hasActiveFilters(afterFilterReset), false)
  assert.equal(afterFilterReset.size, 40)
  assert.equal(afterFilterReset.color, '#e11d48')
  assert.equal(afterFilterReset.preserveStrokeWidth, true)

  const afterPreviewReset = resetPreviewSettings(modified)
  assert.equal(hasCustomPreviewSettings(afterPreviewReset), false)
  assert.equal(afterPreviewReset.searchTerm, 'chart')
  assert.equal(afterPreviewReset.group, 'single')
  assert.equal(afterPreviewReset.recentOnly, true)
})
