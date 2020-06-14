import styled from 'styled-components';
import {
  flexbox,
  layout,
  space,
  color,
  typography,
  PositionProps,
  LayoutProps,
  DisplayProps,
  SpaceProps,
  ColorProps,
  ColorStyleProps,
  TypographyProps,
  TextStyleProps,
  BorderProps,
  compose,
  position,
  display,
  colorStyle,
  textStyle,
  border,
} from 'styled-system';

export interface BoxProps
  extends PositionProps,
    LayoutProps,
    DisplayProps,
    SpaceProps,
    ColorProps,
    ColorStyleProps,
    TypographyProps,
    TextStyleProps,
    BorderProps {}

export const Box = styled('div')<BoxProps>(
  {
    boxSizing: 'border-box',
  },
  compose(position, layout, display, flexbox, space, color, colorStyle, typography, textStyle, border),
);
