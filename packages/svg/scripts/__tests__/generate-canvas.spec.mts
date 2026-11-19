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
  assert.equal(icon.paths[0].stroke, 'black')
  assert.equal(icon.paths[0].strokeWidth, 1.2)
  assert.equal(icon.paths[1].fill, '#E5E5E5')
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

it('clips only the painted foreground of a partially filled rating', () => {
  const svg = `<svg viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" fill="white"/>
    <mask id="half" maskUnits="userSpaceOnUse" x="0" y="0" width="8" height="16"><rect width="8" height="16" fill="white"/></mask>
    <g mask="url(#half)"><circle cx="8" cy="8" r="7" fill="black"/></g>
  </svg>`
  const [background, foreground] = compileCanvasIcon(svg, 'rating.svg').paths
  assert.equal(background.clip, undefined)
  assert.equal(foreground.clip, 'M0 0h8v16h-8Z')
  assert.equal(foreground.d, background.d)
  assert.throws(() =>
    compileCanvasIcon(svg.replace('fill="white"/></mask>', 'fill="gray"/></mask>'), 'rating.svg'),
  )
})
