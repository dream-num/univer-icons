import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function nodeToWebRequest(req: IncomingMessage): Request {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers.host || 'localhost'
  const path = req.url?.replace(/^\/api/, '') || '/'
  const url = `${protocol}://${host}${path}`
  const method = req.method || 'GET'

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const v of value) headers.append(key, v)
    } else {
      headers.set(key, value)
    }
  }

  return new Request(url, {
    method,
    headers,
    duplex: 'half',
    body: method !== 'GET' && method !== 'HEAD' ? (req as any) : undefined,
  } as RequestInit)
}

async function webToNodeResponse(webRes: Response, nodeRes: ServerResponse) {
  nodeRes.statusCode = webRes.status
  webRes.headers.forEach((value, key) => {
    nodeRes.setHeader(key, value)
  })
  if (webRes.body) {
    const reader = webRes.body.getReader()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      nodeRes.write(value)
    }
  }
  nodeRes.end()
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-server',
      async configureServer(server) {
        const { app } = await import('./server/index.ts')
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith('/api')) {
            return next()
          }
          const webReq = nodeToWebRequest(req)
          Promise.resolve(app.fetch(webReq))
            .then((webRes) => {
              if (webRes) {
                return webToNodeResponse(webRes, res)
              }
              next()
            })
            .catch(next)
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'server'),
    },
  },
})
