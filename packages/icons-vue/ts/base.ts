import type { CSSProperties, PropType, SVGAttributes, VNode } from 'vue'
import { defineComponent, h, ref, useAttrs } from 'vue'

export interface IExtendProps {
  colorChannel1: string
}

export interface Attrs {
  [key: string]: any
}

export interface IconElement {
  tag: string
  attrs: Attrs
  style?: CSSProperties
  children?: IconElement[]
  defIds?: string[]
}

export interface IconProps extends SVGAttributes {
  extend?: Partial<IExtendProps>
}

interface IconBaseProps {
  extend?: Partial<IExtendProps>
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
    extend: Object as PropType<IconBaseProps['extend']>,
    icon: {
      type: Object as PropType<IconElement>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const attrs = useAttrs()
    const idSuffix = ref<string>(`_${generateShortUuid()}`)

    return () =>
      render(
        props.icon,
        props.id,
        { defIds: props.icon.defIds, idSuffix: idSuffix.value },
        {
          ...attrs,
          class: ['univerjs-icon', `univerjs-icon-${props.id}`, attrs.class],
        },
        props.extend,
      )
  },
})

function render(
  node: IconElement,
  id: string,
  runtimeProps: RuntimeProps,
  rootProps?: { [key: string]: any },
  extend?: Partial<IExtendProps>,
): VNode {
  return h(
    node.tag,
    {
      key: id,
      ...replaceRuntimeIdsAndExtInAttrs(node, runtimeProps, extend),
      ...rootProps,
    },
    (replaceRuntimeIdsInDefs(node, runtimeProps).children || []).map(
      (child, index) =>
        render(
          child,
          `${id}-${node.tag}-${index}`,
          runtimeProps,
          undefined,
          extend,
        ),
    ),
  )
}

function replaceRuntimeIdsAndExtInAttrs(
  node: IconElement,
  runtimeProps: RuntimeProps,
  extend?: Partial<IExtendProps>,
): Attrs {
  const attrs = { ...node.attrs }

  if (extend?.colorChannel1 && attrs.fill === 'colorChannel1') {
    attrs.fill = extend.colorChannel1
  }

  if (node.tag === 'mask' && attrs.id) {
    attrs.id = attrs.id + runtimeProps.idSuffix
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'mask' && typeof value === 'string') {
      attrs[key] = value.replace(
        /url\(#(.*)\)/,
        `url(#$1${runtimeProps.idSuffix})`,
      )
    }
  })

  const { defIds } = runtimeProps
  if (!defIds || defIds.length === 0) {
    return attrs
  }

  if (node.tag === 'use' && attrs['xlink:href']) {
    attrs['xlink:href'] = attrs['xlink:href'] + runtimeProps.idSuffix
  }

  Object.entries(attrs).forEach(([key, value]) => {
    if (typeof value === 'string') {
      attrs[key] = value.replace(
        /url\(#(.*)\)/,
        `url(#$1${runtimeProps.idSuffix})`,
      )
    }
  })

  return attrs
}

function replaceRuntimeIdsInDefs(
  node: IconElement,
  runtimeProps: RuntimeProps,
): IconElement {
  const { defIds } = runtimeProps
  if (!defIds || defIds.length === 0) {
    return node
  }

  if (node.tag === 'defs' && node.children?.length) {
    return {
      ...node,
      children: node.children.map((child) => {
        if (typeof child.attrs.id === 'string' && defIds.includes(child.attrs.id)) {
          return {
            ...child,
            attrs: {
              ...child.attrs,
              id: child.attrs.id + runtimeProps.idSuffix,
            },
          }
        }

        return child
      }),
    }
  }

  return node
}

function generateShortUuid(): string {
  return Math.random().toString(36).substring(2, 8)
}
