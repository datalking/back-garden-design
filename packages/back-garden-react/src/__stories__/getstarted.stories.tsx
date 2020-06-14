import React from 'react';
import { Button } from '..';
import mdx from './getstarted.docs.mdx';

export default {
  // id: 'IntroGettingStarted',
  title: 'Intro/Getting Started',
  // component: Button,
  // includeStories: [],
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

export const basic1 = () => <Button>index</Button>;
