import assert from 'node:assert/strict'
import { it } from 'node:test'
import { compileCanvasIcon } from '../generate-canvas.mts'

it('carries the SVG viewport, inherited stroke, and accent fill into the Canvas artwork', () => {
  const icon = compileCanvasIcon(
    '<svg viewBox="0 0 17 16" fill="none"><g stroke="black" stroke-width="1.2"><path d="M2 8h5"/><path fill="#E5E5E5" stroke="none" fill-rule="evenodd" d="M8 4h4v4H8Z"/></g></svg>',
    'two-tone.svg',
  )
  assert.deepEqual([icon.width, icon.height], [17, 16])
  assert.equal(icon.paths[0].fill, undefined)
  assert.equal(icon.paths[0].stroke, 'main')
  assert.equal(icon.paths[0].strokeWidth, 1.2)
  assert.equal(icon.paths[1].fill, 'accent')
  assert.equal(icon.paths[1].fillRule, 'evenodd')
  assert.equal(icon.paths[1].stroke, undefined)
})

it('rejects geometry it cannot reproduce instead of drawing the wrong shape', () => {
  assert.throws(
    () =>
      compileCanvasIcon(
        '<svg viewBox="0 0 16 16"><g transform="scale(2)"><path d="M0 0h4v4Z"/></g></svg>',
        'scaled.svg',
      ),
    /Unsupported SVG attributes in scaled.svg/,
  )
})
