export function getIconComponent({
  element,
  name,
  componentName,
}: {
  element: string
  name: string
  componentName: string
}) {
  return `/* eslint-disable */
import { createElement, forwardRef } from 'react';
import type { IconProps } from './base';
import { IconBase } from './base';
const element = ${element};
export const ${componentName} = forwardRef<SVGElement, IconProps>(function ${componentName}(props, ref) {
  return createElement(IconBase, Object.assign({}, props, {
    id: '${name}',
    ref: ref,
    icon: element,
  }));
});
${componentName}.displayName = '${componentName}';
export default ${componentName};
`
}
