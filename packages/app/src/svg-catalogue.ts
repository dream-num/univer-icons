import manifest from '@univerjs/icons-svg/manifest' with { type: 'json' }
import type { IconEntry, IconGroup, IconGroupId, IconSubgroupId } from './catalogue.ts'
import { groupMeta, subgroupMeta } from './catalogue.ts'

type SvgGroupId = 'double' | 'other' | 'single'

const svgPathPattern = /(?:^|\/)(double|other|single)\/([^/]+)\.svg$/
const manifestIconBySource = createManifestIconMap()

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

  return groupMeta.map((group) =>
    Object.assign({}, group, {
      subgroups: getSubgroupIds(group.id).map((id) =>
        Object.assign({}, subgroupMeta[id], {
          items: groupedEntries.get(group.id)?.get(id) ?? [],
        }),
      ),
    }),
  )
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

  const manifestIcon = manifestIconBySource.get(`${rawGroup}/${fileName}.svg`)

  if (!manifestIcon) {
    throw new Error(
      `Missing manifest entry for ${rawGroup}/${fileName}.svg. Run pnpm build to refresh it.`,
    )
  }

  return {
    preserveStrokeWidthSupport: manifestIcon.preserveStrokeWidthSupport,
    group: getIconGroupId(rawGroup),
    name: manifestIcon.componentName,
    sourcePath,
    svg: normalizeSvg(svg),
    updatedVer: manifestIcon.updatedVer,
    aliases: manifestIcon.aliases,
    category: manifestIcon.category,
    description: manifestIcon.description,
    keywords: manifestIcon.keywords,
    products: manifestIcon.products,
    role: manifestIcon.role,
  }
}

function createManifestIconMap() {
  const entries = Object.values(manifest).flat()
  return new Map(entries.map((icon) => [`${icon.group}/${icon.name}.svg`, icon]))
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

  if (icon.category === 'currency') {
    return 'currency'
  }

  if (icon.group === 'multi') {
    return 'multi'
  }

  if (icon.category === 'chart') {
    return 'chart'
  }

  if (icon.keywords.includes('function-category')) {
    return 'function'
  }

  if (icon.keywords.includes('formula-menu')) {
    return 'formula'
  }

  if (icon.keywords.includes('stroke-size')) {
    return 'stroke-size'
  }

  if (
    icon.keywords.includes('diagram') &&
    (icon.products.includes('boards') || icon.products.includes('slides'))
  ) {
    return 'diagram'
  }

  if (icon.category === 'shape') {
    return 'shape'
  }

  return 'general'
}

function getSubgroupIds(groupId: IconGroupId): IconSubgroupId[] {
  if (groupId === 'single') {
    return [
      'general',
      'diagram',
      'stroke-size',
      'brand',
      'chart',
      'currency',
      'function',
      'formula',
      'shape',
    ]
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

export function scopeSvgIds(svg: string, prefix: string) {
  return svg
    .replace(/(\sid=["'])([^"']+)(["'])/g, `$1${prefix}-$2$3`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
    .replace(/(\s(?:xlink:)?href=["'])#([^"']+)(["'])/g, `$1#${prefix}-$2$3`)
}
