import { canvasIcons } from './canvas-icons.generated.js'

export type CanvasIconName = keyof typeof canvasIcons

type CanvasContext = Pick<
  CanvasRenderingContext2D,
  | 'clip'
  | 'fill'
  | 'fillStyle'
  | 'lineCap'
  | 'lineJoin'
  | 'lineWidth'
  | 'restore'
  | 'save'
  | 'scale'
  | 'stroke'
  | 'strokeStyle'
  | 'translate'
>

const paths = new Map<CanvasIconName, { path: Path2D; clip?: Path2D }[]>()

type CanvasColors = string | Readonly<Record<string, CanvasRenderingContext2D['fillStyle']>>

function resolvePaint(paint: string, colors?: CanvasColors): CanvasRenderingContext2D['fillStyle'] {
  if (typeof colors === 'string') return paint === 'black' || paint === '#E5E5E5' ? colors : paint
  return colors?.[paint] ?? paint
}

export function drawCanvasIcon(
  ctx: CanvasContext,
  name: CanvasIconName,
  x: number,
  y: number,
  size: number,
  colors?: CanvasColors,
): void {
  if (!Object.hasOwn(canvasIcons, name)) throw new RangeError(`Unknown Canvas icon: ${name}`)
  if (!Number.isFinite(size) || size <= 0) return
  const icon = canvasIcons[name]
  let geometry = paths.get(name)
  if (!geometry) {
    geometry = icon.paths.map(({ d, clip }) => ({
      path: new Path2D(d),
      clip: clip ? new Path2D(clip) : undefined,
    }))
    paths.set(name, geometry)
  }
  const scale = size / Math.max(icon.width, icon.height)
  ctx.save()
  try {
    ctx.translate(x + (size - icon.width * scale) / 2, y + (size - icon.height * scale) / 2)
    ctx.scale(scale, scale)
    for (const [i, path] of icon.paths.entries()) {
      const geometryPath = geometry[i]
      if (geometryPath.clip) ctx.save()
      try {
        if (geometryPath.clip) ctx.clip(geometryPath.clip)
        if (path.fill) {
          ctx.fillStyle = resolvePaint(path.fill, colors)
          ctx.fill(geometryPath.path, path.fillRule ?? 'nonzero')
        }
        if (path.stroke) {
          ctx.strokeStyle = resolvePaint(path.stroke, colors)
          ctx.lineWidth = path.strokeWidth ?? 1
          ctx.lineCap = path.lineCap ?? 'butt'
          ctx.lineJoin = path.lineJoin ?? 'miter'
          ctx.stroke(geometryPath.path)
        }
      } finally {
        if (geometryPath.clip) ctx.restore()
      }
    }
  } finally {
    ctx.restore()
  }
}
