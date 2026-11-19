import type { ElementNode } from 'svg-parser'
import type { ICanvasIcon, ICanvasIconPath } from '../ts/canvas.cts'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { parse } from 'svg-parser'

// Only these assets are used by synchronous Canvas renderers.
const icons = [
  'single/add-image',
  'single/arrow-down',
  'single/arrow-up',
  'single/ascending',
  'single/attachment',
  'single/calendar',
  'single/chart',
  'single/checkbox',
  'single/created-at',
  'single/created-by',
  'single/descending',
  'single/email',
  'single/filter-applied',
  'single/filter-options',
  'single/filter-sort-ascending',
  'single/filter-sort-descending',
  'single/group',
  'single/increase',
  'single/link',
  'single/more-down',
  'single/order',
  'single/person',
  'single/phone',
  'single/record',
  'single/relationship',
  'single/single-select',
  'single/table',
  'single/updated-at',
  'single/updated-by',
  'double/todo-list-double',
]

const supportedAttributes = new Set([
  'width',
  'height',
  'viewBox',
  'xmlns',
  'fill',
  'stroke',
  'd',
  'x',
  'y',
  'rx',
  'ry',
  'fill-rule',
  'clip-rule',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'clip-path',
])

function elements(node: ElementNode): ElementNode[] {
  return node.children.filter(
    (child): child is ElementNode => typeof child !== 'string' && child.type === 'element',
  )
}

function rectangle(node: ElementNode): string {
  const { x = 0, y = 0, width, height, rx = 0, ry = rx } = node.properties!
  const [left, top, w, h] = [x, y, width, height].map(Number)
  assert.ok(w > 0 && h > 0)
  const r = Math.min(Number(rx), w / 2)
  const s = Math.min(Number(ry), h / 2)
  if (!r || !s) return `M${left} ${top}h${w}v${h}h-${w}Z`
  return `M${left + r} ${top}h${w - 2 * r}a${r} ${s} 0 0 1 ${r} ${s}v${h - 2 * s}a${r} ${s} 0 0 1 -${r} ${s}h${2 * r - w}a${r} ${s} 0 0 1 -${r} -${s}v${2 * s - h}a${r} ${s} 0 0 1 ${r} -${s}Z`
}

function paint(value: string | number | undefined) {
  if (value === 'none') return undefined
  if (value === '#E5E5E5') return 'accent'
  assert.ok(
    value === 'black' || value === '#000' || value === 'currentColor',
    `Unsupported paint: ${value}`,
  )
  return 'main'
}

export function compileCanvasIcon(svg: string, source: string): ICanvasIcon {
  const root = parse(svg).children[0] as ElementNode
  const [x, y, width, height] = String(root.properties!.viewBox).split(/\s+/).map(Number)
  assert.ok(x === 0 && y === 0 && width > 0 && height > 0, source)
  const paths: ICanvasIconPath[] = []
  const data: ICanvasIcon = { width, height, paths }
  const children = elements(root)
  const defs = children.find((n) => n.tagName === 'defs')
  const groups = children.filter((n) => n.tagName !== 'defs')
  if (defs) {
    const clip = elements(defs)[0]
    assert.ok(elements(defs).length === 1 && clip.tagName === 'clipPath', source)
    const rect = elements(clip)[0]
    assert.ok(
      groups.length === 1 && groups[0].properties?.['clip-path'] === `url(#${clip.properties?.id})`,
      source,
    )
    assert.ok(elements(clip).length === 1 && rect.tagName === 'rect', source)
    const transform = rect.properties?.transform
    if (transform) {
      const translate = /^translate\(([-\d.]+)\)$/.exec(String(transform))
      assert.ok(translate, source)
      rect.properties!.x = Number(rect.properties?.x ?? 0) + Number(translate[1])
    }
    data.clip = rectangle(rect)
  }

  function read(node: ElementNode, inherited: NonNullable<ElementNode['properties']>) {
    const a = { ...inherited, ...node.properties }
    if (node.tagName === 'g') {
      elements(node).forEach((child) => read(child, a))
      return
    }
    assert.ok(node.tagName === 'path' || node.tagName === 'rect', `${source}: ${node.tagName}`)
    assert.ok(
      Object.keys(a).every((key) => supportedAttributes.has(key)),
      `Unsupported SVG attributes in ${source}: ${Object.keys(a)}`,
    )
    const d = node.tagName === 'rect' ? rectangle(node) : String(a.d ?? '')
    assert.ok(d, source)
    assert.ok(!a['clip-path'] || data.clip, source)
    const fill = paint(a.fill ?? 'black')
    const stroke = paint(a.stroke ?? 'none')
    const strokeWidth = stroke ? Number(a['stroke-width'] ?? 1) : undefined
    assert.ok(
      strokeWidth === undefined || (Number.isFinite(strokeWidth) && strokeWidth > 0),
      source,
    )
    assert.ok(!a['fill-rule'] || ['nonzero', 'evenodd'].includes(String(a['fill-rule'])), source)
    assert.ok(
      !a['stroke-linecap'] || ['butt', 'round', 'square'].includes(String(a['stroke-linecap'])),
      source,
    )
    assert.ok(
      !a['stroke-linejoin'] || ['miter', 'round', 'bevel'].includes(String(a['stroke-linejoin'])),
      source,
    )
    paths.push({
      d,
      fill,
      stroke,
      fillRule: a['fill-rule'] as CanvasFillRule | undefined,
      strokeWidth,
      lineCap: a['stroke-linecap'] as CanvasLineCap | undefined,
      lineJoin: a['stroke-linejoin'] as CanvasLineJoin | undefined,
    })
  }
  groups.forEach((node) => read(node, root.properties!))
  assert.ok(paths.length, source)
  return data
}

if (import.meta.main) {
  const output = new URL('../canvas/', import.meta.url)
  rmSync(output, { recursive: true, force: true })
  mkdirSync(output, { recursive: true })
  for (const file of icons) {
    const svg = readFileSync(new URL(`../${file}-icon.svg`, import.meta.url), 'utf8')
    const icon = compileCanvasIcon(svg, file)
    writeFileSync(
      new URL(`${file.split('/')[1]}-icon.cjs`, output),
      `module.exports = ${JSON.stringify(icon)}\n`,
    )
  }
}
