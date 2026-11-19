export interface ICanvasIconPath {
  d: string
  fill?: 'main' | 'accent'
  fillRule?: CanvasFillRule
  stroke?: 'main' | 'accent'
  strokeWidth?: number
  lineCap?: CanvasLineCap
  lineJoin?: CanvasLineJoin
}

export interface ICanvasIcon {
  width: number
  height: number
  clip?: string
  paths: readonly ICanvasIconPath[]
}

const paths = new WeakMap<ICanvasIcon, { clip?: Path2D; paths: Path2D[] }>()

export function drawCanvasIcon(
  ctx: CanvasRenderingContext2D,
  icon: ICanvasIcon,
  x: number,
  y: number,
  size: number,
  color: string,
  accent = color,
): void {
  let geometry = paths.get(icon)
  if (!geometry) {
    geometry = {
      clip: icon.clip ? new Path2D(icon.clip) : undefined,
      paths: icon.paths.map(({ d }) => new Path2D(d)),
    }
    paths.set(icon, geometry)
  }

  const scale = size / Math.max(icon.width, icon.height)
  ctx.save()
  ctx.translate(x + (size - icon.width * scale) / 2, y + (size - icon.height * scale) / 2)
  ctx.scale(scale, scale)
  if (geometry.clip) ctx.clip(geometry.clip)

  for (const [i, path] of icon.paths.entries()) {
    if (path.fill) {
      ctx.fillStyle = path.fill === 'accent' ? accent : color
      ctx.fill(geometry.paths[i], path.fillRule)
    }
    if (path.stroke) {
      ctx.strokeStyle = path.stroke === 'accent' ? accent : color
      ctx.lineWidth = path.strokeWidth ?? 1
      ctx.lineCap = path.lineCap ?? 'butt'
      ctx.lineJoin = path.lineJoin ?? 'miter'
      ctx.stroke(geometry.paths[i])
    }
  }
  ctx.restore()
}
