import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { BgTheme, Button } from '../src/components';

export const LiveComponent = props => {
  const { code: codeTry = `<h1>Hello</h1>` } = props;
  const [showCode, toggleShowCode] = useState(false);

  const handleClick = event => {
    return showCode ? toggleShowCode(false) : toggleShowCode(true);
  };

  return (
    <LiveProvider code={codeTry}>
      <BgTheme>
        <div style={{ backgroundColor: '#f5f6f7' }}>
          <LivePreview />
          <LiveError />
        </div>
        <div>
          <Button onClick={handleClick} size='sm'>
            Copy Code
          </Button>
          <Button onClick={handleClick} size='sm'>
            Show Code
          </Button>
        </div>
        {showCode && <LiveEditor />}
      </BgTheme>
    </LiveProvider>
  );
};
