import { typography, spacing, shadows, radii, transitions } from '../index';

const baseTheme = {
  breakpoints: ['576px', '992px'],
  fonts: typography.fontFamilies,
  fontSizes: { ...typography.fontSizes, ...typography.fontSizeAliases },
  fontWeights: typography.fontWeights,
  letterSpacings: [...Object.values(typography.letterSpacings)],
  space: Object.values(spacing.scale),
  lineHeights: Object.values(spacing.scale),
  radii: radii.values,
  // shadows: Object.values(shadows.outer),
  shadows: { ...shadows.boxShadows },
  innerShadows: Object.values(shadows.inner),
  innerShadowsN: Object.values(shadows.innerN),
  borderShadows: Object.values(shadows.border),
  transitions: transitions.durations,
};

export { baseTheme };
