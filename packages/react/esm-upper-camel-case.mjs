import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import camelCase from 'camelcase'
/** 将components/*.js文件转移到upperComponents目录并将名称驼峰化 */
import gulp from 'gulp'
import filter from 'gulp-filter'
import rename from 'gulp-rename'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function upperCamelCase() {
  // eslint-disable-next-line prefer-rest-params
  const cased = camelCase.apply(camelCase, arguments)
  return cased.charAt(0).toUpperCase() + cased.slice(1)
}
const src = join(__dirname, './esm/components/*.*')
const dest = join(__dirname, './esm/upperComponents')

gulp
  .src(src)
  .pipe(filter('**/*.js'))
  .pipe(
    rename((file) => {
      const SPLIT_CHAR = '.'
      const arr = file.basename.split(SPLIT_CHAR)
      arr[0] = upperCamelCase(arr[0])
      file.basename = `${arr.join(SPLIT_CHAR)}`
    }),
  )
  .pipe(gulp.dest(dest))
