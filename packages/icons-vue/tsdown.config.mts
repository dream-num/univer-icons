import { defineConfig } from 'tsdown'

const entry = ['./ts/index.ts']

export default defineConfig([
  {
    entry,
    platform: 'neutral',
    format: 'es',
    outDir: './dist/esm',
    unbundle: true,
    dts: true,
    clean: ['./dist/esm', './dist/cjs'],
    sourcemap: false,
    hash: false,
    outExtensions: () => ({
      js: '.js',
      dts: '.d.ts',
    }),
  },
  {
    entry,
    format: 'cjs',
    outDir: './dist/cjs',
    unbundle: true,
    dts: false,
    clean: false,
    sourcemap: false,
    hash: false,
    outExtensions: () => ({
      js: '.cjs',
    }),
  },
])
