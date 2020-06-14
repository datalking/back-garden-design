import styled from 'styled-components';
import { fromTheme } from '../../foundation/theme/bulma/utilities/functions';

export const Icon = styled.span`
  align-items: center;
  display: inline-flex;
  justify-content: center;
  height: ${fromTheme('icon-dimensions')};
  width: ${fromTheme('icon-dimensions')};
  /* Sizes */
  &.is-small {
    height: ${fromTheme('icon-dimensions-small')};
    width: ${fromTheme('icon-dimensions-small')};
  }
  &.is-medium {
    height: ${fromTheme('icon-dimensions-medium')};
    width: ${fromTheme('icon-dimensions-medium')};
  }
  &.is-large {
    height: ${fromTheme('icon-dimensions-large')};
    width: ${fromTheme('icon-dimensions-large')};
  }
`;
