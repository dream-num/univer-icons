export type IconEntry = {
  component: unknown
  name: string
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

export function createIconGroups(iconModule: Record<string, unknown>): IconGroup[] {
  const groupedEntries = new Map<IconSubgroupId, IconEntry[]>()

  Object.keys(subgroupMeta).forEach((id) => groupedEntries.set(id as IconSubgroupId, []))

  Object.entries(iconModule)
    .filter(([name, component]) => name.endsWith('Icon') && Boolean(component))
    .toSorted(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .forEach(([name, component]) => {
      groupedEntries.get(getIconSubgroupId(name))?.push({ component, name })
    })

  return groupMeta.map((group) => ({
    ...group,
    subgroups: getSubgroupIds(group.id).map((id) => ({
      ...subgroupMeta[id],
      items: groupedEntries.get(id) ?? [],
    })),
  }))
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

function getIconSubgroupId(name: string): IconSubgroupId {
  if (name.endsWith('DoubleIcon')) {
    return 'double'
  }

  if (name.endsWith('MultiIcon')) {
    return 'multi'
  }

  if (name.startsWith('Shape')) {
    return 'shape'
  }

  return 'general'
}

function getSubgroupIds(groupId: IconGroupId): IconSubgroupId[] {
  if (groupId === 'single') {
    return ['general', 'shape']
  }

  return [groupId]
}

function normalizeSearchTerm(searchTerm: string) {
  return searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean)
}

function matchesIconName(name: string, terms: string[]) {
  const normalizedName = name.toLowerCase()

  return terms.every((term) => normalizedName.includes(term))
}
