import { camelCase } from '#build/camel-case'

interface IAttrs {
  style?: object | string
  [key: string]: string | number | object | undefined
}

export interface IIconNode {
  tagName: string
  properties: IAttrs
  children: IIconNode[]
  [key: string]: unknown
}

interface IIconElement {
  tag: string
  attrs: IAttrs
  children?: IIconElement[]
  defIds?: string[]
}

interface INormalizationContext {
  idReplacementSet: Set<string>
}

export function normalizeAST(name: string, roots: IIconNode[]): string[] {
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

function createNormalizationContext(): INormalizationContext {
  return {
    idReplacementSet: new Set(),
  }
}

function doNormalize(roots: IIconNode[], context: INormalizationContext): IIconElement[] {
  return roots
    .map((node) => ({
      tag: node.tagName,
      attrs: node.properties,
      children: doNormalize(node.children, context),
    }))
    .map((node: IIconElement) => {
      normalizeChildren(node)
      normalizeAttrs(node)
      normalizeDefinitions(node, context)
      return node
    })
}

function normalizeDefinitions(node: IIconElement, context: INormalizationContext) {
  if (node.tag === 'defs') {
    node.children?.forEach((def) => {
      if (typeof def.attrs.id === 'string') {
        context.idReplacementSet.add(def.attrs.id)
      }
    })
  }
}

function normalizeAttrs(node: IIconElement) {
  normalizeStyle(node)
  normalizeColor(node)
}

function normalizeWidthAndHeight(node: IIconElement) {
  node.attrs.width = '1em'
  node.attrs.height = '1em'
}

function normalizeChildren(node: IIconElement) {
  if (node.children?.length === 0) {
    delete node.children
  }
}

function addDefIds(root: IIconElement, context: INormalizationContext) {
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

function normalizeStyle(node: IIconElement) {
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

function normalizeColor(node: IIconElement) {
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
