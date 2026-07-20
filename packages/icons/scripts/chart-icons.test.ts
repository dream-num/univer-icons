import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CandlestickChartIcon, HistogramChartIcon, TreemapChartIcon } from '../dist/esm/index.js'

const CHART_ICONS = [
  ['CandlestickChartIcon', 'candlestick-chart-icon', CandlestickChartIcon],
  ['HistogramChartIcon', 'histogram-chart-icon', HistogramChartIcon],
  ['TreemapChartIcon', 'treemap-chart-icon', TreemapChartIcon],
] as const

describe('chart icons', () => {
  for (const [componentName, iconName, Icon] of CHART_ICONS) {
    it(`${componentName} follows the generated icon contract`, () => {
      const html = renderToStaticMarkup(
        createElement(Icon, {
          className: 'custom-icon',
          focusable: 'false',
          style: { color: 'rgb(1, 2, 3)' },
        }),
      )

      assert.equal(Icon.displayName, componentName)
      assert.match(html, new RegExp(`class="univerjs-icon univerjs-icon-${iconName} custom-icon"`))
      assert.match(html, /viewBox="0 0 16 16"/)
      assert.match(html, /width="1em"/)
      assert.match(html, /height="1em"/)
      assert.match(html, /stroke="currentColor"/)
      assert.match(html, /focusable="false"/)
      assert.match(html, /style="color:rgb\(1, 2, 3\)"/)
      assert.doesNotMatch(html, /(?:fill|stroke)="(?:black|#000(?:000)?)"/)
    })
  }

  it('inherits the candlestick body fill from the icon color', () => {
    const html = renderToStaticMarkup(createElement(CandlestickChartIcon))

    assert.match(html, /fill="currentColor"/)
  })
})
