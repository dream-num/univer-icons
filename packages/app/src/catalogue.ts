import type manifest from '@univerjs/icons-svg/manifest'

export type IconEntry = Omit<
  (typeof manifest)['single'][number],
  'componentName' | 'group' | 'path'
> & {
  group: IconGroupId
  sourcePath: string
  svg: string
}

export type IconGroup = {
  description: string
  id: IconGroupId
  subgroups: IconSubgroup[]
  title: string
}

export type IconGroupId = 'double' | 'multi' | 'single'

export type IconSubgroup = {
  description: string
  id: IconSubgroupId
  items: IconEntry[]
  title: string
}

export type IconSubgroupId =
  | 'brand'
  | 'chart'
  | 'currency'
  | 'diagram'
  | 'double'
  | 'formula'
  | 'function'
  | 'general'
  | 'multi'
  | 'shape'
  | 'stroke-size'

export type StrokeFilter = 'all' | 'full' | 'none'

export type IconFilterOptions = {
  group: IconGroupId | 'all'
  product: string | 'all'
  recentOnly: boolean
  searchTerm: string
  strokeSupport: StrokeFilter
  subgroup: IconSubgroupId | 'all'
}

export type IconSearchResult = {
  groups: IconGroup[]
  matchCount: number
}

export type CatalogueFacetCounts = {
  groups: Record<IconGroupId | 'all', number>
  products: Record<string, number>
  recent: number
  strokeSupport: Record<StrokeFilter, number>
  subgroups: Record<IconSubgroupId | 'all', number>
}

export const groupMeta: Array<Omit<IconGroup, 'subgroups'>> = [
  {
    id: 'single',
    title: 'Single',
    description: 'Single-color icons driven by currentColor, including shape icons.',
  },
  {
    id: 'double',
    title: 'Double',
    description: 'Icons that expose colorChannel1 for secondary fills.',
  },
  {
    id: 'multi',
    title: 'Multi',
    description: 'Document and product-style multi-color icons.',
  },
]

export const subgroupMeta = {
  brand: {
    id: 'brand',
    title: 'Brand',
    description: 'Product brand and application icons.',
  },
  chart: {
    id: 'chart',
    title: 'Chart',
    description: 'Chart type, trendline, and chart feature icons.',
  },
  currency: {
    id: 'currency',
    title: 'Currency',
    description: 'Currency symbol icons.',
  },
  double: {
    id: 'double',
    title: 'Double',
    description: 'Icons with a secondary color channel.',
  },
  formula: {
    id: 'formula',
    title: 'Formula',
    description: 'Formula structure and mathematical notation icons.',
  },
  function: {
    id: 'function',
    title: 'Function',
    description: 'Function category icons for Sheets formula menus.',
  },
  general: {
    id: 'general',
    title: 'General',
    description: 'Single-color utility, toolbar, and document icons.',
  },
  diagram: {
    id: 'diagram',
    title: 'Diagram',
    description: 'Diagram shapes, connectors, lifelines, and marker icons.',
  },
  multi: {
    id: 'multi',
    title: 'Multi',
    description: 'Multi-color document and product icons.',
  },
  shape: {
    id: 'shape',
    title: 'Shape',
    description: 'Drawing, connector, arrow, and chart shape icons.',
  },
  'stroke-size': {
    id: 'stroke-size',
    title: 'Stroke Size',
    description: 'Stroke, brush, and pen size preset icons.',
  },
} satisfies Record<IconSubgroupId, Omit<IconSubgroup, 'items'>>

export const subgroupOrder: IconSubgroupId[] = [
  'general',
  'shape',
  'diagram',
  'chart',
  'formula',
  'function',
  'currency',
  'stroke-size',
  'brand',
  'double',
  'multi',
]

export const productLabels: Record<string, string> = {
  bases: 'Bases',
  boards: 'Boards',
  common: 'Common',
  docs: 'Docs',
  pdf: 'PDF',
  sheets: 'Sheets',
  slides: 'Slides',
  univer: 'Univer',
}

