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

      const ts = getIconComponent({
        element,
        name: icon.name,
        componentName: icon.componentName,
      })

      exportsFileLines.push(`export { ${icon.componentName} } from './${icon.name}.js';`)
      writeFileSync(`${tsDir}/${icon.name}.ts`, ts)
    }
  }

  writeFileSync(`${tsDir}/index.ts`, exportsFileLines.join('\n'), 'utf-8')
}

function cleanupGeneratedTsFiles() {
  for (const file of readdirSync(tsDir)) {
    if (file !== 'base.ts' && file.endsWith('.ts')) {
      rmSync(resolve(tsDir, file), { force: true })
    }
  }
}

async function compileTsFile() {
  rmSync(distDir, { force: true, recursive: true })

  for (const icon of [{ name: 'base' }, ...Object.values(manifest).flat(), { name: 'index' }]) {
    const esmFile = resolve(distDir, `esm/${icon.name}.js`)
    const cjsFile = resolve(distDir, `cjs/${icon.name}.cjs`)
    const bundle = await rolldown({
      input: resolve(tsDir, `${icon.name}.ts`),
      external: [/^vue$/, /^\.{1,2}\//],
    })

    await bundle.write({
      file: esmFile,
      format: 'es',
      exports: 'named',
    })
    await bundle.write({
      file: cjsFile,
      format: 'cjs',
      exports: 'named',
    })
    rewriteCjsRelativeRequires(cjsFile)
  }
}

function rewriteCjsRelativeRequires(file: string) {
  const code = readFileSync(file, 'utf-8')
  const rewritten = code.replace(/require\((['"])(\.{1,2}\/[^'"]+)\.js\1\)/g, 'require($1$2.cjs$1)')

  writeFileSync(file, rewritten, 'utf-8')
}

async function main() {
  createComponentFiles()
  await compileTsFile()
}

main()
