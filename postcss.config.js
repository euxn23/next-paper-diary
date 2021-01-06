module.exports = {
  plugins: [
    'tailwindcss',
    ...(process.env.NODE_ENV === 'production'
      ? [
          ['cssnano', { preset: 'default' }],
          'autoprefixer',
        ]
      : []),
  ],
};
