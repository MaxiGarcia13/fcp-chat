import antfu from '@antfu/eslint-config'

export default antfu({
  vue: false,

  rules: {
    'style/brace-style': ['error', '1tbs'],
  },
})