export const comparisonFamilies = [
  { id: 'search', title: 'Search & zoom', icons: ['SearchIcon', 'ZoomInIcon', 'ZoomOutIcon'] },
  {
    id: 'references',
    title: 'Document references',
    icons: [
      'ReferenceContentsIcon',
      'ReferenceAddTextIcon',
      'ReferenceUpdateIcon',
      'ReferenceShowNotesIcon',
      'ReferenceCitationIcon',
      'ReferenceSourcesIcon',
      'ReferenceBibliographyIcon',
      'ReferenceCaptionIcon',
      'ReferenceFiguresIcon',
      'ReferenceCrossReferenceIcon',
      'ReferenceMarkEntryIcon',
      'ReferenceIndexIcon',
      'ReferenceMarkAuthorityIcon',
      'ReferenceAuthoritiesIcon',
    ],
  },
  {
    id: 'mind-layouts',
    title: 'Mind map layouts',
    icons: [
      'MindLayoutHorizontalIcon',
      'MindLayoutVerticalIcon',
      'MindTreeLeftIcon',
      'MindTreeRightIcon',
      'MindTreeAlternateIcon',
      'MindTimelineHorizontalIcon',
      'MindTimelineVerticalIcon',
    ],
  },
  {
    id: 'mind-branches',
    title: 'Mind map branches',
    icons: ['MindBranchCurveIcon', 'MindBranchRoundedOrthogonalIcon', 'MindBranchOrthogonalIcon'],
  },
  {
    id: 'shape-merge',
    title: 'Shape merging',
    icons: [
      'ShapeMergeIcon',
      'ShapeUnionIcon',
      'ShapeCombineIcon',
      'ShapeFragmentIcon',
      'ShapeIntersectIcon',
      'ShapeSubtractIcon',
    ],
  },
  {
    id: 'arrows',
    title: 'Arrows',
    icons: [
      'ArrowUpIcon',
      'ArrowDownIcon',
      'ArrowLeftIcon',
      'ArrowRightIcon',
      'ArrowTiltUpIcon',
      'ArrowTiltDownIcon',
    ],
  },
  {
    id: 'chevrons',
    title: 'Chevrons',
    icons: ['MoreUpIcon', 'MoreDownIcon', 'MoreLeftIcon', 'MoreRightIcon'],
  },
  {
    id: 'containers',
    title: 'Containers',
    icons: ['TableIcon', 'GridIcon', 'GridOutlineIcon', 'ShowToolbarIcon', 'CalendarIcon'],
  },
  {
    id: 'status',
    title: 'Status',
    icons: [
      'CheckMarkIcon',
      'SuccessIcon',
      'SuccessOutlineIcon',
      'InfoIcon',
      'HelpIcon',
      'ErrorIcon',
    ],
  },
  {
    id: 'charts',
    title: 'Charts',
    icons: [
      'ColumnChartIcon',
      'LineChartIcon',
      'HistogramChartIcon',
      'PieChartIcon',
      'ChordChartIcon',
      'SunburstChartIcon',
    ],
  },
  {
    id: 'formulas',
    title: 'Formulas',
    icons: [
      'FormulaFractionIcon',
      'FormulaMatrixIcon',
      'FormulaRadicalIcon',
      'FormulaLimitLogarithmIcon',
    ],
  },
]

export function getAllIcons(groups: IconGroup[]): IconEntry[] {
  return groups.flatMap((group) => group.subgroups.flatMap((subgroup) => subgroup.items))
}

export function getIconFileName(icon: IconEntry): string {
  const match = /([^/]+)\.svg$/.exec(icon.sourcePath)
  return match?.[1] ?? icon.name
}

export function getIconManifestPath(icon: IconEntry): string {
  const match = /(double|other|single)\/([^/]+\.svg)$/.exec(icon.sourcePath)
  return match ? `${match[1]}/${match[2]}` : icon.sourcePath
}

export function getAvailableProducts(groups: IconGroup[]): string[] {
  const counts = new Map<string, number>()

  for (const icon of getAllIcons(groups)) {
    for (const product of icon.products) {
      counts.set(product, (counts.get(product) ?? 0) + 1)
    }
  }

  return Array.from(counts.entries())
    .toSorted(([nameA, countA], [nameB, countB]) => countB - countA || nameA.localeCompare(nameB))
    .map(([name]) => name)
}

