import { addons } from '@storybook/addons';

// configure storybook ui tabs
const previewTabs = {
  // 'storybook/docs/panel': { title: 'Docs', index: -1 },
  'storybook/docs/panel': 'Docs',
  canvas: {
    title: 'Canvas',
    // disabled:false,
    hidden: false,
  },
};

addons.setConfig({
  previewTabs,
  panelPosition: 'bottom',
});
