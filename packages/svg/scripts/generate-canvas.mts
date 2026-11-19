import type { ElementNode } from 'svg-parser'
import type { ICanvasIcon, ICanvasIconPath } from '../ts/canvas-geometry.ts'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { parse } from 'svg-parser'

// Only these assets are used by synchronous Canvas renderers.
const icons = [
  'double/cell-0-double',
  'double/cell-100-double',
  'double/cell-25-double',
  'double/cell-50-double',
  'double/cell-75-double',
  'double/correct-double',
  'double/dissatisfied-double',
  'double/guffaw-double',
  'double/impatient-double',
  'double/indicate-double',
  'double/mistake-double',
  'double/noninductive-double',
  'double/progress-0-double',
  'double/progress-100-double',
  'double/progress-25-double',
  'double/progress-50-double',
  'double/progress-75-double',
  'double/signal-0-double',
  'double/signal-100-double',
  'double/signal-25-double',
  'double/signal-50-double',
  'double/signal-75-double',
  'double/smile-double',
  'double/star-empty-double',
  'double/star-full-double',
  'double/star-incomplete-double',
  'double/todo-list-double',
  'double/warn-double',
  'other/docs-multi',
  'other/pdf-multi',
  'other/sheets-multi',
  'other/slides-multi',
  'single/add-image',
  'single/arrow-down',
  'single/arrow-right',
  'single/arrow-tilt-down',
  'single/arrow-tilt-up',
  'single/arrow-up',
  'single/ascending',
  'single/attachment',
  'single/calendar',
  'single/chart',
  'single/check-mark',
  'single/checkbox',
  'single/clear-filter',
  'single/close',
  'single/created-at',
  'single/created-by',
  'single/cross',
  'single/descending',
  'single/down',
  'single/email',
  'single/exclamation',
  'single/expand',
  'single/filter-applied',
  'single/filter-options',
  'single/filter-sort-ascending',
  'single/filter-sort-descending',
  'single/flag',
  'single/group',
  'single/increase',
  'single/link',
  'single/more-down',
  'single/more-up',
  'single/order',
  'single/person',
  'single/phone',
  'single/record',
  'single/relationship',
  'single/rhomboid',
  'single/roundness',
  'single/single-select',
  'single/table',
  'single/triangle',
  'single/up',
  'single/updated-at',
  'single/updated-by',
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
  'cx',
  'cy',
  'r',
])

function elements(node: ElementNode): ElementNode[] {
  return node.children.filter(
    (child): child is ElementNode => typeof child !== 'string' && child.type === 'element',
  )
}

function rectangle(node: ElementNode): string {
  const { x = 0, y = 0, width, height, rx = 0, ry = rx } = node.properties!
  const [left, top, w, h] = [x, y, width, height].map(Number)
  assert.ok([left, top, w, h].every(Number.isFinite) && w > 0 && h > 0)
  const r = Math.min(Number(rx), w / 2)
  const s = Math.min(Number(ry), h / 2)
  assert.ok(Number.isFinite(r) && r >= 0 && Number.isFinite(s) && s >= 0)
  if (!r || !s) return `M${left} ${top}h${w}v${h}h-${w}Z`
  return `M${left + r} ${top}h${w - 2 * r}a${r} ${s} 0 0 1 ${r} ${s}v${h - 2 * s}a${r} ${s} 0 0 1 -${r} ${s}h${2 * r - w}a${r} ${s} 0 0 1 -${r} -${s}v${2 * s - h}a${r} ${s} 0 0 1 ${r} -${s}Z`
}

