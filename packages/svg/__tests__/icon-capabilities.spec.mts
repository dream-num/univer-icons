import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { getPreserveStrokeWidthSupport } from '../icon-capabilities.mts'

function readSingleIcon(name: string) {
  return readFileSync(new URL(`../single/${name}.svg`, import.meta.url), 'utf8')
}

describe('getPreserveStrokeWidthSupport', () => {
  it('supports icons that combine compatible strokes with filled artwork', () => {
    assert.equal(getPreserveStrokeWidthSupport(readSingleIcon('smile-icon')), 'full')
  })

  it('supports clipped stroke artwork', () => {
    assert.equal(getPreserveStrokeWidthSupport(readSingleIcon('on-line-icon')), 'full')
  })

  it('reports none when an icon has no visible strokes', () => {
    assert.equal(
      getPreserveStrokeWidthSupport('<svg><path fill="black" d="M0 0H16V16H0Z"/></svg>'),
      'none',
    )
  })

  it('reports partial support when a visible stroke uses an unsupported effect', () => {
    assert.equal(
      getPreserveStrokeWidthSupport(
        '<svg><path d="M0 0H16" stroke="black"/><path d="M0 4H16" stroke="black" filter="url(#blur)"/></svg>',
      ),
      'partial',
    )
  })
})
