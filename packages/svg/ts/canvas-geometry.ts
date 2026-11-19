export interface ICanvasIconPath {
  d: string
  clip?: string
  fill?: string
  fillRule?: CanvasFillRule
  stroke?: string
  strokeWidth?: number
  lineCap?: CanvasLineCap
  lineJoin?: CanvasLineJoin
}

export interface ICanvasIcon {
  width: number
  height: number
  paths: readonly ICanvasIconPath[]
}
