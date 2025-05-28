import path from 'node:path'
import camelcase from 'camelcase'
import { dest, src } from 'gulp'
import concat from 'gulp-concat'
import merge from 'merge-stream'

import { createTransformStream } from './transform'
import { allSubDirsForLevel, svgFilesUnder, upperCamelCase } from './utils'

/**
 * generate a manifest for each sub folder under <root>/svg
 *
 * e.g.
 * export const <groupName> = [
 *   { stem: <kebab-name>, icon: <CamelName> },
 * ]
 */
export function generateManifest({ from, to }) {
  return function generateManifest() {
    const dirs = allSubDirsForLevel(
      // eslint-disable-next-line node/prefer-global/process
      path.resolve(process.cwd(), from[0]),
      2,
    ).map(p => svgFilesUnder(p))

    return merge(
      ...dirs.map((dir) => {
        const nameArr = dir.split(path.sep)
        const name = nameArr
          .slice(nameArr.length - 3, nameArr.length - 1)
          .join('-')

        return src(dir)
          .pipe(useItemTemplate())
          .pipe(concat('NOT-VALID'))
          .pipe(useWrapperTemplate(name))
      }),
    )
      .pipe(concat('manifest.ts'))
      .pipe(dest(to))
  }
}

function useItemTemplate() {
  function getItem(stem) {
    return `    { stem: "${stem}", icon: "${upperCamelCase(stem)}" },`
  }

  return createTransformStream((_, { stem: name }) => getItem(name))
}

function useWrapperTemplate(name: string) {
  function getWrapper(name: string, content: string) {
    return `export const ${camelcase(name)}Manifest = [
${content}
];
`
  }

  return createTransformStream((content) => {
    return getWrapper(name, content)
  })
}
