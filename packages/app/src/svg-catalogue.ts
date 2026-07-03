import {
  groupMeta,
  subgroupMeta,
  type IconEntry,
  type IconGroup,
  type IconGroupId,
  type IconSubgroupId,
} from './catalogue.ts'
import { createIconMetadata } from '../../svg/icon-metadata.mts'

type SvgGroupId = 'double' | 'other' | 'single'

const svgPathPattern = /(?:^|\/)(double|other|single)\/([^/]+)\.svg$/

export function createSvgIconGroups(svgModules: Record<string, string>): IconGroup[] {
  const groupedEntries = new Map<IconGroupId, Map<IconSubgroupId, IconEntry[]>>()

  groupMeta.forEach((group) => {
    groupedEntries.set(group.id, new Map(getSubgroupIds(group.id).map((id) => [id, []])))
  })

  Object.entries(svgModules)
    .map(([sourcePath, svg]) => createSvgIconEntry(sourcePath, svg))
    .filter((entry): entry is IconEntry => Boolean(entry))
    .toSorted((iconA, iconB) => iconA.name.localeCompare(iconB.name))
    .forEach((icon) => {
      groupedEntries.get(icon.group)?.get(getIconSubgroupId(icon))?.push(icon)
    })

  return groupMeta.map((group) => ({
    ...group,
    subgroups: getSubgroupIds(group.id).map((id) => ({
      ...subgroupMeta[id],
      items: groupedEntries.get(group.id)?.get(id) ?? [],
    })),
  }))
}

function createSvgIconEntry(sourcePath: string, svg: string): IconEntry | null {
  const match = svgPathPattern.exec(sourcePath)

  if (!match) {
    return null
  }

  const [, rawGroup, fileName] = match

  if (!isSvgGroupId(rawGroup) || !fileName) {
    return null
  }

  return {
    group: getIconGroupId(rawGroup),
    name: getComponentName(fileName),
    sourcePath,
    svg: normalizeSvg(svg),
    ...createIconMetadata(fileName, rawGroup),
  }
}

function getComponentName(fileName: string) {
  return fileName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function getIconGroupId(group: SvgGroupId): IconGroupId {
  return group === 'other' ? 'multi' : group
}

function isSvgGroupId(group: string | undefined): group is SvgGroupId {
  return group === 'double' || group === 'other' || group === 'single'
}

function getIconSubgroupId(icon: IconEntry): IconSubgroupId {
  if (icon.group === 'double') {
    return 'double'
  }

  if (icon.category === 'brand') {
    return 'brand'
  }

  if (icon.group === 'multi') {
    return 'multi'
  }

  if (icon.category === 'chart') {
    return 'chart'
  }

  if (icon.category === 'shape') {
    return 'shape'
  }

  return 'general'
}

function getSubgroupIds(groupId: IconGroupId): IconSubgroupId[] {
  if (groupId === 'single') {
    return ['general', 'brand', 'chart', 'shape']
  }

  if (groupId === 'multi') {
    return ['brand', 'multi']
  }

  return [groupId]
}

function normalizeSvg(svg: string) {
  return normalizeSvgSize(svg.trim())
    .replace(/\b(fill|stroke)="(?:#000|#000000|black)"/gi, '$1="currentColor"')
    .replace(/\b(fill|stroke)="#E5E5E5"/g, '$1="var(--icon-color-channel-1)"')
}

function normalizeSvgSize(svg: string) {
  return svg.replace(/<svg\b([^>]*)>/, (_match, attributes: string) => {
    const attributesWithoutSize = attributes.replace(/\s(?:width|height)="[^"]*"/g, '')

    return `<svg${attributesWithoutSize} width="1em" height="1em">`
  })
}