function paint(value: string | number | undefined) {
  if (value === 'none') return undefined
  if (value === 'black' || value === '#000' || value === 'currentColor') return 'black'
  assert.ok(
    typeof value === 'string' && /^(?:white|#[a-f\d]{6})$/i.test(value),
    `Unsupported paint: ${value}`,
  )
  return value
}

export function compileCanvasIcon(svg: string, source: string): ICanvasIcon {
  const root = parse(svg).children[0] as ElementNode
  const [x, y, width, height] = String(root.properties!.viewBox).split(/\s+/).map(Number)
  assert.ok(x === 0 && y === 0 && width > 0 && height > 0, source)
  const paths: ICanvasIconPath[] = []
  const children = elements(root)
  const clips = new Map<string, string>()
  const definitions = children.flatMap((node) =>
    node.tagName === 'defs' ? elements(node) : node.tagName === 'mask' ? [node] : [],
  )
  for (const def of definitions) {
    assert.ok(def.tagName === 'clipPath' || def.tagName === 'mask', source)
    const attrs = def.properties ?? {}
    const isMask = def.tagName === 'mask'
    const allowed = isMask
      ? ['id', 'maskUnits', 'x', 'y', 'width', 'height']
      : ['id', 'clipPathUnits']
    assert.ok(
      typeof attrs.id === 'string' && Object.keys(attrs).every((key) => allowed.includes(key)),
      source,
    )
    assert.ok(!attrs.clipPathUnits || attrs.clipPathUnits === 'userSpaceOnUse', source)
    const [rect] = elements(def)
    assert.ok(elements(def).length === 1 && rect.tagName === 'rect', source)
    const props = rect.properties!
    const rectAttrs = isMask
      ? ['x', 'y', 'width', 'height', 'fill']
      : ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'transform']
    assert.ok(
      Object.keys(props).every((key) => rectAttrs.includes(key)),
      source,
    )
    if (isMask) {
      // A solid white rectangle with matching mask bounds is a rectangular clip.
      assert.ok(attrs.maskUnits === 'userSpaceOnUse' && props.fill === 'white', source)
      assert.equal(rectangle(def), rectangle(rect), source)
    }
    if (props.transform) {
      const translate = /^translate\(([-\d.]+)\)$/.exec(String(props.transform))
      assert.ok(translate, source)
      props.x = Number(props.x ?? 0) + Number(translate[1])
    }
    clips.set(`url(#${attrs.id})`, rectangle(rect))
  }

  function read(
    node: ElementNode,
    inherited: NonNullable<ElementNode['properties']>,
    clip?: string,
  ) {
    const { mask, ['clip-path']: clipPath, ...properties } = node.properties ?? {}
    const a = { ...inherited, ...properties }
    const reference = mask ?? clipPath
    if (reference) {
      assert.ok(!clip && !(mask && clipPath) && clips.has(String(reference)), source)
      clip = clips.get(String(reference))
    }
    assert.ok(
      Object.keys(a).every((key) => supportedAttributes.has(key)),
      `Unsupported SVG attributes in ${source}: ${Object.keys(a)}`,
    )
    if (node.tagName === 'g') {
      elements(node).forEach((child) => read(child, a, clip))
      return
    }
    let d: string
    switch (node.tagName) {
      case 'path':
        d = String(a.d ?? '')
        break
      case 'rect':
        d = rectangle(node)
        break
      case 'circle': {
        const radius = Number(a.r)
        const cx = Number(a.cx ?? 0)
        const cy = Number(a.cy ?? 0)
        assert.ok(radius > 0 && Number.isFinite(cx) && Number.isFinite(cy), source)
        d = `M${cx + radius} ${cy}a${radius} ${radius} 0 1 0 ${-2 * radius} 0a${radius} ${radius} 0 1 0 ${2 * radius} 0Z`
        break
      }
      default:
        throw new Error(`Unsupported SVG element in ${source}: ${node.tagName}`)
    }
    assert.ok(d, source)
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
      clip,
      fill,
      stroke,
      fillRule: a['fill-rule'] as CanvasFillRule | undefined,
      strokeWidth,
      lineCap: a['stroke-linecap'] as CanvasLineCap | undefined,
      lineJoin: a['stroke-linejoin'] as CanvasLineJoin | undefined,
    })
  }
  for (const node of children) {
    if (node.tagName !== 'defs' && node.tagName !== 'mask') read(node, root.properties!)
  }
  assert.ok(paths.length, source)
  return { width, height, paths }
}

if (import.meta.main) {
  const data = Object.fromEntries(
    icons.map((file) => {
      const svg = readFileSync(new URL(`../${file}-icon.svg`, import.meta.url), 'utf8')
      return [`${file.split('/')[1]}-icon`, compileCanvasIcon(svg, file)]
    }),
  )
  const names = Object.keys(data)
    .map((name) => JSON.stringify(name))
    .join(' | ')
  writeFileSync(
    new URL('../ts/canvas-icons.generated.ts', import.meta.url),
    `import type { ICanvasIcon } from './canvas-geometry.js'\nexport const canvasIcons: Record<${names}, ICanvasIcon> = ${JSON.stringify(data)}\n`,
  )
}
