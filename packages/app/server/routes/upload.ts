import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Hono } from 'hono'
import { generateManifest } from '../utils/manifest.ts'

const currentDir = dirname(fileURLToPath(import.meta.url))
const svgBasePath = resolve(currentDir, '../../../svg')

const uploadRoutes = new Hono()

uploadRoutes.post('/', async (c) => {
  const body = await c.req.json<{
    group: string
    fileName: string
    content: string
  }>()

  const { group, fileName, content } = body

  if (!group || !fileName || !content) {
    return c.json({ error: 'Missing required fields: group, fileName, content' }, 400)
  }

  if (!fileName.endsWith('.svg')) {
    return c.json({ error: 'Only .svg files are allowed' }, 400)
  }

  if (!content.trim().toLowerCase().startsWith('<svg')) {
    return c.json({ error: 'Invalid SVG content' }, 400)
  }

  const groupDir = resolve(svgBasePath, group)
  if (!existsSync(groupDir)) {
    mkdirSync(groupDir, { recursive: true })
  }

  const filePath = resolve(groupDir, fileName)
  writeFileSync(filePath, content, 'utf-8')

  try {
    await generateManifest()
  } catch {
    // manifest generation failure is non-critical
  }

  return c.json({
    success: true,
    path: filePath,
    group,
    fileName,
  })
})

export default uploadRoutes
