// This file is generated automatically by `useTemplate.ts`. DO NOT EDIT IT.

import type { Ref } from 'react'
import type { IconProps } from '../icon'
import { createElement, forwardRef } from 'react'
import { IconBase } from '../icon'

const element = $ELEMENT

export const $ICON_NAME = forwardRef<SVGElement, IconProps>(
  (props: IconProps, ref: Ref<SVGElement>) =>
    createElement(
      IconBase,
      Object.assign({}, props, {
        id: '$KEY',
        ref,
        icon: element,
      }),
    ),
)

$ICON_NAME.displayName = '$ICON_NAME'

export default $ICON_NAME
