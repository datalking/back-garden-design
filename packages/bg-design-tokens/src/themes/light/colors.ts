import { colors as palette } from '../../colors';

const lightThemedColors = {
  black: palette.black,
  white: palette.white,
  primary: palette['green_60'],
  secondary: palette['gray_60'],
  success: palette['teal_60'],
  info: palette['blue_60'],
  warning: palette['bronze_60'],
  danger: palette['red_60'],
  textBody: palette['gray_70'],
  textHeading: palette['gray_100'],
  textDimmed: palette['gray_50'],
  dimmed: palette['gray_50'],
  disabled: palette['gray_100'],
  bodyBg: palette['gray_50'],
};

export const colors = {
  ...palette,
  ...lightThemedColors,
};
