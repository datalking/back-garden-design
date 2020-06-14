import { css } from 'styled-components';
import { fromTheme } from './functions';

/**
 * container for html form elements: button,input,select,icon
 */
export const control = css`
  appearance: none;
  position: relative;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  vertical-align: top;

  height: ${fromTheme('control-height')};
  padding-top: ${fromTheme('control-padding-vertical')};
  padding-bottom: ${fromTheme('control-padding-vertical')};
  padding-right: ${fromTheme('control-padding-horizontal')};
  padding-left: ${fromTheme('control-padding-horizontal')};
  line-height: ${fromTheme('control-line-height')};

  border: ${fromTheme('control-border-width')} solid transparent;
  border-radius: ${fromTheme('control-radius')};
  box-shadow: none;
  font-size: ${fromTheme('size-normal')};

  /* States */
  &:focus,
  &:active {
    outline: none;
  }
  &[disabled] {
    cursor: not-allowed;
  }
`;

// The controls sizes use mixins so they can be used at different breakpoints
export const controlSmall = css`
  border-radius: ${fromTheme('control-radius-small')};
  font-size: ${fromTheme('size-small')};
`;
// export const controlMedium = css`
//   font-size: ${fromTheme('size-medium')};
// `;
export const controlLarge = css`
  font-size: ${fromTheme('size-large')};
`;
