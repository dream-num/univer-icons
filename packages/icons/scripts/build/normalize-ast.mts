import { camelCase } from '#build/camel-case'

interface IAttrs {
  style: object | string

  [key: string]: string | object
}

export interface IIconNode {
  tagName: string
  properties: IAttrs
  children: IIconNode[]

  [key: string]: any
}

interface IIconElement {
  tag: string
  attrs: IAttrs
  style?: React.CSSProperties
  children?: IIconElement[]
  defIds?: string[]
}

interface INormalizationContext {
  idReplacementSet: Set<string>
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
  const { attrs } = node

  Object.keys(attrs).forEach((key) => {
    if (key.includes('-')) {
      attrs[camelCase(key)] = attrs[key]
      delete attrs[key]
    }
  })

  normalizeStyle(node)
  normalizeClassName(node)
  normalizeColor(node)
}

function createNormalizationContext(): INormalizationContext {
  return {
    idReplacementSet: new Set(),
  }
}

/**
 * map svg-parser ast to React element, so it would be convenient to render
 */
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

function normalizeWidthAndHeight(node: IIconElement) {
  const { attrs } = node
  attrs.width = '1em'
  attrs.height = '1em'
}

function normalizeChildren(node: IIconElement) {
  if (node.children?.length === 0) {
    delete node.children
  }
}

function addDefIds(root: IIconElement, context: INormalizationContext) {
  const defIds = Array.from(context.idReplacementSet)
  if (defIds.length === 0) return
  root.defIds = defIds
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
      styleMap[camelCase(key)] = value
    })
    attrs.style = styleMap
  }
}

function normalizeClassName(node: IIconElement) {
  const { attrs } = node

  if (attrs.class) {
    // React use className instead of class
    attrs.className = attrs.class
    delete attrs.class
  }
}

export function normalizeAST(name: string, roots: IIconNode[]): string[] {
  const context = createNormalizationContext()
  const normalizedRoots = doNormalize(roots, context)

  normalizedRoots.forEach((root) => {
    addDefIds(root, context)
  })

  normalizedRoots.forEach((root) => {
    normalizeWidthAndHeight(root)
  })

  return normalizedRoots.map((root) =>
    replaceIds(name, JSON.stringify(root), context.idReplacementSet),
  )
}

/**
 * for single colored icons, we assume that #000 is placeholder for 'currentColor'
 * for multi colored icons, we assume that #E5E5E5 is placeholder for 'colorChannel1'
 */
function normalizeColor(node: IIconElement) {
  const { attrs } = node

  // replace black with currentColor
  if (attrs.fill === '#000' || attrs.fill === '#000000' || attrs.fill === 'black') {
    attrs.fill = 'currentColor'
  }

  if (attrs.stroke === '#000' || attrs.stroke === '#000000' || attrs.stroke === 'black') {
    attrs.stroke = 'currentColor'
  }

  // replace colorChannel1 with customized color
  if (attrs.fill === '#E5E5E5') {
    attrs.fill = 'colorChannel1'
  }

  if (attrs.stroke === '#E5E5E5') {
    attrs.stroke = 'colorChannel1'
  }
}
