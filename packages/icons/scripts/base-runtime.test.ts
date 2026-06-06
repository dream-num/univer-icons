import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { IconBase } from '../dist/esm/base.js'

type IconElement = {
  attrs: Record<string, unknown>
  children?: IconElement[]
  tag: string
}

describe('IconBase runtime color channels', () => {
  it('replaces colorChannel1 stroke attributes', () => {
    const icon: IconElement = {
      tag: 'svg',
      attrs: {
        height: '1em',
        viewBox: '0 0 16 16',
        width: '1em',
        xmlns: 'http://www.w3.org/2000/svg',
      },
      children: [
        {
          tag: 'circle',
          attrs: {
            cx: 8,
            cy: 8,
            fill: 'none',
            r: 5.1,
            stroke: 'colorChannel1',
            strokeWidth: 1.8,
          },
          children: [],
        },
      ],
    }

    const html = renderToStaticMarkup(
      createElement(IconBase, {
        extend: { colorChannel1: '#ff00aa' },
        icon,
        id: 'shape-stroke-color-double-icon',
        ref: null,
      }),
    )

    assert.match(html, /stroke="#ff00aa"/)
    assert.doesNotMatch(html, /stroke="colorChannel1"/)
  })
})
