import { parallel, series } from 'gulp';

import { generateEntry } from '../../../gulp/generate-entry';
import { generateManifest } from '../../../gulp/generate-manifest';
import { generateIcons } from '../../../gulp/generate-icons';
import { clearDir } from '../../../gulp/utils';

import { reactGetIconFileContent } from './react-use-template';

export function reactTask(
  singleColorIconDirs,
  customizedIconDirs,
  otherIconDirs
) {
  return series(
    clearDir([
      'packages/react/dist',
      'packages/react/src/components',
      'packages/react/esm',
    ]),

    parallel(
      generateIcons({
        from: [...singleColorIconDirs],
        to: 'packages/react/src/components',
        iconGenerator: reactGetIconFileContent,
        options: {
          replaceColor: true,
        },
      }),
      generateIcons({
        from: [...customizedIconDirs],
        to: 'packages/react/src/components',
        iconGenerator: reactGetIconFileContent,
        options: {
          replaceColor: true,
          customizedColor: true,
        },
      }),

      generateIcons({
        from: [...otherIconDirs],
        to: 'packages/react/src/components',
        iconGenerator: reactGetIconFileContent,
      }),

      generateManifest({
        from: ['svg'],
        to: `packages/react/src`,
      })
    ),

    generateEntry({
      from: `packages/react/src/components/*`,
      to: `packages/react/src`,
    })
  );
}
