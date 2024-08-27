module.exports = {
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  trailingComma: 'all', //default
  bracketSpacing: true, //default
  arrowParens: 'always', //default
  endOfLine: 'lf', //default
  plugins: ['prettier-plugin-tailwindcss'], //tailwind class sorter
  tailwindFunctions: ['cn'] //enable sorting utility classes
}