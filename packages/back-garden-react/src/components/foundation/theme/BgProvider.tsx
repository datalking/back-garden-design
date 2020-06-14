import React from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from 'bg-design-tokens';
import { addBulmaThemeVars } from './bulma';

export interface BgThemeProps {
  themeName?: string;
  themeOverrideVars?: object;
  children: React.ReactNode;
}

/**
 * merge predefined theme and components-related theme
 * @param themeName default=light/dark
 */
const themePicker = (themeName?: string) => {
  switch (themeName) {
    case 'dark':
      return addBulmaThemeVars(darkTheme);
    default:
      return addBulmaThemeVars(lightTheme);
  }
};

export const BgTheme: React.FunctionComponent<BgThemeProps> = props => {
  const { children, themeName, themeOverrideVars } = props;
  const selectedTheme = themePicker(themeName);
  // merge custom theme variables
  const mergedTheme = { ...selectedTheme, ...themeOverrideVars };
  return <ThemeProvider theme={mergedTheme}>{children}</ThemeProvider>;
};
