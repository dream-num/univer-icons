import { dest, src } from 'gulp';
import concat from 'gulp-concat';

import { createTransformStream } from './transform';
import { upperCamelCase } from './utils';

export const generateEntry = ({ from, to, extName = '' }) =>
  function generateEntry() {
    return src(from)
      .pipe(useEntryTemplate(extName))
      .pipe(concat('icons.ts'))
      .pipe(dest(to));
  };

const template = `export { default as $ICON_NAME } from './components/$FILE_NAME`;
const useEntryTemplate = (extName) =>
  createTransformStream((_, { stem: name }) => {
    const templateWithExt = template + extName + `';`;
    return templateWithExt
      .replace(/\$ICON_NAME/g, upperCamelCase(name))
      .replace(/\$FILE_NAME/g, name);
  });
