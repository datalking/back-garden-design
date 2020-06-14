import styled, { css } from 'styled-components';
import { space, layout, variant, compose } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
import { unselectable, loader, center } from '../../foundation/theme/bulma/utilities/mixins';
import { darken } from '../../../helper/color/darken';
import { fromTheme } from '../../foundation/theme/bulma/utilities/functions';
import { ButtonProps } from './Button';

export const BaseButton = styled('button')<ButtonProps>`

  appearance: none;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: top;
  text-align: center;

  box-sizing: border-box;
  height: ${fromTheme('control-height')};
  padding-top: ${fromTheme('button-padding-vertical')};
  padding-bottom: ${fromTheme('button-padding-vertical')};
  padding-right: ${fromTheme('button-padding-horizontal')};
  padding-left: ${fromTheme('button-padding-horizontal')};
  line-height: ${fromTheme('control-line-height')};

  color: ${fromTheme('button-color')};
  background-color: ${fromTheme('button-background-color')};
  border: ${fromTheme('control-border-width')} solid transparent;
  border-color: ${fromTheme('button-border-color')};
  border-width: ${fromTheme('button-border-width')};
  border-radius: ${fromTheme('control-radius')};
  box-shadow: none;

  font-size: ${fromTheme('size-normal')};
  white-space: nowrap;

  cursor: pointer;
  -webkit-touch-callout: none;
  user-select: none;

  /* base states */
  &:focus,
  &:active {
    outline: none;
  }
  &[disabled] {
    cursor: not-allowed;
  }

  /** icon css removed  */

 /* States */
  &:hover  {
    /* color: ${fromTheme('button-hover-color')}; */
    background-color:${themeGet('colors.grey_10')};
    border-color: ${fromTheme('button-hover-border-color')};
  }
  &:focus {
    /* border-color: ${fromTheme('button-focus-border-color')}; */
    /* color: ${fromTheme('button-focus-color')}; */
    &:not(:active) {
      box-shadow: ${fromTheme('button-focus-box-shadow-size')} ${fromTheme('button-focus-box-shadow-color')};
    }
  }
  &:active {
    /* border-color: ${fromTheme('button-active-border-color')}; */
    /* color: ${fromTheme('button-active-color')}; */
    box-shadow: ${themeGet('button-active-box-shadow')}
  }

  /*  colorClasses for appearance */
  ${variant({
    prop: 'appearance',
    variants: {
      primary: {
        color: 'white',
        backgroundColor: 'primary',
        borderColor: 'transparent',
        '&:hover': {
          backgroundColor: 'green_70',
          borderColor: 'transparent',
        },
        '&:focus': {
          ' &:not(:active)': {
            boxShadow: 'btnPrimaryFocusShadow',
          },
        },
        '&:active': {
          boxShadow: 'btnPrimaryActiveShadow',
        },
      },
      secondary: {
        color: 'white',
        backgroundColor: 'secondary',
        borderColor: 'transparent',
        '&:hover': {
          backgroundColor: 'grey_70',
          borderColor: 'transparent',
        },
        // '&:focus': {
        //   ' &:not(:active)': {
        //     boxShadow: 'btnSecondaryFocusShadow',
        //   },
        // },
        '&:active': {
          boxShadow: 'btnSecondaryActiveShadow',
        },
      },
      success: {
        color: 'white',
        backgroundColor: 'success',
        borderColor: 'transparent',
        '&:hover': {
          backgroundColor: 'teal_70',
          borderColor: 'transparent',
        },
        '&:focus': {
          ' &:not(:active)': {
            boxShadow: 'btnSuccessFocusShadow',
          },
        },
        '&:active': {
          boxShadow: 'btnSuccessActiveShadow',
        },
      },
      info: {
        color: 'white',
        backgroundColor: 'info',
        borderColor: 'transparent',
        '&:hover': {
          backgroundColor: 'blue_70',
          borderColor: 'transparent',
        },
        '&:focus': {
          ' &:not(:active)': {
            boxShadow: 'btnInfoFocusShadow',
          },
        },
        '&:active': {
          boxShadow: 'btnInfoActiveShadow',
        },
      },
      warning: {
        color: 'white',
        backgroundColor: 'warning',
        borderColor: 'transparent',
        '&:hover': {
          backgroundColor: 'bronze_70',
          borderColor: 'transparent',
        },
        '&:focus': {
          ' &:not(:active)': {
            boxShadow: 'btnWarningFocusShadow',
          },
        },
        '&:active': {
          boxShadow: 'btnWarningActiveShadow',
        },
      },
      danger: {
        color: 'white',
        backgroundColor: 'danger',
        borderColor: 'transparent',
        '&:hover': {
          backgroundColor: 'red_70',
          borderColor: 'transparent',
        },
        '&:focus': {
          ' &:not(:active)': {
            boxShadow: 'btnDangerFocusShadow',
          },
        },
        '&:active': {
          boxShadow: 'btnDangerActiveShadow',
        },
      },
    },
  })}

  /* Sizes */

  ${props =>
    variant({
      prop: 'size',
      variants: {
        small: {
          borderRadius: props.theme['radius-small'],
          fontSize: props.theme['size-small'],
        },
        // medium: {
        //   fontSize: props.theme['size-medium'],
        // },
        large: {
          fontSize: props.theme['size-large'],
        },
      },
    })}

  /*  Modifiers */
  &[disabled] {
    background-color: ${fromTheme('button-disabled-background-color')};
    border-color: ${fromTheme('button-disabled-border-color')};
    box-shadow: ${fromTheme('button-disabled-shadow')};
    opacity: ${fromTheme('button-disabled-opacity')};
  }

  &.is-text {
    color: ${fromTheme('button-text-color')};
    background-color: transparent;
    border-color: transparent;
    text-decoration: underline;
    &:hover,
    &:focus {
      background-color: ${fromTheme('button-text-hover-background-color')};
      color: ${fromTheme('button-text-hover-color')};
    }
    &:active {
      background-color: ${props => darken(0.05, props.theme['button-text-hover-background-color'])};
      color: ${fromTheme('button-text-hover-color')};
    }
    &[disabled] {
      background-color: transparent;
      border-color: transparent;
      box-shadow: none;
    }
  }

  &.is-fullwidth {
    display: flex;
    width: 100%;
  }
  &.is-loading {
    color: transparent !important;
    pointer-events: none;
    &::after {
      ${loader}
      ${center('1em')}
      position: absolute !important;
    }
  }
  &.is-static {
    background-color: ${fromTheme('button-static-background-color')};
    border-color: ${fromTheme('button-static-border-color')};
    color: ${fromTheme('button-static-color')};
    box-shadow: none;
    pointer-events: none;
  }
  &.is-rounded {
    border-radius: ${fromTheme('radius-rounded')};
    padding-left: calc(fromTheme('button-padding-horizontal') + 0.25em);
    padding-right: calc(fromTheme('button-padding-horizontal') + 0.25em);
  }

  ${compose(space, layout)};
`;
