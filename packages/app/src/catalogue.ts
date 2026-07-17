export type IconEntry = {
  aliases: string[]
  category: string
  description: string
  group: IconGroupId
  keywords: string[]
  name: string
  products: string[]
  role: string
  sourcePath: string
  svg: string
  updatedVer?: string
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
  | 'diagram'
  | 'double'
  | 'formula'
  | 'function'
  | 'general'
  | 'multi'
  | 'shape'
  | 'stroke-size'

export type IconSearchResult = {
  groups: IconGroup[]
  matchCount: number
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
      const items = subgroup.items.filter((icon) => matchesIcon(icon, terms))

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

function matchesIcon(icon: IconEntry, terms: string[]) {
  const searchableText = [
    icon.name,
    icon.category,
    icon.description,
    icon.group,
    icon.role,
    icon.sourcePath,
    icon.updatedVer ?? '',
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
