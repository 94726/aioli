module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
    '@vue/eslint-config-typescript/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['warn'],
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-undef': 'off',
    'vue/multi-word-component-names': 0,
    'vue/no-dupe-keys': 0,
  },
}
