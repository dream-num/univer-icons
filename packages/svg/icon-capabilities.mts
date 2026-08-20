import type { ElementNode, Node } from 'svg-parser'
import { parse } from 'svg-parser'

export type PreserveStrokeWidthSupport = 'full' | 'none' | 'partial'

type PaintContext = {
  color: string
  fill: string
  fillOpacity: number
  hasUnsupportedEffect: boolean
  stroke: string
  strokeOpacity: number
  strokeWidth: string
  visibility: string
}

type PaintSummary = {
  hasFill: boolean
  hasStroke: boolean
  hasUnknownArtwork: boolean
  hasUnsupportedStroke: boolean
}

const GRAPHICS_TAGS = new Set([
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'text',
  'textPath',
  'tspan',
])
const GRAPHICS_WITHOUT_FILL_AREA = new Set(['line'])
const NON_RENDERING_TAGS = new Set([
  'clipPath',
  'defs',
  'desc',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'pattern',
  'radialGradient',
  'stop',
  'style',
  'symbol',
  'title',
])
const UNKNOWN_ARTWORK_TAGS = new Set(['foreignObject', 'image', 'use'])
const UNSUPPORTED_EFFECT_PROPERTIES = [
  'clip-path',
  'filter',
  'marker',
  'marker-end',
  'marker-mid',
  'marker-start',
  'mask',
]
const DEFAULT_PAINT_CONTEXT: PaintContext = {
  color: 'black',
  fill: 'black',
  fillOpacity: 1,
  hasUnsupportedEffect: false,
  stroke: 'none',
  strokeOpacity: 1,
  strokeWidth: '1',
  visibility: 'visible',
}

/**
 * Reports whether every visible part of an SVG can preserve its authored stroke width.
 * The result is intentionally conservative so the docs only promise full support when
 * viewport-relative stroke compensation is sufficient for the entire icon.
 */
export function getPreserveStrokeWidthSupport(svg: string): PreserveStrokeWidthSupport {
  const summary: PaintSummary = {
    hasFill: false,
    hasStroke: false,
    hasUnknownArtwork: false,
    hasUnsupportedStroke: false,
  }

  parse(svg).children.forEach((node) => analyzeNode(node, DEFAULT_PAINT_CONTEXT, summary))

  if (!summary.hasStroke) {
    return 'none'
  }

  if (summary.hasFill || summary.hasUnknownArtwork || summary.hasUnsupportedStroke) {
    return 'partial'
  }

  return 'full'
}

function analyzeNode(node: Node | string, parent: PaintContext, summary: PaintSummary) {
  if (typeof node === 'string' || node.type !== 'element') {
    return
  }

  const tagName = node.tagName ?? ''

  if (NON_RENDERING_TAGS.has(tagName) || getPresentationValue(node, 'display') === 'none') {
    return
  }

  const opacity = getOpacity(node, 'opacity', 1)

  if (opacity === 0) {
    return
  }

  const context = createPaintContext(node, parent)
  const isVisible = context.visibility !== 'hidden' && context.visibility !== 'collapse'

  if (UNKNOWN_ARTWORK_TAGS.has(tagName) && isVisible) {
    summary.hasUnknownArtwork = true
  }

  if (GRAPHICS_TAGS.has(tagName) && isVisible) {
    const hasFill =
      !GRAPHICS_WITHOUT_FILL_AREA.has(tagName) &&
      context.fillOpacity > 0 &&
      isVisiblePaint(context.fill, context.color)
    const hasStroke =
      context.strokeOpacity > 0 &&
      !isZeroLength(context.strokeWidth) &&
      isVisiblePaint(context.stroke, context.color)

    summary.hasFill ||= hasFill
    summary.hasStroke ||= hasStroke

    if (hasStroke && (context.hasUnsupportedEffect || isUrlPaint(context.stroke))) {
      summary.hasUnsupportedStroke = true
    }
  }

  node.children.forEach((child) => analyzeNode(child, context, summary))
}

function createPaintContext(node: ElementNode, parent: PaintContext): PaintContext {
  return {
    color: getInheritedPaint(node, 'color', parent.color, 'black'),
    fill: getInheritedPaint(node, 'fill', parent.fill, 'black'),
    fillOpacity: getOpacity(node, 'fill-opacity', parent.fillOpacity),
    hasUnsupportedEffect: parent.hasUnsupportedEffect || hasUnsupportedEffect(node),
    stroke: getInheritedPaint(node, 'stroke', parent.stroke, 'none'),
    strokeOpacity: getOpacity(node, 'stroke-opacity', parent.strokeOpacity),
    strokeWidth: getInheritedPaint(node, 'stroke-width', parent.strokeWidth, '1'),
    visibility: getInheritedPaint(node, 'visibility', parent.visibility, 'visible'),
  }
}

function getInheritedPaint(
  node: ElementNode,
  property: string,
  inheritedValue: string,
  initialValue: string,
) {
  const value = getPresentationValue(node, property)

  if (value === undefined || value === 'inherit' || value === 'unset') {
    return inheritedValue
  }

  if (value === 'initial' || value === 'revert') {
    return initialValue
  }

  return value
}

function getOpacity(node: ElementNode, property: string, inheritedValue: number) {
  const value = getPresentationValue(node, property)

  if (value === undefined || value === 'inherit' || value === 'unset') {
    return inheritedValue
  }

  if (value === 'initial' || value === 'revert') {
    return 1
  }

  const parsedValue = value.endsWith('%')
    ? Number.parseFloat(value) / 100
    : Number.parseFloat(value)

  return Number.isFinite(parsedValue) ? Math.max(0, Math.min(1, parsedValue)) : inheritedValue
}

function getPresentationValue(node: ElementNode, property: string) {
  const style = parseStyle(node.properties?.style)
  const value = style.get(property) ?? node.properties?.[property]

  return value === undefined ? undefined : `${value}`.trim().toLowerCase()
}

function parseStyle(style: string | number | undefined) {
  const declarations = new Map<string, string>()

  if (typeof style !== 'string') {
    return declarations
  }

  style.split(';').forEach((declaration) => {
    const separatorIndex = declaration.indexOf(':')

    if (separatorIndex === -1) {
      return
    }

    const property = declaration.slice(0, separatorIndex).trim().toLowerCase()
    const value = declaration
      .slice(separatorIndex + 1)
      .trim()
      .toLowerCase()

    if (property) {
      declarations.set(property, value)
    }
  })

  return declarations
}

function hasUnsupportedEffect(node: ElementNode) {
  return UNSUPPORTED_EFFECT_PROPERTIES.some((property) => {
    const value = getPresentationValue(node, property)

    return value !== undefined && value !== 'none'
  })
}

function isVisiblePaint(value: string, color: string) {
  const resolvedValue = value === 'currentcolor' ? color : value

  if (resolvedValue === 'none' || resolvedValue === 'transparent') {
    return false
  }

  if (/^#[\da-f]{4}$/i.test(resolvedValue) || /^#[\da-f]{8}$/i.test(resolvedValue)) {
    return !resolvedValue.endsWith('00')
  }

  const alphaMatch = /^(?:hsla|rgba)\([^)]*[,/]\s*(?<alpha>[\d.]+)%?\s*\)$/i.exec(resolvedValue)

  return alphaMatch ? Number.parseFloat(alphaMatch.groups?.alpha ?? '1') !== 0 : true
}

function isUrlPaint(value: string) {
  return /\burl\s*\(/i.test(value)
}

function isZeroLength(value: string) {
  return /^[-+]?0*(?:\.0+)?(?:[a-z%]+)?$/i.test(value)
}
