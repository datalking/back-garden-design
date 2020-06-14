import React, { FC } from 'react';
export interface ButtonProps {}

/**
 *  Button Component the only exported
 */
export class Button extends React.PureComponent<ButtonProps, {}> {
  static displayName = 'Button';

  render() {
    const p = this.props;
    return <button {...p} />;
  }
}
