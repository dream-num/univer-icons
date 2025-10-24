import { globSync, writeFileSync } from 'node:fs'
import { cwd } from 'node:process'

function main() {
  const currentPath = cwd()

  const svgFiles = globSync('**/*.svg', {
    cwd: currentPath,
  })

  const manifest: Map<string, {
    name: string
    componentName: string
    group: string
    path: string
  }[]> = new Map()

  for (const filePath of svgFiles) {
    const key = filePath.split('/')[0]

    if (!manifest.has(key)) {
      manifest.set(key, [])
    }

    const iconName = filePath.split('/').pop()!.replace('.svg', '')

    manifest.get(key)!.push({
      name: iconName,
      componentName: iconName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(''),
      group: key,
      path: `${currentPath}/${filePath}`,
    })
  }

  writeFileSync(
    `${currentPath}/manifest.json`,
    JSON.stringify(Object.fromEntries(manifest), null, 2),
  )
}

main()
