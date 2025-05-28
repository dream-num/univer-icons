import { dest, src } from 'gulp'
import concat from 'gulp-concat'

import { createTransformStream } from './transform'
import { upperCamelCase } from './utils'

export function generateEntry({ from, to, extName = '' }) {
  return function generateEntry() {
    return src(from)
      // eslint-disable-next-line react-hooks/rules-of-hooks
      .pipe(useEntryTemplate(extName))
      .pipe(concat('icons.ts'))
      .pipe(dest(to))
  }
}

const template = `export { default as $ICON_NAME } from './components/$FILE_NAME`
function useEntryTemplate(extName) {
  return createTransformStream((_, { stem: name }) => {
    let templateWithExt = `${template + extName}';`

    if (!name.endsWith('-icon')) {
      templateWithExt = `/** @deprecated */\n${templateWithExt}`
    }

    return templateWithExt
      .replace(/\$ICON_NAME/g, upperCamelCase(name))
      .replace(/\$FILE_NAME/g, name)
  })
}
