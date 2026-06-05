import { camelCase } from '#build/camel-case'

interface Attrs {
  style?: object | string
  [key: string]: string | number | object | undefined
}

export interface IconNode {
  tagName: string
  properties: Attrs
  children: IconNode[]
  [key: string]: unknown
}

interface IconElement {
  tag: string
  attrs: Attrs
  children?: IconElement[]
  defIds?: string[]
}

interface NormalizationContext {
  idReplacementSet: Set<string>
}

export function normalizeAST(name: string, roots: IconNode[]): string[] {
  const context = createNormalizationContext()
  const normalizedRoots = doNormalize(roots, context)

  normalizedRoots.forEach((root) => {
    addDefIds(root, context)
    normalizeWidthAndHeight(root)
  })

  return normalizedRoots.map((root) =>
    replaceIds(name, JSON.stringify(root), context.idReplacementSet),
  )
}

function createNormalizationContext(): NormalizationContext {
  return {
    idReplacementSet: new Set(),
  }
}

function doNormalize(roots: IconNode[], context: NormalizationContext): IconElement[] {
  return roots
    .map((node) => ({
      tag: node.tagName,
      attrs: node.properties,
      children: doNormalize(node.children, context),
    }))
    .map((node: IconElement) => {
      normalizeChildren(node)
      normalizeAttrs(node)
      normalizeDefinitions(node, context)
      return node
    })
}

function normalizeDefinitions(node: IconElement, context: NormalizationContext) {
  if (node.tag === 'defs') {
    node.children?.forEach((def) => {
      if (typeof def.attrs.id === 'string') {
        context.idReplacementSet.add(def.attrs.id)
      }
    })
  }
}

function normalizeAttrs(node: IconElement) {
  normalizeStyle(node)
  normalizeColor(node)
}

function normalizeWidthAndHeight(node: IconElement) {
  node.attrs.width = '1em'
  node.attrs.height = '1em'
}

function normalizeChildren(node: IconElement) {
  if (node.children?.length === 0) {
    delete node.children
  }
}

function addDefIds(root: IconElement, context: NormalizationContext) {
  const defIds = Array.from(context.idReplacementSet)
  if (defIds.length > 0) {
    root.defIds = defIds
  }
}

function replaceIds(name: string, str: string, set: Set<string>): string {
  return Array.from(set.keys()).reduce((parsed, currentToReplace) => {
    return parsed.replace(new RegExp(currentToReplace, 'g'), `${name}_${currentToReplace}`)
  }, str)
}

function normalizeStyle(node: IconElement) {
  const { attrs } = node
  const styleMap: { [k: string]: string } = {}

  if (typeof attrs.style === 'string') {
    const styles = attrs.style.split(';')
    styles.forEach((chunk) => {
      const [key, value] = chunk.split(':')
      if (key && value) {
        styleMap[camelCase(key.trim())] = value.trim()
      }
    })
    attrs.style = styleMap
  }
}

function normalizeColor(node: IconElement) {
  const { attrs } = node

  if (attrs.fill === '#000' || attrs.fill === '#000000' || attrs.fill === 'black') {
    attrs.fill = 'currentColor'
  }

  if (attrs.stroke === '#000' || attrs.stroke === '#000000' || attrs.stroke === 'black') {
    attrs.stroke = 'currentColor'
  }

  if (attrs.fill === '#E5E5E5') {
    attrs.fill = 'colorChannel1'
  }

  if (attrs.stroke === '#E5E5E5') {
    attrs.stroke = 'colorChannel1'
  }
}
