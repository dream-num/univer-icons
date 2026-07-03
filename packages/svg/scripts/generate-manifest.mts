import { globSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { argv, cwd } from 'node:process'
import { spawnSync } from 'node:child_process'
import { createIconMetadata, type IconMetadata } from '../icon-metadata.mts'

export type ManifestIcon = IconMetadata & {
  name: string
  componentName: string
  group: string
  path: string
  updatedVer: string
}

type UpdatedVersions = Record<string, string>

export function createManifest(
  currentPath: string,
  svgFiles: string[],
  updatedVersions: UpdatedVersions = getGitUpdatedVersions(currentPath, svgFiles),
) {
  const manifest: Map<string, ManifestIcon[]> = new Map()

  for (const filePath of svgFiles) {
    const key = filePath.split('/')[0]

    if (!manifest.has(key)) {
      manifest.set(key, [])
    }

    const iconName = filePath.split('/').pop()!.replace('.svg', '')
    const componentName = iconName
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    manifest.get(key)!.push({
      name: iconName,
      componentName,
      group: key,
      path: `${currentPath}/${filePath}`,
      updatedVer: updatedVersions[filePath] ?? 'unreleased',
      ...createIconMetadata(iconName, key),
    })
  }

  return Object.fromEntries(manifest)
}

export function getGitUpdatedVersions(currentPath: string, svgFiles: string[]): UpdatedVersions {
  const latestCommits = getLatestSvgCommits(currentPath, svgFiles)
  const versionByCommit = new Map<string, string>()

  return Object.fromEntries(
    svgFiles.map((filePath) => {
      const commit = latestCommits[filePath]

      if (!commit) {
        return [filePath, 'unreleased']
      }

      if (!versionByCommit.has(commit)) {
        versionByCommit.set(commit, getReleaseVersionForCommit(currentPath, commit))
      }

      return [filePath, versionByCommit.get(commit)!]
    }),
  )
}

function getLatestSvgCommits(currentPath: string, svgFiles: string[]) {
  const svgFileSet = new Set(svgFiles)
  const gitPrefix = runGit(currentPath, ['rev-parse', '--show-prefix']).trim()
  const log = runGit(currentPath, [
    'log',
    '--format=__commit__%H',
    '--name-only',
    '--',
    ...svgFiles,
  ])
  const latestCommits: Record<string, string> = {}
  let currentCommit = ''

  for (const line of log.split(/\r?\n/)) {
    if (line.startsWith('__commit__')) {
      currentCommit = line.slice('__commit__'.length)
      continue
    }

    const filePath = gitPrefix && line.startsWith(gitPrefix) ? line.slice(gitPrefix.length) : line

    if (currentCommit && svgFileSet.has(filePath) && !latestCommits[filePath]) {
      latestCommits[filePath] = currentCommit
    }
  }

  return latestCommits
}

function getReleaseVersionForCommit(currentPath: string, commit: string) {
  const described = runGit(
    currentPath,
    ['describe', '--contains', '--match', 'v[0-9]*.[0-9]*.[0-9]*', commit],
    {
      fallback: '',
    },
  ).trim()
  const versionMatch = /^v(?<version>\d+\.\d+\.\d+)/.exec(described)

  return versionMatch?.groups?.version ?? 'unreleased'
}

function runGit(currentPath: string, args: string[], options: { fallback?: string } = {}) {
  const result = spawnSync('git', ['-C', currentPath, ...args], {
    encoding: 'utf-8',
  })

  if (result.status === 0) {
    return result.stdout
  }

  if (options.fallback !== undefined) {
    return options.fallback
  }

  throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`)
}

function main() {
  const currentPath = cwd()

  const svgFiles = globSync('**/*.svg', {
    cwd: currentPath,
  })

  writeFileSync(
    `${currentPath}/manifest.json`,
    JSON.stringify(createManifest(currentPath, svgFiles), null, 2),
  )
}

if (argv[1] && resolve(argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
