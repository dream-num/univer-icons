import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { it } from 'node:test'
import { drawCanvasIcon } from '@univerjs/icons-svg'

it('loads the Canvas renderer in ESM and CommonJS without browser globals', () => {
  const require = createRequire(import.meta.url)
  assert.equal(typeof drawCanvasIcon, 'function')
  assert.equal(require('@univerjs/icons-svg').drawCanvasIcon, drawCanvasIcon)
})
