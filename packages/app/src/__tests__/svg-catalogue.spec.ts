import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { createSvgIconGroups, scopeSvgIds } from '../svg-catalogue.ts'

test('repeated chart previews keep clip references local to each instance', () => {
  const svg = readFileSync(
    new URL('../../../svg/single/pie-chart-icon.svg', import.meta.url),
    'utf8',
  )
  const previews = ['light-16', 'dark-32'].map((prefix) => scopeSvgIds(svg, prefix))
  const allIds = previews.flatMap((preview) =>
    [...preview.matchAll(/id="([^"]+)"/g)].map((match) => match[1]),
  )
  assert.equal(new Set(allIds).size, allIds.length)
  for (const preview of previews) {
    const id = /id="([^"]+)"/.exec(preview)?.[1]
    assert.ok(id)
    assert.ok(preview.includes(`clip-path="url(#${id})"`))
  }
})

test('scoping preserves external links and connects local paint and use references', () => {
  const svg = `<svg><defs><linearGradient id='paint'/><path id="shape"/></defs><use href="#shape" fill="url(#paint)"/><use xlink:href='#shape'/><a href="https://example.com/#shape"/></svg>`
  const scoped = scopeSvgIds(svg, 'preview')
  assert.match(scoped, /id='preview-paint'/)
  assert.match(scoped, /fill="url\(#preview-paint\)"/)
  assert.match(scoped, /id="preview-shape"/)
  assert.match(scoped, /href="#preview-shape"/)
  assert.match(scoped, /xlink:href='#preview-shape'/)
  assert.match(scoped, /href="https:\/\/example.com\/#shape"/)
})

test('missing manifest metadata is reported instead of silently changing family classification', () => {
  assert.throws(
    () => createSvgIconGroups({ 'single/missing-icon.svg': '<svg/>' }),
    /Missing manifest entry/,
  )
})
