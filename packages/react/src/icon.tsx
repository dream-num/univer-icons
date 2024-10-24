'use client'

import {
  createElement,
  forwardRef,
  ForwardRefExoticComponent,
  ReactElement,
  Ref,
  RefAttributes,
  useRef,
} from 'react';

export interface IconProps {
  focusable?: string;
  style?: React.CSSProperties;
  className?: string;
  extend?: IExtendProps;

  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export interface IconFulfilledProps extends IconProps {
  icon: IconElement;
  id: string;
}

export interface IExtendProps {
  colorChannel1: string;
}
export interface Attrs {
  [key: string]: any;
}

export interface IconElement {
  tag: string;
  attrs: Attrs;
  style?: React.CSSProperties;
  children?: IconElement[];
  defIds?: string[];
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34757
export type CompoundedComponent = ForwardRefExoticComponent<
  IconFulfilledProps & RefAttributes<SVGElement>
>;

// Props that dynamically generated by runtime
interface RuntimeProps {
  defIds?: IconElement['defIds'];
  idSuffix: string;
}

export const IconBase = forwardRef(
  (props: IconFulfilledProps, ref: Ref<SVGElement>) => {
    const { icon, id, className, extend, ...restProps } = props;
    const cls = `univerjs-icon univerjs-icon-${id} ${className || ''}`.trim();

    const idSuffix = useRef<string>(`_${generateShortUuid()}`);

    return render(
      icon,
      `${id}`,
      { defIds: icon.defIds, idSuffix: idSuffix.current },
      {
        ref,
        className: cls,
        ...restProps,
      },
      extend
    );
  }
) as CompoundedComponent;

/**
 * use react createElement to render an IconElement with other props
 */
function render(
  node: IconElement,
  id: string,
  runtimeProps: RuntimeProps,
  rootProps?: { [key: string]: any },
  extend?: IExtendProps
): ReactElement {
  return createElement(
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
          extend
        )
    )
  );
}

// Adds id-suffix to references, returns new attrs.
function replaceRuntimeIdsAndExtInAttrs(
  node: IconElement,
  runtimeProps: RuntimeProps,
  extend?: IExtendProps
): Attrs {
  // replace extend colorChannel
  let attrs = { ...node.attrs };
  if (extend?.colorChannel1 && attrs['fill'] === 'colorChannel1') {
    attrs['fill'] = extend.colorChannel1;
  }

  // If `defIds` is empty, do nothing
  const { defIds } = runtimeProps;
  if (!defIds || defIds.length === 0) {
    return attrs;
  }

  // Adds suffix to references
  if (node.tag === 'use' && attrs['xlink:href']) {
    attrs['xlink:href'] = attrs['xlink:href'] + runtimeProps.idSuffix;
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (typeof value === 'string') {
      attrs[key] = value.replace(
        /url\(#(.*)\)/,
        `url(#$1${runtimeProps.idSuffix})`
      );
    }
  });
  return attrs;
}

// Adds id-suffix to definitions, returns new node.
function replaceRuntimeIdsInDefs(
  node: IconElement,
  runtimeProps: RuntimeProps
): IconElement {
  // If `defIds` is empty, do nothing
  const { defIds } = runtimeProps;
  if (!defIds || defIds.length === 0) {
    return node;
  }

  // Adds suffix to definition
  if (node.tag === 'defs' && node.children?.length) {
    return {
      ...node,
      children: node.children.map((child) => {
        if (typeof child.attrs.id === 'string') {
          if (defIds && defIds.indexOf(child.attrs.id) > -1) {
            return {
              ...child,
              attrs: {
                ...child.attrs,
                id: child.attrs.id + runtimeProps.idSuffix,
              },
            };
          }
        }
        return child;
      }),
    };
  }
  return node;
}

function generateShortUuid(): string {
  return Math.random().toString(36).substring(2, 8);
}

IconBase.displayName = 'UniverIcon';
