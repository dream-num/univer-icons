export type PreserveStrokeWidthCapture = {
  capture: (root: ParentNode) => void
  restore: () => void
}

type ViewBoxSize = Pick<DOMRectReadOnly, 'height' | 'width'>

type OriginalGeometryState = {
  appliedStrokeWidth: string | null
  hadStyleAttribute: boolean
  isReleased: boolean
  originalComputedStrokeWidth: number
  ownerSvg: SVGSVGElement
  strokeWidthPriority: string
  strokeWidthValue: string
}

const SVG_GRAPHICS_SELECTOR = [
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
  'use',
].join(',')

export function createPreserveStrokeWidthCapture(): PreserveStrokeWidthCapture {
  const originalStateByElement = new Map<SVGGraphicsElement, OriginalGeometryState>()
  const observedSvgElements = new Set<SVGSVGElement>()
  const resizeObserver = new ResizeObserver(updateCapturedStrokeWidths)

  function updateCapturedStrokeWidths() {
    originalStateByElement.forEach((originalState, element) => {
      if (originalState.isReleased) {
        return
      }

      if (
        originalState.appliedStrokeWidth !== null &&
        (element.style.getPropertyValue('stroke-width') !== originalState.appliedStrokeWidth ||
          element.style.getPropertyPriority('stroke-width') !== originalState.strokeWidthPriority)
      ) {
        originalState.appliedStrokeWidth = null
        originalState.isReleased = true
        return
      }

      const viewBox = originalState.ownerSvg.viewBox.baseVal
      const layoutBounds = originalState.ownerSvg.getBoundingClientRect()
      const currentViewportScale = calculateViewportScale(
        layoutBounds.width,
        layoutBounds.height,
        viewBox,
      )
      const baselineScale = calculateBaselineScale(viewBox)
      const strokeWidth = calculateCompensatedStrokeWidth(
        originalState.originalComputedStrokeWidth,
        currentViewportScale,
        baselineScale,
      )

      if (strokeWidth === null) {
        return
      }

      const appliedStrokeWidth = `${roundStrokeWidth(strokeWidth)}px`
      element.style.setProperty(
        'stroke-width',
        appliedStrokeWidth,
        originalState.strokeWidthPriority,
      )
      originalState.appliedStrokeWidth = appliedStrokeWidth
    })
  }

  return {
    capture(root) {
      root.querySelectorAll<SVGGraphicsElement>(SVG_GRAPHICS_SELECTOR).forEach((element) => {
        if (originalStateByElement.has(element)) {
          return
        }

        const computedStyle = window.getComputedStyle(element)

        if (!hasVisibleStroke(computedStyle)) {
          return
        }

        const ownerSvg = element.ownerSVGElement

        if (!ownerSvg) {
          return
        }

        if (computedStyle.vectorEffect === 'non-scaling-stroke') {
          return
        }

        const originalComputedStrokeWidth = Number.parseFloat(computedStyle.strokeWidth)

        if (!Number.isFinite(originalComputedStrokeWidth) || originalComputedStrokeWidth <= 0) {
          return
        }

        originalStateByElement.set(element, {
          appliedStrokeWidth: null,
          hadStyleAttribute: element.hasAttribute('style'),
          isReleased: false,
          originalComputedStrokeWidth,
          ownerSvg,
          strokeWidthPriority: element.style.getPropertyPriority('stroke-width'),
          strokeWidthValue: element.style.getPropertyValue('stroke-width'),
        })

        if (!observedSvgElements.has(ownerSvg)) {
          observedSvgElements.add(ownerSvg)
          resizeObserver.observe(ownerSvg)
        }
      })

      updateCapturedStrokeWidths()
    },
    restore() {
      resizeObserver.disconnect()

      originalStateByElement.forEach((originalState, element) => {
        if (
          originalState.appliedStrokeWidth === null ||
          element.style.getPropertyValue('stroke-width') !== originalState.appliedStrokeWidth ||
          element.style.getPropertyPriority('stroke-width') !== originalState.strokeWidthPriority
        ) {
          return
        }

        if (originalState.strokeWidthValue) {
          element.style.setProperty(
            'stroke-width',
            originalState.strokeWidthValue,
            originalState.strokeWidthPriority,
          )
        } else {
          element.style.removeProperty('stroke-width')
        }

        if (!originalState.hadStyleAttribute && element.style.length === 0) {
          element.removeAttribute('style')
        }
      })

      originalStateByElement.clear()
      observedSvgElements.clear()
    },
  }
}

function calculateCompensatedStrokeWidth(
  originalComputedStrokeWidth: number,
  currentViewportScale: number | null,
  baselineScale: number | null,
  sourceAlreadyNonScaling = false,
): number | null {
  if (!Number.isFinite(originalComputedStrokeWidth) || originalComputedStrokeWidth <= 0) {
    return null
  }

  if (sourceAlreadyNonScaling) {
    return originalComputedStrokeWidth
  }

  if (currentViewportScale === null || baselineScale === null) {
    return null
  }

  if (
    !Number.isFinite(currentViewportScale) ||
    !Number.isFinite(baselineScale) ||
    currentViewportScale <= 0 ||
    baselineScale <= 0
  ) {
    return null
  }

  return originalComputedStrokeWidth * (baselineScale / currentViewportScale)
}

function calculateViewportScale(
  layoutWidth: number,
  layoutHeight: number,
  viewBox: ViewBoxSize,
): number | null {
  if (
    !Number.isFinite(layoutWidth) ||
    !Number.isFinite(layoutHeight) ||
    !Number.isFinite(viewBox.width) ||
    !Number.isFinite(viewBox.height) ||
    layoutWidth <= 0 ||
    layoutHeight <= 0 ||
    viewBox.width <= 0 ||
    viewBox.height <= 0
  ) {
    return null
  }

  return Math.min(layoutWidth / viewBox.width, layoutHeight / viewBox.height)
}

function calculateBaselineScale(viewBox: ViewBoxSize): number | null {
  const viewBoxSize = Math.max(viewBox.width, viewBox.height)

  return Number.isFinite(viewBoxSize) && viewBoxSize > 0 ? 16 / viewBoxSize : null
}

function hasVisibleStroke(computedStyle: CSSStyleDeclaration) {
  return (
    computedStyle.display !== 'none' &&
    computedStyle.visibility !== 'hidden' &&
    computedStyle.visibility !== 'collapse' &&
    computedStyle.stroke !== 'none' &&
    Number.parseFloat(computedStyle.opacity || '1') > 0 &&
    Number.parseFloat(computedStyle.strokeOpacity || '1') > 0
  )
}

function roundStrokeWidth(strokeWidth: number) {
  return Number(strokeWidth.toFixed(12))
}
