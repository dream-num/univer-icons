import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Hono } from 'hono'

const currentDir = fileURLToPath(new URL('.', import.meta.url))
const manifestPath = resolve(currentDir, '../../../svg/manifest.json')

function loadManifest() {
  return JSON.parse(readFileSync(manifestPath, 'utf-8'))
}

const iconsRoutes = new Hono()

iconsRoutes.get('/', (c) => {
  return c.json(loadManifest())
})

iconsRoutes.get('/:group/:name', (c) => {
  const group = c.req.param('group')
  const name = c.req.param('name')

  const manifest = loadManifest()
  const groupIcons = manifest[group]
  if (!groupIcons) {
    return c.json({ error: 'Group not found' }, 404)
  }

  const icon = groupIcons.find((i: { name: string; path: string }) => i.name === name)
  if (!icon) {
    return c.json({ error: 'Icon not found' }, 404)
  }

  const content = readFileSync(icon.path, 'utf-8')
  return c.text(content)
})

export default iconsRoutes
