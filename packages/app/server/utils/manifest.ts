import { exec } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execAsync = promisify(exec)
const currentDir = dirname(fileURLToPath(import.meta.url))

export async function generateManifest() {
  const scriptPath = resolve(currentDir, '../../../svg/scripts/generate-manifest.ts')
  const { stderr } = await execAsync(`node --experimental-strip-types ${scriptPath}`, {
    cwd: resolve(currentDir, '../../../svg'),
  })
  if (stderr && !stderr.includes('ExperimentalWarning')) {
    console.warn('Manifest generation stderr:', stderr)
  }
}
