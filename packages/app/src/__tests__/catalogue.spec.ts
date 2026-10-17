import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { comparisonFamilies, getFamilyIcons } from '../catalogue.ts'
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
