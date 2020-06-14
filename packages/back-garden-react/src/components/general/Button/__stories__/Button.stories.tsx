import React from 'react';
import { Button } from '../Button';
import mdx1 from './Button1.docs.mdx';

export default {
  // id: 'Components/Button',
  title: 'Components/Button',
  component: Button,
  // includeStories: [],
  parameters: {
    docs: {
      page: mdx1,
    },
  },
};

export const basic = () => <Button>Default</Button>;
