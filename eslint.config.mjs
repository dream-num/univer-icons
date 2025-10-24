import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  rules: {
    'eslint-comments/no-unlimited-disable': 'off',
  },
})
