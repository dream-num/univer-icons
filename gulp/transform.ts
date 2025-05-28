import type File from 'vinyl'
import through from 'through2'

export function createTransformStream(fn: (raw: string, file: File) => string) {
  return through.obj((file: File, encoding, done) => {
    if (file.isBuffer()) {
      const before = file.contents.toString(encoding)
      try {
        const after = fn(before, file)
        // eslint-disable-next-line node/prefer-global/buffer
        file.contents = Buffer.from(after)
        done(null, file)
      }
      catch (err) {
        done(err, null)
      }
    }
    else {
      done(null, file)
    }
  })
}

export function createTransformStreamAsync(fn: (raw: string, file: File) => Promise<string>) {
  return through.obj((file: File, encoding, done) => {
    if (file.isBuffer()) {
      const before = file.contents.toString(encoding)
      fn(before, file)
        .then((after) => {
          // eslint-disable-next-line node/prefer-global/buffer
          file.contents = Buffer.from(after)
          done(null, file)
        })
        .catch((err) => {
          done(err, null)
        })
    }
    else {
      done(null, file)
    }
  })
}
