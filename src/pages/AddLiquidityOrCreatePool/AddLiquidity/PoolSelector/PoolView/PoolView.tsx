import React, { FC } from 'react';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../components/common/DataTag/DataTag';
import { TokenIconPair } from '../../../../../components/TokenIconPair/TokenIconPair';
import { Flex, Typography } from '../../../../../ergodex-cdk';

interface PoolSelectorItemProps {
  readonly ammPool: AmmPool;
  readonly hover?: boolean;
  readonly active?: boolean;
}

export const PoolView: FC<PoolSelectorItemProps> = ({
  ammPool,
  hover,
  active,
}) => {
  return (
    <Flex align="center" stretch>
      <Flex.Item marginRight={1}>
        <TokenIconPair assetX={ammPool.x.asset} assetY={ammPool.y.asset} />
      </Flex.Item>
      <Flex.Item marginRight={1} align="center">
        <Typography.Title level={5}>
          {ammPool.x.asset.name}/{ammPool.y.asset.name}
        </Typography.Title>
      </Flex.Item>
      <Flex.Item marginRight={1} align="center">
        <Typography.Footnote>Fee:</Typography.Footnote>
      </Flex.Item>
      <Flex.Item marginRight={2} align="center">
        <DataTag
          size="default"
          secondary={!hover && !active}
          content={`${ammPool.poolFee}%`}
        />
      </Flex.Item>
      <Flex.Item marginRight={1} align="center">
        <Typography.Footnote>TVL:</Typography.Footnote>
      </Flex.Item>
      <Flex.Item>
        <DataTag
          size="default"
          secondary={!hover && !active}
          content={`${ammPool.poolFee}%`}
        />
      </Flex.Item>
    </Flex>
  );
};
