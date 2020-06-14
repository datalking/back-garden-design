// config parameters and decorators
import React from 'react';
import { configure, storiesOf, addParameters, addDecorator } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

addParameters({
  options: {
    showRoots: true,
    initialActive: 'canvas',
  },
  docs: {
    // container: DocsContainer,
    page: DocsPage,
  },
  dependencies: {
    // display only dependencies/dependents that have a story in storybook
    // by default this is false
    withStoriesOnly: false,

    // completely hide a dependency/dependents block if it has no elements
    // by default this is false
    hideEmpty: false,
  },
});

configure(
  [
    require.context('../src', true, /\.stories\.tsx$/),
    // require.context('../src/components', true, /\.docs\.mdx$/),
  ],
  module,
);
