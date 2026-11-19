import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { it } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

it('loads and renders icons through both package entry points', async () => {
  const require = createRequire(import.meta.url)
  const esm = await import('@univerjs/icons')
  const cjs = require('@univerjs/icons') as typeof esm

  for (const { AIcon } of [cjs, esm]) {
    assert.match(renderToStaticMarkup(createElement(AIcon)), /^<svg\b/)
  }
})
