module.exports = {
  plugins: [
    'tailwindcss',
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            '@fullhuman/postcss-purgecss',
            {
              content: [
                './src/**/*.tsx',
                './src/**/*.ts',
                'src/pages/style.scss',
              ],
              defaultExtractor: (content) =>
                content.match(/[\w-/:]+(?<!:)/g) || [],
              whitelist: [
                'ace-line',
                'listtype-bullet',
                'listtype-task',
                'line-list-type-code',
                'inline-code',
              ],
            },
          ],
          ['cssnano', { preset: 'default' }],
        ]
      : []),
  ],
};