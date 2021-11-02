import React from 'react';

import { Box, Flex, Slider, Typography } from '../../../ergodex-cdk';

const marks = {
  0: 'Min',
  25: '25%',
  50: '50%',
  75: '75%',
  100: 'Max',
};

interface RemovePositionSliderProps {
  percent: string;
  onChange: (p: number) => void;
}

const RemovePositionSlider: React.FC<RemovePositionSliderProps> = ({
  percent,
  onChange,
}) => {
  return (
    <Box contrast padding={4}>
      <Flex flexDirection="col">
        <Flex.Item>
          <Flex flexDirection="col">
            <Flex.Item marginBottom={4}>
              <Flex alignItems="center" justify="center">
                <Typography.Title level={1}>{percent}%</Typography.Title>
              </Flex>
            </Flex.Item>
            <Flex.Item>
              <Slider
                tooltipVisible={false}
                marks={marks}
                defaultValue={Number(percent)}
                onChange={onChange}
              />
            </Flex.Item>
          </Flex>
        </Flex.Item>
      </Flex>
    </Box>
  );
};

export { RemovePositionSlider };
