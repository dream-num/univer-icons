import amamo from '@amamo/oxlint-config'

export default amamo(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    react: true,
    tailwindcss: { entryPoint: 'packages/app/src/styles.css' },
    vue: true,
  },
  {
    options: { reportUnusedDisableDirectives: 'error' },
    overrides: [
      {
        env: { node: true },
        files: [
          'packages/icons/scripts/**/*.mts',
          'packages/icons-vue/scripts/**/*.mts',
          'packages/svg/scripts/**/*.mts',
        ],
      },
      {
        env: { browser: true },
        files: ['packages/icons/ts/**/*.ts', 'packages/icons/ts/**/*.tsx'],
      },
      {
        files: ['packages/icons/ts/base.tsx'],
        rules: { 'react/refs': 'off' },
      },
      {
        files: ['packages/app/src/main.tsx'],
        rules: { 'jsx-a11y/prefer-tag-over-role': 'off' },
      },
      {
        // ponytail: keep icon bundling sequential to cap memory; batch it if build time becomes a bottleneck.
        files: [
          'packages/icons/scripts/build/index.mts',
          'packages/icons-vue/scripts/build/index.mts',
        ],
        rules: { 'no-await-in-loop': 'off' },
      },
    ],
  },
)
