const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: [
      './src/**/*.tsx',
      './src/**/*.ts',
      './src/pages/style.scss'
    ],
    defaultExtractor: (content) =>
      content.match(/[\w-/:]+(?<!:)/g) || [],
    whitelist: [
      'ace-line',
      'listtype-bullet',
      'listtype-task',
      'line-list-type-code',
      'inline-code'
    ]
  },
  theme: {
    colors: {
      white: colors.white,
      black: colors.black,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.purple,
      pink: colors.pink,
      orange: colors.orange,
      amber: colors.amber
    }
  }
};
