import { rgba } from 'polished';

export const buttonDesignTokens = theme => ({
  'button-color': theme['text-strong'],
  'button-background-color': theme['schema-main'],
  'button-border-color': theme['border'],
  'button-border-width': theme['control-border-width'],

  'button-padding-vertical': `calc(0.5em - ${theme['control-border-width']})`,
  'button-padding-horizontal': '1em',

  'button-hover-color': theme['link-hover'],
  'button-hover-border-color': theme['grey-light'],

  'button-focus-color': theme['link-focus'],
  'button-focus-border-color': theme['border'],
  'button-focus-box-shadow-size': '0 0 0 0.125em',
  'button-focus-box-shadow-color': rgba(theme['grey-light'], 0.3),
  'button-focus-box-shadow-color-primary': rgba(theme.colors['green_80'], 0.3),

  'button-active-color': theme['link-active'],
  'button-active-border-color': theme['grey-light'],
  'button-active-box-shadow': `inset 0 4px 4px ${rgba(theme['grey-darker'], 0.25)} `,

  'button-text-color': theme['text'],
  'button-text-decoration': 'underline',
  'button-text-hover-background-color': theme['background'],
  'button-text-hover-color': theme['text-strong'],

  'button-disabled-background-color': theme['schema-main'],
  'button-disabled-border-color': theme['border'],
  'button-disabled-shadow': 'none',
  'button-disabled-opacity': '0.5',

  'button-static-color': theme['text-light'],
  'button-static-background-color': theme['schema-main-ter'],
  'button-static-border-color': theme['border'],
});
