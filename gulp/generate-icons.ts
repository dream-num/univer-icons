import type { NormalizationOptions } from './svg-info-check'
import type { IconFileContentGenerator } from './useTemplate'
import { dest, src } from 'gulp'
import rename from 'gulp-rename'
import { svgToElement } from './svg-info-check'
import { svgo } from './svgo'
import { useTemplate } from './useTemplate'

interface IGenerateIconOptions {
  from: string[]
  to: string
  iconGenerator: IconFileContentGenerator
  options?: NormalizationOptions
  extName?: string
}

export function generateIcons({
  from,
  to,
  iconGenerator,
  options,
  extName = '.tsx',
}: IGenerateIconOptions) {
  return function generateIcons() {
    return src(from)
      .pipe(svgo())
      .pipe(svgToElement(options))
      // eslint-disable-next-line react-hooks/rules-of-hooks
      .pipe(useTemplate(iconGenerator))
      .pipe(rename((file) => {
        if (file.basename) {
          file.extname = extName
        }
      }))
      .pipe(dest(to))
  }
}
