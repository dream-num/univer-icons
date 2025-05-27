import path from 'path';
import fs from 'fs';

import { upperCamelCase } from '../../../gulp/utils';
let template = fs.readFileSync(
  path.resolve(__dirname, 'template/icon.tsx'),
  'utf-8'
);

export function reactGetIconFileContent({ name, element }): string {

  
  const result =  template
    .replace(/\$ICON_NAME/g, upperCamelCase(name))
    .replace(/\$ELEMENT/g, element)
    .replace(/\$KEY/g, name);

    if (!name.endsWith('-icon')) {
      return result.replace('\nexport const', `/** @deprecated */\nexport const`);
    }

    return result
}
