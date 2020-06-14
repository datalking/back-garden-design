import { pxToRem } from './styleUtils';

const fontFamilies = {
  serif: '"Noto Serif SC","Noto Serif", serif',
  'sans-serif': '"Noto Sans SC","Noto Sans", "Open Sans", Helvetica, Arial, sans-serif',
  monospace: 'monospace',
};

const fontSizesValues = [
  { name: 'xxl', alias: 'xxlarge', value: 36 },
  { name: 'xl', alias: 'xlarge', value: 24 },
  { name: 'l', alias: 'large', value: 18 },
  { name: '', alias: '', value: 16 },
  { name: 's', alias: 'small', value: 14 },
  { name: 'xs', alias: 'xsmall', value: 12 },
  { name: 'xxs', alias: 'xxsmall', value: 8 },
];
const fontSizes = fontSizesValues.reduce((obj: Record<string, string>, { name, value }) => {
  obj[`text${name ? `-${name}` : ''}`] = pxToRem(value);
  return obj;
}, {});

const fontSizeAliases = fontSizesValues.reduce((obj: Record<string, string>, { alias, value }) => {
  obj[alias] = pxToRem(value);
  return obj;
}, {});

const letterSpacingValues = ['normal', 0.5, 1.0, 1.5];
const letterSpacings = letterSpacingValues.reduce((obj: Record<string, string>, value, index) => {
  const key = typeof value === 'string' ? value : index;
  const nextValue = typeof value === 'string' ? value : pxToRem(value);

  obj[`letter-spacing-${key}`] = nextValue;

  return obj;
}, {});

const fontWeightsValues = [
  { name: 'regular', value: 400 },
  { name: 'bold', value: 700 },
];
const fontWeights = fontWeightsValues.reduce((obj: Record<string, string>, { name, value }) => {
  obj[`${name}`] = `${value}`;
  return obj;
}, {});

// 使用自定义字体时，必需指定font-family和font-size，其他属性可选
export { fontFamilies, fontSizes, fontSizeAliases, letterSpacings, fontWeights };
