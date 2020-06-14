import React, { FC } from 'react';
// import styled, { css } from 'styled-components';

export interface TestSimpleButtonProps {
  btnTitle?: string;
}

export const TestSimpleButton: FC<TestSimpleButtonProps> = ({ btnTitle = 'ClickMe' }) => <button>{btnTitle}</button>;

export interface TestStyledButtonProps {
  theme: {
    themeName?: string;
    color?: any;
    borderRadius?: any;
  };
}

// export const TestStyledButton = styled.button<TestStyledButtonProps>`
//   font-size: 1em;
//   margin: 1em;
//   padding: 0.25em 1em;
//   border-radius: 3px;
//   /* border: 'none'; */
//   background-color: #fff;

//   /* Color the border and text with theme.main */
//   color: ${props => props.theme.color.primary};
//   border: 2px solid ${props => props.theme.color.primary};
// `;

// TestStyledButton.defaultProps = {
//   theme: {
//     themeName: 'tName',
//     color: {
//       primary: 'silver',
//     },
//   },
// };
