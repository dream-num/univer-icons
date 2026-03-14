import type { IconNode } from './normalize-ast'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import manifest from '@univerjs/icons-svg/manifest'
import { normalizeAST } from './normalize-ast'
import { parseSvg } from './parse-svg'
import { getIconComponent } from './templates'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

function createComponentFiles() {
  const groups = Object.values(manifest)
  const tsDir = resolve(__dirname, '../../ts')

  if (!existsSync(tsDir)) {
    mkdirSync(tsDir)
  }

  const exportsFileLines: string[] = []
  for (const icons of groups) {
    for (const icon of icons) {
      const raw = readFileSync(icon.path, 'utf-8')
      const ast = parseSvg(raw)
      const element = normalizeAST(icon.name, ast.children as unknown as IconNode[])[0]
      const source = getIconComponent({
        element,
        name: icon.name,
        componentName: icon.componentName,
      })

      exportsFileLines.push(`export { ${icon.componentName} } from './${icon.name}';`)

      writeFileSync(`${tsDir}/${icon.name}.ts`, source)
    }
  }

  writeFileSync(`${tsDir}/index.ts`, exportsFileLines.join('\n'), 'utf-8')
}

function main() {
  createComponentFiles()
}

main()
