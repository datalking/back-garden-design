import initialVars from './initialVariables';
import { findColorInvert, findLightColor, findDarkColor } from './functions';

export default function getVariables(overrides = {}) {
  const derived = {
    ...initialVars,
    ...overrides,
  };

  function setDefault(key, defaultVal) {
    derived[key] = derived[key] || defaultVal;
  }

  setDefault('primary', derived['turquoise']);
  setDefault('success', derived['green']);
  setDefault('info', derived['cyan']);
  setDefault('warning', derived['yellow']);
  setDefault('danger', derived['red']);

  setDefault('light', derived['white-ter']);
  setDefault('dark', derived['grey-darker']);

  // Invert colors

  setDefault('orange-invert', findColorInvert(derived['orange']));
  setDefault('yellow-invert', findColorInvert(derived['yellow']));
  setDefault('green-invert', findColorInvert(derived['green']));
  setDefault('turquoise-invert', findColorInvert(derived['turquoise']));
  setDefault('cyan-invert', findColorInvert(derived['cyan']));
  setDefault('blue-invert', findColorInvert(derived['blue']));
  setDefault('purple-invert', findColorInvert(derived['purple']));
  setDefault('red-invert', findColorInvert(derived['red']));

  setDefault('primary-invert', findColorInvert(derived['primary']));
  setDefault('primary-light', findLightColor(derived['primary']));
  setDefault('primary-dark', findDarkColor(derived['primary']));
  setDefault('info-invert', findColorInvert(derived['info']));
  setDefault('success-invert', findColorInvert(derived['success']));
  setDefault('warning-invert', findColorInvert(derived['warning']));
  setDefault('danger-invert', findColorInvert(derived['danger']));

  setDefault('light-invert', findColorInvert(derived['light']));
  setDefault('dark-invert', findColorInvert(derived['dark']));

  // General colors

  setDefault('schema-main', derived['white']);
  setDefault('schema-main-bis', derived['white-bis']);
  setDefault('schema-main-ter', derived['white-ter']);
  setDefault('schema-invert', derived['black']);
  setDefault('schema-invert-bis', derived['black-bis']);
  setDefault('schema-invert-ter', derived['black-ter']);

  setDefault('background', derived['white-ter']);

  setDefault('border', derived['grey-lighter']);
  setDefault('border-hover', derived['grey-light']);
  setDefault('border-light', derived['grey-lightest']);
  setDefault('border-light-hover', derived['grey-light']);

  // Text colors

  setDefault('text', derived['grey-dark']);
  setDefault('text-invert', findColorInvert(derived['text']));
  setDefault('text-light', derived['grey']);
  setDefault('text-strong', derived['grey-darker']);

  // Code colors

  setDefault('code', derived['red']);
  setDefault('code-background', derived['background']);

  setDefault('pre', derived['text']);
  setDefault('pre-background', derived['background']);

  // Link colors

  setDefault('link', derived['blue']);
  setDefault('link-invert', derived['blue-invert']);
  setDefault('link-visited', derived['purple']);

  setDefault('link-hover', derived['grey-darker']);
  setDefault('link-hover-border', derived['grey-light']);

  setDefault('link-focus', derived['grey-darker']);
  setDefault('link-focus-border', derived['blue']);

  setDefault('link-active', derived['grey-darker']);
  setDefault('link-active-border', derived['grey-dark']);

  // Typography

  setDefault('family-primary', derived['family-sans-serif']);
  setDefault('family-code', derived['family-monospace']);

  setDefault('size-small', derived['size-7']);
  setDefault('size-normal', derived['size-6']);
  setDefault('size-medium', derived['size-5']);
  setDefault('size-large', derived['size-4']);

  // Lists and maps
  // setDefault('colors', {
  setDefault('colors4Bulma', {
    white: [derived['white'], derived['black']],
    black: [derived['black'], derived['white']],
    light: [derived['light'], derived['light-invert']],
    dark: [derived['dark'], derived['dark-invert']],
    primary: [derived['primary'], derived['primary-invert']],
    link: [derived['link'], derived['link-invert']],
    info: [derived['info'], derived['info-invert']],
    success: [derived['success'], derived['success-invert']],
    warning: [derived['warning'], derived['warning-invert']],
    danger: [derived['danger'], derived['danger-invert']],
    ...derived['custom-colors'],
  });

  setDefault('shades', {
    'black-bis': derived['black-bis'],
    'black-ter': derived['black-ter'],
    'grey-darker': derived['grey-darker'],
    'grey-dark': derived['grey-dark'],
    grey: derived['grey'],
    'grey-light': derived['grey-light'],
    'grey-lighter': derived['grey-lighter'],
    'white-ter': derived['white-ter'],
    'white-bis': derived['white-bis'],
    ...derived['custom-shades'],
  });

  setDefault('sizes', [
    derived['size-1'],
    derived['size-2'],
    derived['size-3'],
    derived['size-4'],
    derived['size-5'],
    derived['size-6'],
    derived['size-7'],
  ]);

  // Controls
  setDefault('control-radius', derived['radius']);
  setDefault('control-radius-small', derived['radius-small']);
  setDefault('control-padding-vertical', `calc(0.5em - ${derived['control-border-width']})`);
  setDefault('control-padding-horizontal', `calc(0.75em - ${derived['control-border-width']})`);

  setDefault('body-background-color', derived['white']);
  setDefault('body-family', derived['family-primary']);
  setDefault('body-color', derived['text']);
  setDefault('body-weight', derived['weight-normal']);
  setDefault('code-family', derived['family-code']);
  setDefault('hr-background-color', derived['background']);
  setDefault('strong-color', derived['text-strong']);
  setDefault('strong-weight', derived['weight-bold']);

  return Object.freeze(derived);
}
