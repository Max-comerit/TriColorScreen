// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.{ts,vue}'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
},
// Override: Allow textarea elements to have closing tags for Netlify Forms
{
  files: ['**/*.vue'],
  rules: {
    'vue/html-self-closing': 'off',
  },
})
