import React, { forwardRef } from 'react';
import { BaseButton } from './BaseStyled';

type ButtonType = 'default' | 'primary' | 'danger' | 'ghost' | 'dashed' | 'link';
type ButtonShapeType = 'circle' | 'circle-outlined' | 'round';
type AppearanceType = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
type SizeType = 'small' | 'sm' | 'medium' | 'md' | 'large' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
  // common props
  /** type default is outlined grey button  */
  type?: ButtonType;
  /** default undefined, rectangle button */
  shape?: ButtonShapeType;
  /** default undefined, predefined color for buttons */
  appearance?: AppearanceType;
  /** default medium */
  size?: SizeType;
  isDisabled?: boolean;
  /** unsafe, compatible for isDisabled  */
  disabled?: boolean;
  isLoading?: boolean | { delay?: number };
  /** unsafe, compatible for isLoading  */
  loading?: boolean | { delay?: number };
  ghost?: boolean;
  danger?: boolean;
  block?: boolean;
  icon?: React.ReactNode;
  htmlType?: 'submit' | 'button' | 'reset';
  // about anchor
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

/**
 *  Button component
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    className,
    type = 'default',
    shape,
    appearance,
    size = 'md',
    isDisabled = false,
    isLoading = false,
    href,
    onClick,
    ...restProps
  } = props;

  let curAppearance: AppearanceType;
  let curSize: SizeType;

  switch (type) {
    case 'primary':
      curAppearance = 'primary';
      break;
    case 'danger':
      curAppearance = 'danger';
      break;
    default:
      curAppearance = appearance;
  }

  switch (size) {
    case 'sm':
    case 'small':
      curSize = 'small';
      break;
    case 'lg':
    case 'large':
      curSize = 'large';
      break;
    default:
      curSize = 'medium';
  }

  return (
    <BaseButton
      {...restProps}
      ref={ref}
      className={className}
      shape={shape}
      appearance={curAppearance}
      size={curSize}
      onClick={onClick}
    >
      {/* {isLoading && (
        <SpinContainer>
          <Spinner size='sm' spinnerColor={spinnerColor} />
        </SpinContainer>
      )} */}

      {children}

      {/* <ChildContainer isLoading={isLoading}>
        {iconBefore && <ButtonIcon name={iconBefore} />}
        {children}
        {iconAfter && <ButtonIcon name={iconAfter} />}
      </ChildContainer> */}
    </BaseButton>
  );
});
