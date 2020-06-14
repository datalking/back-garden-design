import { parseToRgb, rgba } from 'polished';
import { pxToRem } from './styleUtils';
import { colors } from './colors';

// const { red, green, blue } = parseToRgb(colorsMap.night);
const { red, green, blue } = parseToRgb('#0c0d0d');

const outerValues = [
  { y: 1, blur: 2 },
  { y: 2, blur: 4 },
  { y: 3, blur: 6 },
  { y: 6, blur: 12 },
  { y: 12, blur: 24 },
];

const outer = outerValues.reduce((obj: Record<string, string>, { y, blur }, index) => {
  const scale = index + 1;
  obj[`shadow-${scale}`] = `0 ${pxToRem(y)} ${pxToRem(blur)} rgba(${red}, ${green}, ${blue}, 0.15)`;
  return obj;
}, {});

const innerValues = [
  { y: 1, blur: 2, r: 56, g: 61, b: 61, alpha: '0.1' },
  { y: 0, blur: 6 },
];
const inner = innerValues.reduce((obj: Record<string, string>, { y, blur, r, g, b, alpha }, index) => {
  const scale = index + 1;
  const defaultAlpha = '0.18';
  const shadowColor = `rgba(${r || red}, ${g || green}, ${b || blue}, ${alpha || defaultAlpha})`;

  obj[`inner-shadow-${scale}`] = `inset 0 ${pxToRem(y)} ${pxToRem(blur)} ${shadowColor}`;
  return obj;
}, {});

const innerNValues = [{ y: -1, blur: 3 }];
const innerN = innerNValues.reduce((obj: Record<string, string>, { y, blur }, index) => {
  const scale = index + 1;
  obj[`inner-shadow-n${scale}`] = `inset 0 ${pxToRem(y)} ${pxToRem(blur)} rgba(${red}, ${green}, ${blue}, 0.18)`;
  return obj;
}, {});

const borderValues = [{ spread: 1 }];
const border = borderValues.reduce((obj: Record<string, string>, { spread }) => {
  obj[`border-shadow`] = `0 0 0 ${pxToRem(spread)} rgba(${red}, ${green}, ${blue}, 0.15)`;
  return obj;
}, {});

function getButtonActiveInnerShadow(hexColor) {
  return `inset 0 0.25em 0.25em ${rgba(hexColor, 0.8)}`;
}

function getButtonFocusOuterShadow(hexColor) {
  return `0 0 0 0.125em ${rgba(hexColor, 0.3)}`;
}

const boxShadows: any = {};
boxShadows.btnPrimaryActiveShadow = getButtonActiveInnerShadow(colors.green_80);
boxShadows.btnPrimaryFocusShadow = getButtonFocusOuterShadow(colors.green_50);
boxShadows.btnSecondaryActiveShadow = getButtonActiveInnerShadow(colors.grey_80);
// boxShadows.btnSecondaryFocusShadow = getButtonFocusOuterShadow(colors.green_50);
boxShadows.btnSuccessActiveShadow = getButtonActiveInnerShadow(colors.teal_80);
boxShadows.btnSuccessFocusShadow = getButtonFocusOuterShadow(colors.teal_50);
boxShadows.btnInfoActiveShadow = getButtonActiveInnerShadow(colors.blue_80);
boxShadows.btnInfoFocusShadow = getButtonFocusOuterShadow(colors.blue_50);
boxShadows.btnWarningActiveShadow = getButtonActiveInnerShadow(colors.bronze_80);
boxShadows.btnWarningFocusShadow = getButtonFocusOuterShadow(colors.bronze_50);
boxShadows.btnDangerActiveShadow = getButtonActiveInnerShadow(colors.red_80);
boxShadows.btnDangerFocusShadow = getButtonFocusOuterShadow(colors.red_50);

export { outer, inner, innerN, border, boxShadows };
