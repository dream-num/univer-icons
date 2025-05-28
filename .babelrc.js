module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '58',
          ie: '10',
        },
        useBuiltIns: 'usage',
        corejs: 2,
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-transform-runtime'],
  sourceMaps: true,
  env: {
    production: {
      plugins: ['transform-react-remove-prop-types'],
    },
  },
  // sourceType: 'unambiguous'
}
