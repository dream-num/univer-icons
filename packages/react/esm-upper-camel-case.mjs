/** 将components/*.js文件转移到upperComponents目录并将名称驼峰化 */
import gulp from 'gulp';
import camelCase from 'camelcase';
import rename from 'gulp-rename';
import filter from 'gulp-filter';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function upperCamelCase() {
  const cased = camelCase.apply(camelCase, arguments);
  return cased.charAt(0).toUpperCase() + cased.slice(1);
}
const src = join(__dirname, './esm/components/*.*');
const dest = join(__dirname, './esm/upperComponents');

gulp
  .src(src)
  .pipe(filter('**/*.js'))
  .pipe(
    rename((file) => {
      const SPLIT_CHAR = '.';
      const arr = file.basename.split(SPLIT_CHAR);
      arr[0] = upperCamelCase(arr[0]);
      file.basename = `${arr.join(SPLIT_CHAR)}`;
    })
  )
  .pipe(gulp.dest(dest));
