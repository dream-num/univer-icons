import type { CSSProperties, PropType, VNode } from 'vue'
import { defineComponent, h, useAttrs } from 'vue'

export interface IExtendProps {
  colorChannel1?: string
}

export interface IconProps {
  focusable?: string
  style?: CSSProperties | string
  class?: unknown
  extend?: IExtendProps
}

export interface Attrs {
  [key: string]: unknown
}

export interface IconElement {
  tag: string
  attrs: Attrs
  style?: CSSProperties
  children?: IconElement[]
  defIds?: string[]
}

export interface IconFulfilledProps extends IconProps {
  icon: IconElement
  id: string
}

interface RuntimeProps {
  defIds?: IconElement['defIds']
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
  },
  setup(props) {
    const attrs = useAttrs()
    const idSuffix = `_${generateShortUuid()}`

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
        },
        props.extend,
      )
    }
  },
})

function render(
  node: IconElement,
  id: string,
  runtimeProps: RuntimeProps,
  rootProps?: Attrs,
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
  node: IconElement,
  runtimeProps: RuntimeProps,
  extend?: IExtendProps,
): Attrs {
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

function replaceRuntimeIdsInDefs(node: IconElement, runtimeProps: RuntimeProps): IconElement {
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

function generateShortUuid(): string {
  return Math.random().toString(36).substring(2, 8)
}
