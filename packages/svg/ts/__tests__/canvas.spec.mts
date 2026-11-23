import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { it } from 'node:test'
import { drawCanvasIcon } from '@univerjs/icons-svg'

it('loads the Canvas renderer in ESM and CommonJS without browser globals', () => {
  const require = createRequire(import.meta.url)
  assert.equal(typeof drawCanvasIcon, 'function')
  assert.equal(require('@univerjs/icons-svg').drawCanvasIcon, drawCanvasIcon)
})

it('draws a known icon on browsers without Object.hasOwn and rejects inherited names', () => {
  const previousHasOwn = Object.getOwnPropertyDescriptor(Object, 'hasOwn')!
  const previousPath2D = Object.getOwnPropertyDescriptor(globalThis, 'Path2D')
  const paths: string[] = []
  let fills = 0
  const ctx: Parameters<typeof drawCanvasIcon>[0] = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    lineCap: 'butt',
    lineJoin: 'miter',
    fill() {
      fills++
    },
    clip() {},
    restore() {},
    save() {},
    scale() {},
    stroke() {},
    translate() {},
  }
  Reflect.deleteProperty(Object, 'hasOwn')
  Object.defineProperty(globalThis, 'Path2D', {
    configurable: true,
    value: function (path: string) {
      paths.push(path)
    },
  })
  try {
    drawCanvasIcon(ctx, 'grip-vertical-icon', 0, 0, 13)
  } finally {
    Object.defineProperty(Object, 'hasOwn', previousHasOwn)
    if (previousPath2D) Object.defineProperty(globalThis, 'Path2D', previousPath2D)
    else Reflect.deleteProperty(globalThis, 'Path2D')
  }
  assert.ok(paths.length > 0)
  assert.ok(fills > 0)
  assert.throws(
    () => drawCanvasIcon(ctx, 'constructor' as Parameters<typeof drawCanvasIcon>[1], 0, 0, 13),
    RangeError,
  )
})