export function getFamilyIcons(groups: IconGroup[], names: string[]): IconEntry[] {
  const icons = new Map(
    groups.flatMap((group) =>
      group.subgroups.flatMap((subgroup) =>
        subgroup.items.map((icon) => [icon.name, icon] as const),
      ),
    ),
  )

  return names.map((name) => {
    const icon = icons.get(name)
    if (!icon) {
      throw new Error(`Missing family icon: ${name}`)
    }
    return icon
  })
}

export function filterIconGroups(groups: IconGroup[], searchTerm: string): IconSearchResult {
  const terms = normalizeSearchTerm(searchTerm)

  if (terms.length === 0) {
    return {
      groups,
      matchCount: getTotalIconCount(groups),
    }
  }

  const filteredGroups = groups.flatMap((group) => {
    const subgroups = group.subgroups.flatMap((subgroup) => {
      const items = subgroup.items.filter((icon) => matchesIconTerms(icon, terms))

      if (items.length === 0) {
        return []
      }

      return [{ ...subgroup, items }]
    })

    if (subgroups.length === 0) {
      return []
    }

    return [{ ...group, subgroups }]
  })

  return {
    groups: filteredGroups,
    matchCount: getTotalIconCount(filteredGroups),
  }
}

export function filterIconCatalogue(
  groups: IconGroup[],
  filters: IconFilterOptions,
  recentVersions: ReadonlySet<string>,
): IconSearchResult {
  const terms = normalizeSearchTerm(filters.searchTerm)

  const filteredGroups = groups.flatMap((group) => {
    if (filters.group !== 'all' && group.id !== filters.group) {
      return []
    }

    const subgroups = group.subgroups.flatMap((subgroup) => {
      if (filters.subgroup !== 'all' && subgroup.id !== filters.subgroup) {
        return []
      }

      const items = subgroup.items.filter((icon) =>
        matchesFilters(icon, filters, terms, recentVersions),
      )

      if (items.length === 0) {
        return []
      }

      return [{ ...subgroup, items }]
    })

    if (subgroups.length === 0) {
      return []
    }

    return [{ ...group, subgroups }]
  })

  return {
    groups: filteredGroups,
    matchCount: getTotalIconCount(filteredGroups),
  }
}

export function getCatalogueFacetCounts(
  groups: IconGroup[],
  filters: IconFilterOptions,
  recentVersions: ReadonlySet<string>,
): CatalogueFacetCounts {
  const terms = normalizeSearchTerm(filters.searchTerm)

  const groupCounts: Record<IconGroupId | 'all', number> = {
    all: 0,
    double: 0,
    multi: 0,
    single: 0,
  }
  const subgroupCounts = Object.fromEntries([
    ['all', 0],
    ...subgroupOrder.map((id) => [id, 0]),
  ]) as Record<IconSubgroupId | 'all', number>
  const productCounts: Record<string, number> = { all: 0 }
  const strokeCounts: Record<StrokeFilter, number> = {
    all: 0,
    full: 0,
    none: 0,
  }
  let recentCount = 0

  for (const group of groups) {
    for (const subgroup of group.subgroups) {
      for (const icon of subgroup.items) {
        if (terms.length > 0 && !matchesIconTerms(icon, terms)) {
          continue
        }

        const matchesGroup = filters.group === 'all' || group.id === filters.group
        const matchesSubgroup = filters.subgroup === 'all' || subgroup.id === filters.subgroup
        const matchesProduct =
          filters.product === 'all' || icon.products.includes(filters.product as never)
        const matchesStroke = matchesStrokeSupport(icon, filters.strokeSupport)
        const isRecent = isRecentIconVersion(icon, recentVersions)
        const matchesRecent = !filters.recentOnly || isRecent

        if (matchesSubgroup && matchesProduct && matchesStroke && matchesRecent) {
          groupCounts.all += 1
          groupCounts[group.id] += 1
        }

        if (matchesGroup && matchesProduct && matchesStroke && matchesRecent) {
          subgroupCounts.all += 1
          subgroupCounts[subgroup.id] += 1
        }

        if (matchesGroup && matchesSubgroup && matchesStroke && matchesRecent) {
          productCounts.all += 1
          for (const product of icon.products) {
            productCounts[product] = (productCounts[product] ?? 0) + 1
          }
        }

        if (matchesGroup && matchesSubgroup && matchesProduct && matchesRecent) {
          strokeCounts.all += 1
          if (icon.preserveStrokeWidthSupport === 'full') {
            strokeCounts.full += 1
          } else {
            strokeCounts.none += 1
          }
        }

        if (matchesGroup && matchesSubgroup && matchesProduct && matchesStroke && isRecent) {
          recentCount += 1
        }
      }
    }
  }

  return {
    groups: groupCounts,
    products: productCounts,
    recent: recentCount,
    strokeSupport: strokeCounts,
    subgroups: subgroupCounts,
  }
}

