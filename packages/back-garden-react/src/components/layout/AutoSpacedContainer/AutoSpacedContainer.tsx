import React from 'react';
import { Box } from '../Box';
import { Flex } from '../Flex';

export const AutoSpacedContainer = props => {
  const { children, flexDirection = 'row', alignItems = 'center', ...restProps } = props;

  const renderGappedChildren = React.Children.map(children, (child, index) => {
    return (
      <Box mr={4} mb={4}>
        {child}
      </Box>
    );
  });

  return (
    <Flex flexDirection={flexDirection} flexWrap='wrap' alignItems={alignItems} {...restProps}>
      {renderGappedChildren}
    </Flex>
  );
};
