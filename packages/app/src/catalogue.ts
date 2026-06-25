export type IconEntry = {
  group: IconGroupId
  name: string
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

export type IconSubgroupId = 'double' | 'general' | 'multi' | 'shape'

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
  double: {
    id: 'double',
    title: 'Double',
    description: 'Icons with a secondary color channel.',
  },
  general: {
    id: 'general',
    title: 'General',
    description: 'Single-color utility, toolbar, and document icons.',
  },
  multi: {
    id: 'multi',
    title: 'Multi',
    description: 'Multi-color document and product icons.',
  },
  shape: {
    id: 'shape',
    title: 'Shape',
    description: 'Drawing, connector, callout, arrow, and chart shape icons.',
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
      const items = subgroup.items.filter((icon) => matchesIconName(icon.name, terms))

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

function normalizeSearchTerm(searchTerm: string) {
  return searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean)
}

function matchesIconName(name: string, terms: string[]) {
  const normalizedName = name.toLowerCase()

  return terms.every((term) => normalizedName.includes(term))
}
