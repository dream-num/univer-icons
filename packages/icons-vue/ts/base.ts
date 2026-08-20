import type { CSSProperties, PropType, VNode } from 'vue'
import { defineComponent, h, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

const SVG_STROKE_ELEMENT_SELECTOR =
  'circle, ellipse, line, path, polygon, polyline, rect, text, textPath, tspan, use'

export interface IExtendProps {
  colorChannel1?: string
}

export interface IIconProps {
  /** Preserve stroke widths relative to a 16×16 baseline when the icon scales. */
  preserveStrokeWidth?: boolean
  focusable?: string
  style?: CSSProperties | string
  class?: unknown
  extend?: IExtendProps
}

export type IconProps = IIconProps

export interface IAttrs {
  [key: string]: unknown
}

export type Attrs = IAttrs

export interface IIconElement {
  tag: string
  attrs: IAttrs
  style?: CSSProperties
  children?: IIconElement[]
  defIds?: string[]
}

export type IconElement = IIconElement

export interface IIconFulfilledProps extends IIconProps {
  icon: IIconElement
  id: string
}

export type IconFulfilledProps = IIconFulfilledProps

interface IRuntimeProps {
  defIds?: IIconElement['defIds']
  idSuffix: string
}

export const IconBase = defineComponent({
  name: 'UniverIcon',
  inheritAttrs: false,
  props: {
    icon: {
      type: Object as PropType<IconElement>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    extend: {
      type: Object as PropType<IExtendProps>,
      default: undefined,
    },
    preserveStrokeWidth: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const attrs = useAttrs()
    const idSuffix = `_${generateShortUuid()}`
    const rootRef = ref<SVGSVGElement | null>(null)
    let restoreStrokeWidths: (() => void) | undefined

    const updatePreserveStrokeWidth = () => {
      restoreStrokeWidths?.()
      restoreStrokeWidths = undefined

      if (props.preserveStrokeWidth && rootRef.value) {
        restoreStrokeWidths = applyPreserveStrokeWidth(rootRef.value)
      }
    }

    onMounted(updatePreserveStrokeWidth)
    watch([() => props.preserveStrokeWidth, () => props.icon], updatePreserveStrokeWidth, {
      flush: 'post',
    })
    onBeforeUnmount(() => {
      restoreStrokeWidths?.()
    })

    return () => {
      const cls = ['univerjs-icon', `univerjs-icon-${props.id}`, attrs.class]

      return render(
        props.icon,
        props.id,
        {
          defIds: props.icon.defIds,
          idSuffix,
        },
        {
          ...attrs,
          class: cls,
          ref: rootRef,
        },
        props.extend,
      )
    }
  },
})

function render(
  node: IIconElement,
  id: string,
  runtimeProps: IRuntimeProps,
  rootProps?: IAttrs,
  extend?: IExtendProps,
): VNode {
  const renderedNode = replaceRuntimeIdsInDefs(node, runtimeProps)

  return h(
    node.tag,
    {
      key: id,
      ...replaceRuntimeIdsAndExtInAttrs(renderedNode, runtimeProps, extend),
      ...rootProps,
    },
    (renderedNode.children || []).map((child, index) =>
      render(child, `${id}-${node.tag}-${index}`, runtimeProps, undefined, extend),
    ),
  )
}

function replaceRuntimeIdsAndExtInAttrs(
  node: IIconElement,
  runtimeProps: IRuntimeProps,
  extend?: IExtendProps,
): IAttrs {
  const attrs = { ...node.attrs }

  if (extend?.colorChannel1 && attrs.fill === 'colorChannel1') {
    attrs.fill = extend.colorChannel1
  }

  if (extend?.colorChannel1 && attrs.stroke === 'colorChannel1') {
    attrs.stroke = extend.colorChannel1
  }

  if (node.tag === 'mask' && attrs.id) {
    attrs.id = `${attrs.id}${runtimeProps.idSuffix}`
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'mask' && typeof value === 'string') {
      attrs[key] = replaceLocalUrlRefs(value, runtimeProps.idSuffix)
    }
  })

  const { defIds } = runtimeProps
  if (!defIds || defIds.length === 0) {
    return attrs
  }

  if (
    node.tag === 'use' &&
    typeof attrs['xlink:href'] === 'string' &&
    attrs['xlink:href'].startsWith('#')
  ) {
    attrs['xlink:href'] = `${attrs['xlink:href']}${runtimeProps.idSuffix}`
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (key !== 'mask' && typeof value === 'string') {
      attrs[key] = replaceLocalUrlRefs(value, runtimeProps.idSuffix)
    }
  })

  return attrs
}

function replaceRuntimeIdsInDefs(node: IIconElement, runtimeProps: IRuntimeProps): IIconElement {
  const { defIds } = runtimeProps
  if (!defIds || defIds.length === 0) {
    return node
  }

  if (node.tag === 'defs' && node.children?.length) {
    return {
      ...node,
      children: node.children.map((child) => {
        if (typeof child.attrs.id === 'string' && shouldSuffixDefId(child.attrs.id, defIds)) {
          return {
            ...child,
            attrs: {
              ...child.attrs,
              id: `${child.attrs.id}${runtimeProps.idSuffix}`,
            },
          }
        }

        return child
      }),
    }
  }

  return node
}

