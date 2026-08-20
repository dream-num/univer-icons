export function getIconComponent({
  element,
  name,
  componentName,
}: {
  element: string
  name: string
  componentName: string
}) {
  return `import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'

import type { IExtendProps } from './base.js'
import { IconBase } from './base.js'

const element = ${element}

export const ${componentName} = defineComponent({
  name: '${componentName}',
  inheritAttrs: false,
  props: {
    preserveStrokeWidth: {
      type: Boolean,
      default: false,
    },
    extend: {
      type: Object as PropType<IExtendProps>,
      default: undefined,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h(IconBase, {
        ...attrs,
        preserveStrokeWidth: props.preserveStrokeWidth,
        extend: props.extend,
        id: '${name}',
        icon: element,
      })
  },
})

export default ${componentName}
`
}
