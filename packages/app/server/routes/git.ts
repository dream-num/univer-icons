import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Hono } from 'hono'
import { simpleGit } from 'simple-git'

const currentDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(currentDir, '../../../..')

const gitRoutes = new Hono()

const git = simpleGit(repoRoot)

gitRoutes.get('/status', async (c) => {
  const status = await git.status()
  return c.json({
    modified: status.modified,
    created: status.created,
    deleted: status.deleted,
    renamed: status.renamed,
    staged: status.staged,
    not_added: status.not_added,
    ahead: status.ahead,
    behind: status.behind,
    tracking: status.tracking,
    current: status.current,
    isClean: status.isClean(),
    files: status.files.map((f) => ({
      path: f.path,
      index: f.index,
      working_dir: f.working_dir,
    })),
  })
})

gitRoutes.post('/commit', async (c) => {
  const body = await c.req.json<{ message: string }>()
  const { message } = body

  if (!message || !message.trim()) {
    return c.json({ error: 'Commit message is required' }, 400)
  }

  const status = await git.status()
  if (status.isClean()) {
    return c.json({ error: 'No changes to commit' }, 400)
  }

  try {
    await git.add('.')
    await git.commit(message.trim())
    const pushResult = await git.push()

    return c.json({
      success: true,
      commit: message.trim(),
      pushed: pushResult.pushed.length > 0,
      remoteMessages: pushResult.remoteMessages.all,
    })
  } catch (error: any) {
    return c.json(
      {
        error: 'Git operation failed',
        details: error?.message || String(error),
      },
      500,
    )
  }
})

export default gitRoutes
