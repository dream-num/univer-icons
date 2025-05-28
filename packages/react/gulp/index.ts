import { parallel, series } from 'gulp'

import { generateEntry } from '../../../gulp/generate-entry'
import { generateIcons } from '../../../gulp/generate-icons'
import { generateManifest } from '../../../gulp/generate-manifest'
import { clearDir } from '../../../gulp/utils'

import { reactGetIconFileContent } from './react-use-template'

export function reactTask(
  singleColorIconDirs,
  customizedIconDirs,
  otherIconDirs,
  v4SingleIconDirs,
  v4DoubleIconDirs,
  v4OtherIconDirs,
) {
  return series(
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    clearDir([
      'packages/react/dist',
      'packages/react/src/components',
      'packages/react/esm',
    ]),

    parallel(
      generateIcons({
        from: [...singleColorIconDirs, ...v4SingleIconDirs],
        to: 'packages/react/src/components',
        iconGenerator: reactGetIconFileContent,
        options: {
          replaceColor: true,
        },
      }),
      generateIcons({
        from: [...customizedIconDirs, ...v4DoubleIconDirs],
        to: 'packages/react/src/components',
        iconGenerator: reactGetIconFileContent,
        options: {
          replaceColor: true,
          customizedColor: true,
        },
      }),

      generateIcons({
        from: [...otherIconDirs, ...v4OtherIconDirs],
        to: 'packages/react/src/components',
        iconGenerator: reactGetIconFileContent,
      }),

      generateManifest({
        from: ['svg'],
        to: `packages/react/src`,
      }),
    ),

    generateEntry({
      from: `packages/react/src/components/*`,
      to: `packages/react/src`,
    }),
  )
}
