import { css } from 'styled-components';
import { spinAround } from './animations';
import { fromTheme } from './functions';

export const unselectable = css`
  -webkit-touch-callout: none;
  user-select: none;
`;

export const loader = css`
  animation: ${spinAround} 500ms infinite linear;
  border: 2px solid ${fromTheme('border')};
  border-radius: ${fromTheme('radius-rounded')};
  border-right-color: transparent;
  border-top-color: transparent;
  content: '';
  display: block;
  height: 1em;
  position: relative;
  width: 1em;
`;

export function center(width, height = 0) {
  if (height) {
    return css`
      position: absolute;
      left: calc(50% - (${width} / 2));
      top: calc(50% - (${height} / 2));
    `;
  }
  return css`
    position: absolute;
    left: calc(50% - (${width} / 2));
    top: calc(50% - (${width} / 2));
  `;
}
