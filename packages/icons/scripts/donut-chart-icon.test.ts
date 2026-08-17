import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DonutChartIcon } from '../dist/esm/index.js'

describe('DonutChartIcon', () => {
  it('exports a chart-owned segmented ring icon', () => {
    const html = renderToStaticMarkup(createElement(DonutChartIcon))

    assert.match(html, /univerjs-icon-donut-chart-icon/)
    assert.match(html, /stroke-dasharray=/)
  })
})
