import React, { FC } from 'react';
import styled from 'styled-components';

interface ModalHeaderProps {
  mTitle?: string;
  style?: any;
}

const ModalHeaderBase: FC<ModalHeaderProps> = props => {
  return <div>{props.mTitle}</div>;
};

const ModalHeader = styled(ModalHeaderBase).attrs(props => ({ style: props.style }))`
  height: 36px;
  background: #f6f6f6;
  border-radius: 5px 5px 0 0;
  border-width: 1px;
  padding: 20px 20px 0 20px;
`;

export default ModalHeader;
