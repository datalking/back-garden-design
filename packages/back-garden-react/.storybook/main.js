// configure storybook’s webpack by changing .storybook/main.js:
// similar to presets.js/webpack.config.js
const path = require('path');
const createCompiler = require('@storybook/addon-docs/mdx-compiler-plugin');

module.exports = {
  // stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs/register'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.docs\.mdx$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-transform-react-jsx'],
          },
        },
        {
          loader: '@mdx-js/loader',
          options: {
            // compilers: [createCompiler({})],
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.tsx?$/,
      include: path.resolve(__dirname, '../'),
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [
                'react-app',
                {
                  flow: false,
                  typescript: true,
                },
              ],
            ],
          },
        },
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    });
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};