export function getTotalIconCount(groups: IconGroup[]) {
  return groups.reduce((count, group) => count + getGroupIconCount(group), 0)
}

export function getGroupIconCount(group: IconGroup) {
  return group.subgroups.reduce((count, subgroup) => count + subgroup.items.length, 0)
}

export function getRecentIconVersions(groups: IconGroup[], limit = 3) {
  const versions = new Set<string>()

  groups.forEach((group) => {
    group.subgroups.forEach((subgroup) => {
      subgroup.items.forEach((icon) => {
        if (icon.updatedVer) {
          versions.add(icon.updatedVer)
        }
      })
    })
  })

  return Array.from(versions).toSorted(compareIconVersions).slice(0, limit)
}

export function isRecentIconVersion(icon: IconEntry, recentVersions: ReadonlySet<string>) {
  return Boolean(icon.updatedVer && recentVersions.has(icon.updatedVer))
}

function normalizeSearchTerm(searchTerm: string) {
  return searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean)
}

function matchesFilters(
  icon: IconEntry,
  filters: IconFilterOptions,
  terms: string[],
  recentVersions: ReadonlySet<string>,
) {
  if (filters.product !== 'all' && !icon.products.includes(filters.product as never)) {
    return false
  }

  if (!matchesStrokeSupport(icon, filters.strokeSupport)) {
    return false
  }

  if (filters.recentOnly && !isRecentIconVersion(icon, recentVersions)) {
    return false
  }

  if (terms.length > 0 && !matchesIconTerms(icon, terms)) {
    return false
  }

  return true
}

function matchesStrokeSupport(icon: IconEntry, strokeSupport: StrokeFilter) {
  if (strokeSupport === 'all') {
    return true
  }

  if (strokeSupport === 'full') {
    return icon.preserveStrokeWidthSupport === 'full'
  }

  return icon.preserveStrokeWidthSupport !== 'full'
}

function matchesIconTerms(icon: IconEntry, terms: string[]) {
  const searchableText = [
    icon.name,
    getIconFileName(icon),
    icon.category,
    icon.description,
    icon.group,
    icon.role,
    icon.sourcePath,
    icon.updatedVer ?? '',
    icon.preserveStrokeWidthSupport === 'full' ? 'preserveStrokeWidth Preserve stroke width' : '',
    ...icon.aliases,
    ...icon.keywords,
    ...icon.products,
  ]
    .join(' ')
    .toLowerCase()

  return terms.every((term) => searchableText.includes(term))
}

function compareIconVersions(versionA: string, versionB: string) {
  if (versionA === versionB) {
    return 0
  }

  if (versionA === 'unreleased') {
    return -1
  }

  if (versionB === 'unreleased') {
    return 1
  }

  const partsA = parseVersion(versionA)
  const partsB = parseVersion(versionB)

  for (let index = 0; index < Math.max(partsA.length, partsB.length); index++) {
    const diff = (partsB[index] ?? 0) - (partsA[index] ?? 0)

    if (diff !== 0) {
      return diff
    }
  }

  return versionA.localeCompare(versionB)
}

function parseVersion(version: string) {
  return version.split('.').map((part) => Number.parseInt(part, 10) || 0)
}
