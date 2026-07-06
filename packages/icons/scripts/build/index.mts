import type { IconNode } from '#build/normalize-ast'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import manifest from '@univerjs/icons-svg/manifest' with { type: 'json' }
import { rolldown } from 'rolldown'
import { normalizeAST } from '#build/normalize-ast'
import { parseSvg } from '#build/parse-svg'
import { getIconComponent } from '#build/templates'

const dirname = fileURLToPath(new URL('.', import.meta.url))
const packageRoot = resolve(dirname, '../..')
const tsDir = resolve(packageRoot, 'ts')
const distDir = resolve(packageRoot, 'dist')

function createComponentFiles() {
  const groups = Object.values(manifest)

  if (!existsSync(tsDir)) {
    mkdirSync(tsDir)
  }
  cleanupGeneratedTsFiles()

  const exportsFileLines: string[] = []
  for (const icons of groups) {
    for (const icon of icons) {
      const raw = readFileSync(icon.path, 'utf-8')

      const ast = parseSvg(raw)
      const element = normalizeAST(icon.name, ast.children as unknown as IconNode[])[0]

      const tsx = getIconComponent({
        element,
        name: icon.name,
        componentName: icon.componentName,
      })

      exportsFileLines.push(`export { ${icon.componentName} } from './${icon.name}.js';`)

      writeFileSync(`${tsDir}/${icon.name}.tsx`, tsx)
    }
  }

  writeFileSync(`${tsDir}/index.tsx`, exportsFileLines.join('\n'), 'utf-8')
}

function cleanupGeneratedTsFiles() {
  for (const file of readdirSync(tsDir)) {
    if (file !== 'base.tsx' && file.endsWith('.tsx')) {
      rmSync(resolve(tsDir, file), { force: true })
    }
  }
}

async function compileTsFile() {
  rmSync(distDir, { force: true, recursive: true })

  for (const icon of [{ name: 'base' }, ...Object.values(manifest).flat(), { name: 'index' }]) {
    const bundle = await rolldown({
      input: `ts/${icon.name}.tsx`,
      external: [/^react/, /^.\//],
    })

    await bundle.write({
      file: `dist/esm/${icon.name}.js`,
      format: 'es',
      exports: 'named',
    })
    await bundle.write({
      file: `dist/cjs/${icon.name}.cjs`,
      format: 'cjs',
      exports: 'named',
    })
  }
}

function main() {
  createComponentFiles()
  compileTsFile()
}

main()
