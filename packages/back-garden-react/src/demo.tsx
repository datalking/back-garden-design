import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import {
  TestContextApp,
  DraggableApp,
  ResizableApp,
  LayeredApp,
  MovingApp,
  MovingListApp,
  FixedSizeListApp,
  SimpleRTableApp,
  RDGListSimpleApp,
  RDGListEditApp,
  RDGExampleListApp,
} from './example';
import { BgTheme, Button, AutoSpacedContainer } from './components';

const App: FC = () => {
  return <div>示例组件</div>;
};

const AppButton: FC = () => {
  return (
    <BgTheme>
      <AutoSpacedContainer>
        <Button appearance='primary'>Primary</Button>
        <Button appearance='secondary'>Secondary</Button>
        <Button appearance='success'>Success</Button>
        <Button appearance='info'>Info</Button>
        <Button appearance='warning'>Warn</Button>
        <Button appearance='danger'>Danger</Button>
      </AutoSpacedContainer>
    </BgTheme>
  );
};

ReactDOM.render(<LayeredApp />, document.getElementById('main'));
