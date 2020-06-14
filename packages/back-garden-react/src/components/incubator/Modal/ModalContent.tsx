import React, { FC } from 'react';
import styled from 'styled-components';

interface ModalContentProps {
  mTitle?: string;
  style?: any;
}

const ModalContentBase: FC<ModalContentProps> = props => {
  return <div>{props.mTitle}</div>;
};

const ModalContent = styled(ModalContentBase).attrs(props => ({ style: props.style }))`
  height: auto;
  min-height: 480px;
  background: #ffffff;
  border-radius: 0 0 5px 5px;
  padding: 20px;
`;

export default ModalContent;
