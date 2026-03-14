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
import { h } from 'vue';
import type { FunctionalComponent } from 'vue';
import type { IconProps } from './base';
import { IconBase } from './base';
const element = ${element};
export const ${componentName}: FunctionalComponent<IconProps> = (props) => {
  return h(IconBase, Object.assign({}, props, {
    id: '${name}',
    icon: element,
  }));
};
${componentName}.displayName = '${componentName}';
export default ${componentName};
`
}