function shouldSuffixDefId(childId: string, defIds: string[]): boolean {
  return defIds.some((defId) => childId === defId || childId.endsWith(`_${defId}`))
}

function replaceLocalUrlRefs(value: string, idSuffix: string): string {
  return value.replace(/url\(#([^)]+?)\)/g, `url(#$1${idSuffix})`)
}

interface IInlineStyleSnapshot {
  priority: string
  value: string
}

interface IStrokeWidthOverride {
  appliedStrokeWidth?: string
  consumerControlled: boolean
  element: SVGGeometryElement
  hadStyleAttribute: boolean
  sourceStrokeWidth: number
  strokeWidth: IInlineStyleSnapshot
}

/** Keep ordinary strokes at their 16×16 baseline width as the icon's layout changes. */
function applyPreserveStrokeWidth(root: SVGSVGElement): () => void {
  const viewBox = root.viewBox.baseVal
  const viewBoxSize = Math.max(viewBox.width, viewBox.height)

  if (!Number.isFinite(viewBoxSize) || viewBoxSize <= 0) {
    return () => {}
  }

  const baselineViewportScale = 16 / viewBoxSize
  const overrides = Array.from(
    root.querySelectorAll<SVGGeometryElement>(SVG_STROKE_ELEMENT_SELECTOR),
  ).flatMap((element): IStrokeWidthOverride[] => {
    const computedStyle = getComputedStyle(element)
    const strokeWidth = Number.parseFloat(computedStyle.strokeWidth)

    if (
      computedStyle.stroke === 'none' ||
      Number.parseFloat(computedStyle.strokeOpacity) === 0 ||
      computedStyle.vectorEffect === 'non-scaling-stroke' ||
      !Number.isFinite(strokeWidth) ||
      strokeWidth <= 0
    ) {
      return []
    }

    return [
      {
        consumerControlled: false,
        element,
        hadStyleAttribute: element.hasAttribute('style'),
        sourceStrokeWidth: strokeWidth,
        strokeWidth: getInlineStyleSnapshot(element.style, 'stroke-width'),
      },
    ]
  })

  if (overrides.length === 0) {
    return () => {}
  }

  let active = true
  const updateStrokeWidths = () => {
    if (!active) {
      return
    }

    const currentViewportScale = getCurrentViewportScale(root, viewBox.width, viewBox.height)

    if (currentViewportScale === null) {
      return
    }

    overrides.forEach((override) => {
      if (override.consumerControlled) {
        return
      }

      const expectedStrokeWidth = override.appliedStrokeWidth ?? override.strokeWidth.value

      if (
        override.element.style.getPropertyValue('stroke-width') !== expectedStrokeWidth ||
        override.element.style.getPropertyPriority('stroke-width') !== override.strokeWidth.priority
      ) {
        override.consumerControlled = true
        return
      }

      const appliedStrokeWidth = `${
        override.sourceStrokeWidth * (baselineViewportScale / currentViewportScale)
      }px`

      override.element.style.setProperty(
        'stroke-width',
        appliedStrokeWidth,
        override.strokeWidth.priority,
      )
      override.appliedStrokeWidth = appliedStrokeWidth
    })
  }

  updateStrokeWidths()

  const resizeObserver =
    typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateStrokeWidths)

  resizeObserver?.observe(root)

  return () => {
    active = false
    resizeObserver?.disconnect()

    overrides.forEach((override) => {
      if (override.appliedStrokeWidth === undefined) {
        return
      }

      restoreInlineStyle(
        override.element.style,
        'stroke-width',
        override.appliedStrokeWidth,
        override.strokeWidth.priority,
        override.strokeWidth,
      )

      if (!override.hadStyleAttribute && override.element.style.length === 0) {
        override.element.removeAttribute('style')
      }
    })
  }
}

function getCurrentViewportScale(
  root: SVGSVGElement,
  viewBoxWidth: number,
  viewBoxHeight: number,
): number | null {
  if (viewBoxWidth <= 0 || viewBoxHeight <= 0) {
    return null
  }

  const bounds = root.getBoundingClientRect()
  const scale = Math.min(bounds.width / viewBoxWidth, bounds.height / viewBoxHeight)

  return Number.isFinite(scale) && scale > 0 ? scale : null
}

function getInlineStyleSnapshot(
  style: CSSStyleDeclaration,
  property: string,
): IInlineStyleSnapshot {
  return {
    priority: style.getPropertyPriority(property),
    value: style.getPropertyValue(property),
  }
}

function restoreInlineStyle(
  style: CSSStyleDeclaration,
  property: string,
  appliedValue: string,
  appliedPriority: string,
  snapshot: IInlineStyleSnapshot,
) {
  if (
    style.getPropertyValue(property) !== appliedValue ||
    style.getPropertyPriority(property) !== appliedPriority
  ) {
    return
  }

  if (snapshot.value) {
    style.setProperty(property, snapshot.value, snapshot.priority)
  } else {
    style.removeProperty(property)
  }
}

function generateShortUuid(): string {
  return Math.random().toString(36).substring(2, 8)
}
