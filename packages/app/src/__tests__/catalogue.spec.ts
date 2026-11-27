import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import {
  comparisonFamilies,
  filterIconCatalogue,
  getCatalogueFacetCounts,
  getFamilyIcons,
  getRecentIconVersions,
  getTotalIconCount,
} from '../catalogue.ts'
import { createSvgIconGroups } from '../svg-catalogue.ts'

const svgModules = Object.fromEntries(
  ['single', 'double', 'other'].flatMap((group) => {
    const directory = new URL(`../../../svg/${group}/`, import.meta.url)
    return readdirSync(directory)
      .filter((name) => name.endsWith('.svg'))
      .map((name) => [`${group}/${name}`, readFileSync(new URL(name, directory), 'utf8')])
  }),
)
const groups = createSvgIconGroups(svgModules)
const recentVersions = new Set(getRecentIconVersions(groups, 3))

test('every comparison family resolves to renderable sources in its requested order', () => {
  for (const family of comparisonFamilies) {
    const icons = getFamilyIcons(groups, family.icons)
    assert.deepEqual(
      icons.map((icon) => icon.name),
      family.icons,
    )
    assert.ok(icons.every((icon) => icon.svg.includes('<svg')))
  }
})

test('family selection spans catalogue groups and reports missing sources', () => {
  const names = ['SmileDoubleIcon', 'SearchIcon', 'FormulaMatrixIcon']
  assert.deepEqual(
    getFamilyIcons(groups, names).map((icon) => icon.name),
    names,
  )
  assert.throws(() => getFamilyIcons(groups, ['MissingIcon']), /Missing family icon: MissingIcon/)
})

test('filterIconCatalogue combines group, product, stroke support, recent, and search filters', () => {
  const total = getTotalIconCount(groups)
  const allResult = filterIconCatalogue(
    groups,
    {
      group: 'all',
      product: 'all',
      recentOnly: false,
      searchTerm: '',
      strokeSupport: 'all',
      subgroup: 'all',
    },
    recentVersions,
  )
  assert.equal(allResult.matchCount, total)

  const doubleResult = filterIconCatalogue(
    groups,
    {
      group: 'double',
      product: 'all',
      recentOnly: false,
      searchTerm: '',
      strokeSupport: 'all',
      subgroup: 'all',
    },
    recentVersions,
  )
  assert.ok(doubleResult.matchCount > 0)
  assert.ok(doubleResult.groups.every((group) => group.id === 'double'))

  const strokeFullResult = filterIconCatalogue(
    groups,
    {
      group: 'all',
      product: 'sheets',
      recentOnly: false,
      searchTerm: '',
      strokeSupport: 'full',
      subgroup: 'all',
    },
    recentVersions,
  )
  assert.ok(strokeFullResult.matchCount > 0)
  for (const group of strokeFullResult.groups) {
    for (const subgroup of group.subgroups) {
      for (const icon of subgroup.items) {
        assert.equal(icon.preserveStrokeWidthSupport, 'full')
        assert.ok(icon.products.includes('sheets'))
      }
    }
  }
})

test('getCatalogueFacetCounts reports consistent group and stroke totals', () => {
  const facets = getCatalogueFacetCounts(
    groups,
    {
      group: 'all',
      product: 'all',
      recentOnly: false,
      searchTerm: '',
      strokeSupport: 'all',
      subgroup: 'all',
    },
    recentVersions,
  )
  const total = getTotalIconCount(groups)

  assert.equal(facets.groups.all, total)
  assert.equal(facets.groups.single + facets.groups.double + facets.groups.multi, total)
  assert.equal(facets.strokeSupport.full + facets.strokeSupport.none, total)
  assert.ok(facets.recent > 0)
})
