import { css } from 'styled-components';
import { clearFix, darken } from 'polished';
import {
  // overlay,
  // mobile,
  // tablet,
  // touch,
  // desktop,
  // widescreen,
  // fullhd,
  // tablet_only,
  // widescreen_only,
  // desktop_only,
  unselectable,
} from '../utilities/mixins';
import { fromTheme } from '../utilities/functions';

const alignments = {
  centered: 'center',
  justified: 'justify',
  left: 'left',
  right: 'right',
};
const displays = ['block', 'flex', 'inline', 'inline-block', 'inline-flex'];

export default css`
  /* Float */
  .is-clearfix {
    ${clearFix()}
  }

  .is-pulled-left {
    float: left !important;
  }

  .is-pulled-right {
    float: right !important;
  }

  /* Overflow */
  .is-clipped {
    overflow: hidden !important;
  }

  /* Overlay */
  /* .is-overlay {
    {overlay()}
  } */

  .is-capitalized {
    text-transform: capitalize !important;
  }

  .is-lowercase {
    text-transform: lowercase !important;
  }

  .is-uppercase {
    text-transform: uppercase !important;
  }

  .is-italic {
    font-style: italic !important;
  }

  .has-text-weight-light {
    font-weight: ${fromTheme('weight-light')} !important;
  }
  .has-text-weight-normal {
    font-weight: ${fromTheme('weight-normal')} !important;
  }
  .has-text-weight-semibold {
    font-weight: ${fromTheme('weight-semibold')} !important;
  }
  .has-text-weight-bold {
    font-weight: ${fromTheme('weight-bold')} !important;
  }
`;
