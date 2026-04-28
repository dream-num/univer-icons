import { Hono } from 'hono'
import { logger } from 'hono/logger'
import gitRoutes from './routes/git.ts'
import iconsRoutes from './routes/icons.ts'
import uploadRoutes from './routes/upload.ts'

export const app = new Hono()

app.use(logger())

app.route('/icons', iconsRoutes)
app.route('/upload', uploadRoutes)
app.route('/git', gitRoutes)

app.get('/health', (c) => c.json({ ok: true }))
