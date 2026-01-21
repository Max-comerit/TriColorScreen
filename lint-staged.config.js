/** @type {import('lint-staged').Config} */
export default {
  // JavaScript / TypeScript / Vue
  '*.{js,ts,vue}': ['prettier --write', 'eslint --fix'],

  // JSON / Markdown / config files
  '*.{json,md,yml,yaml}': ['prettier --write'],
}
