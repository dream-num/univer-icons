export function getIconComponent({
  element,
  name,
  componentName,
}: {
  element: string
  name: string
  componentName: string
}) {
  return `import { createElement, forwardRef } from 'react'
import type { IconProps } from './base.js'
import { IconBase } from './base.js'

const element = ${element}

export const ${componentName} = forwardRef<SVGElement, IconProps>(function ${componentName}(props, ref) {
  return createElement(IconBase, Object.assign({}, props, {
    id: '${name}',
    ref,
    icon: element,
  }))
})

${componentName}.displayName = '${componentName}'

export default ${componentName}
`
}
