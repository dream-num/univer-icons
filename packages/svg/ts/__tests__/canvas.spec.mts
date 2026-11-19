import assert from 'node:assert/strict'
import { it } from 'node:test'
import { drawCanvasIcon } from '../../dist/canvas.js'

it('restores the caller’s drawing state when a clipped foreground fails to paint', (t) => {
  const originalPath = Object.getOwnPropertyDescriptor(globalThis, 'Path2D')
  Object.defineProperty(globalThis, 'Path2D', {
    value: class {
      readonly data: string
      constructor(data: string) {
        this.data = data
      }
    },
    configurable: true,
  })
  t.after(() => {
    if (originalPath) Object.defineProperty(globalThis, 'Path2D', originalPath)
    else Reflect.deleteProperty(globalThis, 'Path2D')
  })

  const stack: string[] = []
  const paints: string[] = []
  const ctx = {
    fillStyle: 'blue',
    save() {
      stack.push(this.fillStyle)
    },
    restore() {
      this.fillStyle = stack.pop()!
    },
    translate() {},
    scale() {},
    clip() {},
    fill(_path: Path2D, rule: CanvasFillRule) {
      assert.equal(rule, 'nonzero')
      paints.push(this.fillStyle)
      if (this.fillStyle === 'orange') throw new Error('Canvas paint failed')
    },
  }
  assert.throws(
    () =>
      drawCanvasIcon(ctx as CanvasRenderingContext2D, 'star-incomplete-double-icon', 0, 0, 16, {
        black: 'orange',
      }),
    /Canvas paint failed/,
  )
  assert.deepEqual(paints, ['#E5E5E5', 'orange'])
  assert.deepEqual(stack, [])
  assert.equal(ctx.fillStyle, 'blue')
})
