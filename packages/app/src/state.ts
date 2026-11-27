import type { IconGroupId, IconSubgroupId, StrokeFilter } from './catalogue.ts'
import { comparisonFamilies, subgroupMeta } from './catalogue.ts'

export type DemoView = 'catalogue' | 'compare'
export type SurfaceMode = 'dark' | 'grid' | 'light'
export type CodeFramework = 'react' | 'svg' | 'vue'

export type DemoState = {
  codeTab: CodeFramework
  color: string
  colorChannel1: string
  familyId: string
  group: IconGroupId | 'all'
  preserveStrokeWidth: boolean
  product: string | 'all'
  recentOnly: boolean
  searchTerm: string
  selectedIcon: string | null
  showGuides: boolean
  size: number
  strokeSupport: StrokeFilter
  subgroup: IconSubgroupId | 'all'
  surface: SurfaceMode
  view: DemoView
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export const DEMO_STATE_STORAGE_KEY = 'univer-icons-demo:state:v1'

export const MIN_ICON_SIZE = 16
export const MAX_ICON_SIZE = 96

export const defaultDemoState: DemoState = {
  codeTab: 'react',
  color: '#18181b',
  colorChannel1: '#facc15',
  familyId: comparisonFamilies[0].id,
  group: 'all',
  preserveStrokeWidth: false,
  product: 'all',
  recentOnly: false,
  searchTerm: '',
  selectedIcon: null,
  showGuides: false,
  size: 16,
  strokeSupport: 'all',
  subgroup: 'all',
  surface: 'light',
  view: 'catalogue',
}

const VALID_VIEWS = new Set<DemoView>(['catalogue', 'compare'])
const VALID_SURFACES = new Set<SurfaceMode>(['dark', 'grid', 'light'])
const VALID_CODE_TABS = new Set<CodeFramework>(['react', 'svg', 'vue'])
const VALID_GROUPS = new Set<IconGroupId | 'all'>(['all', 'double', 'multi', 'single'])
const VALID_STROKE_FILTERS = new Set<StrokeFilter>(['all', 'full', 'none'])
const VALID_SUBGROUPS = new Set<string>(['all', ...Object.keys(subgroupMeta)])
const VALID_FAMILY_IDS = new Set<string>(comparisonFamilies.map((family) => family.id))
const HEX_COLOR_PATTERN = /^#[\da-f]{6}$/i

export type StateValidationContext = {
  validIconNames?: ReadonlySet<string>
  validProducts?: ReadonlySet<string>
}

export function loadDemoState(
  search: string,
  storage: StorageLike | null,
  context: StateValidationContext = {},
): DemoState {
  const stored = readStoredState(storage)
  const params = new URLSearchParams(search)

  const pick = <T>(
    paramKey: string,
    storedValue: unknown,
    parser: (raw: unknown) => T | undefined,
    fallback: T,
  ): T => {
    if (params.has(paramKey)) {
      const fromUrl = parser(params.get(paramKey))
      if (fromUrl !== undefined) {
        return fromUrl
      }
    }

    const fromStorage = parser(storedValue)
    if (fromStorage !== undefined) {
      return fromStorage
    }

    return fallback
  }

  const group = pick('group', stored.group, parseGroup, defaultDemoState.group)
  const subgroup = pick('subgroup', stored.subgroup, parseSubgroup, defaultDemoState.subgroup)
  const product = pick(
    'product',
    stored.product,
    (raw) => parseProduct(raw, context.validProducts),
    defaultDemoState.product,
  )
  const strokeSupport = pick(
    'stroke',
    stored.strokeSupport,
    parseStrokeFilter,
    defaultDemoState.strokeSupport,
  )
  const recentOnly = pick('recent', stored.recentOnly, parseBoolean, defaultDemoState.recentOnly)
  const searchTerm = pick('q', stored.searchTerm, parseSearchTerm, defaultDemoState.searchTerm)
  const color = pick('color', stored.color, parseHexColor, defaultDemoState.color)
  const colorChannel1 = pick(
    'c1',
    stored.colorChannel1,
    parseHexColor,
    defaultDemoState.colorChannel1,
  )
  const size = pick('size', stored.size, parseSize, defaultDemoState.size)
  const preserveStrokeWidth = pick(
    'psw',
    stored.preserveStrokeWidth,
    parseBoolean,
    defaultDemoState.preserveStrokeWidth,
  )
  const surface = pick('surface', stored.surface, parseSurface, defaultDemoState.surface)
  const view = pick('view', stored.view, parseView, defaultDemoState.view)
  const familyId = pick('family', stored.familyId, parseFamilyId, defaultDemoState.familyId)
  const showGuides = pick('guides', stored.showGuides, parseBoolean, defaultDemoState.showGuides)
  const codeTab = pick('code', stored.codeTab, parseCodeTab, defaultDemoState.codeTab)

  const selectedIcon = params.has('icon')
    ? (parseSelectedIcon(params.get('icon'), context.validIconNames) ?? null)
    : null

  return {
    codeTab,
    color,
    colorChannel1,
    familyId,
    group,
    preserveStrokeWidth,
    product,
    recentOnly,
    searchTerm,
    selectedIcon,
    showGuides,
    size,
    strokeSupport,
    subgroup,
    surface,
    view,
  }
}

export function serializeDemoStateToSearch(state: DemoState): string {
  const params = new URLSearchParams()

  if (state.view !== defaultDemoState.view) {
    params.set('view', state.view)
  }
  if (state.searchTerm.trim() !== '') {
    params.set('q', state.searchTerm)
  }
  if (state.group !== defaultDemoState.group) {
    params.set('group', state.group)
  }
  if (state.subgroup !== defaultDemoState.subgroup) {
    params.set('subgroup', state.subgroup)
  }
  if (state.product !== defaultDemoState.product) {
    params.set('product', state.product)
  }
  if (state.strokeSupport !== defaultDemoState.strokeSupport) {
    params.set('stroke', state.strokeSupport)
  }
  if (state.recentOnly) {
    params.set('recent', '1')
  }
  if (state.size !== defaultDemoState.size) {
    params.set('size', String(state.size))
  }
  if (state.color.toLowerCase() !== defaultDemoState.color) {
    params.set('color', state.color.toLowerCase())
  }
  if (state.colorChannel1.toLowerCase() !== defaultDemoState.colorChannel1) {
    params.set('c1', state.colorChannel1.toLowerCase())
  }
  if (state.preserveStrokeWidth) {
    params.set('psw', '1')
  }
  if (state.surface !== defaultDemoState.surface) {
    params.set('surface', state.surface)
  }
  if (state.familyId !== defaultDemoState.familyId) {
    params.set('family', state.familyId)
  }
  if (state.showGuides) {
    params.set('guides', '1')
  }
  if (state.codeTab !== defaultDemoState.codeTab) {
    params.set('code', state.codeTab)
  }
  if (state.selectedIcon) {
    params.set('icon', state.selectedIcon)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

export function saveDemoState(state: DemoState, storage: StorageLike | null) {
  if (!storage) {
    return
  }

  const { selectedIcon: _selectedIcon, ...persisted } = state

  try {
    storage.setItem(DEMO_STATE_STORAGE_KEY, JSON.stringify(persisted))
  } catch {
    // Ignore storage write failures (private browsing / quota exceeded).
  }
}

export function syncDemoStateToUrl(state: DemoState) {
  if (typeof window === 'undefined') {
    return
  }

  const nextSearch = serializeDemoStateToSearch(state)
  if (window.location.search === nextSearch) {
    return
  }

  const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`
  try {
    window.history.replaceState(null, '', nextUrl)
  } catch {
    // Ignore history restrictions in sandboxed environments.
  }
}

export function hasActiveFilters(state: DemoState): boolean {
  return (
    state.searchTerm.trim() !== '' ||
    state.group !== defaultDemoState.group ||
    state.subgroup !== defaultDemoState.subgroup ||
    state.product !== defaultDemoState.product ||
    state.strokeSupport !== defaultDemoState.strokeSupport ||
    state.recentOnly
  )
}

export function countActiveFilters(state: DemoState): number {
  let count = 0
  if (state.searchTerm.trim() !== '') {
    count += 1
  }
  if (state.group !== defaultDemoState.group) {
    count += 1
  }
  if (state.subgroup !== defaultDemoState.subgroup) {
    count += 1
  }
  if (state.product !== defaultDemoState.product) {
    count += 1
  }
  if (state.strokeSupport !== defaultDemoState.strokeSupport) {
    count += 1
  }
  if (state.recentOnly) {
    count += 1
  }
  return count
}

export function hasCustomPreviewSettings(state: DemoState): boolean {
  return (
    state.size !== defaultDemoState.size ||
    state.color.toLowerCase() !== defaultDemoState.color ||
    state.colorChannel1.toLowerCase() !== defaultDemoState.colorChannel1 ||
    state.preserveStrokeWidth !== defaultDemoState.preserveStrokeWidth ||
    state.surface !== defaultDemoState.surface ||
    state.showGuides !== defaultDemoState.showGuides
  )
}

export function resetFilters(state: DemoState): DemoState {
  return {
    ...state,
    group: defaultDemoState.group,
    product: defaultDemoState.product,
    recentOnly: defaultDemoState.recentOnly,
    searchTerm: defaultDemoState.searchTerm,
    strokeSupport: defaultDemoState.strokeSupport,
    subgroup: defaultDemoState.subgroup,
  }
}

export function resetPreviewSettings(state: DemoState): DemoState {
  return {
    ...state,
    color: defaultDemoState.color,
    colorChannel1: defaultDemoState.colorChannel1,
    preserveStrokeWidth: defaultDemoState.preserveStrokeWidth,
    showGuides: defaultDemoState.showGuides,
    size: defaultDemoState.size,
    surface: defaultDemoState.surface,
  }
}

function readStoredState(storage: StorageLike | null): Partial<Record<keyof DemoState, unknown>> {
  if (!storage) {
    return {}
  }

  try {
    const raw = storage.getItem(DEMO_STATE_STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Partial<Record<keyof DemoState, unknown>>
    }
  } catch {
    // Ignore malformed JSON or storage access errors.
  }

  return {}
}

function parseView(raw: unknown): DemoView | undefined {
  return typeof raw === 'string' && VALID_VIEWS.has(raw as DemoView) ? (raw as DemoView) : undefined
}

function parseSurface(raw: unknown): SurfaceMode | undefined {
  return typeof raw === 'string' && VALID_SURFACES.has(raw as SurfaceMode)
    ? (raw as SurfaceMode)
    : undefined
}

function parseCodeTab(raw: unknown): CodeFramework | undefined {
  return typeof raw === 'string' && VALID_CODE_TABS.has(raw as CodeFramework)
    ? (raw as CodeFramework)
    : undefined
}

function parseGroup(raw: unknown): IconGroupId | 'all' | undefined {
  return typeof raw === 'string' && VALID_GROUPS.has(raw as IconGroupId | 'all')
    ? (raw as IconGroupId | 'all')
    : undefined
}

function parseSubgroup(raw: unknown): IconSubgroupId | 'all' | undefined {
  return typeof raw === 'string' && VALID_SUBGROUPS.has(raw)
    ? (raw as IconSubgroupId | 'all')
    : undefined
}

function parseProduct(
  raw: unknown,
  validProducts?: ReadonlySet<string>,
): string | 'all' | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }

  if (raw === 'all') {
    return 'all'
  }

  if (validProducts && !validProducts.has(raw)) {
    return undefined
  }

  return raw.trim() ? raw : undefined
}

function parseStrokeFilter(raw: unknown): StrokeFilter | undefined {
  return typeof raw === 'string' && VALID_STROKE_FILTERS.has(raw as StrokeFilter)
    ? (raw as StrokeFilter)
    : undefined
}

function parseFamilyId(raw: unknown): string | undefined {
  return typeof raw === 'string' && VALID_FAMILY_IDS.has(raw) ? raw : undefined
}

function parseSearchTerm(raw: unknown): string | undefined {
  return typeof raw === 'string' ? raw : undefined
}

function parseHexColor(raw: unknown): string | undefined {
  return typeof raw === 'string' && HEX_COLOR_PATTERN.test(raw) ? raw.toLowerCase() : undefined
}

function parseSize(raw: unknown): number | undefined {
  const numeric = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN
  if (!Number.isFinite(numeric)) {
    return undefined
  }

  return Math.max(MIN_ICON_SIZE, Math.min(MAX_ICON_SIZE, Math.round(numeric)))
}

function parseBoolean(raw: unknown): boolean | undefined {
  if (typeof raw === 'boolean') {
    return raw
  }

  if (raw === '1' || raw === 'true') {
    return true
  }

  if (raw === '0' || raw === 'false') {
    return false
  }

  return undefined
}

function parseSelectedIcon(raw: unknown, validIconNames?: ReadonlySet<string>): string | undefined {
  if (typeof raw !== 'string' || !raw.trim()) {
    return undefined
  }

  if (validIconNames && !validIconNames.has(raw)) {
    return undefined
  }

  return raw
}
