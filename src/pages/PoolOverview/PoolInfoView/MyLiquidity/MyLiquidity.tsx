import { Box, Flex, Typography, useDevice } from '@ergolabs/ui-kit';
import { Trans } from '@lingui/macro';
import React, { FC } from 'react';

import { Position } from '../../../../common/models/Position';
import { AssetTitle } from '../../../../components/AssetTitle/AssetTitle';
import { ConvenientAssetView } from '../../../../components/ConvenientAssetView/ConvenientAssetView';
import { InlineGrid } from '../../../../components/InlineGrid/InlineGrid';
import { TitledBox } from '../../../../components/TitledBox/TitledBox';

export interface MyLiquidityProps {
  readonly position: Position;
}

export const MyLiquidity: FC<MyLiquidityProps> = ({ position }) => {
  const { s } = useDevice();

  return (
    <TitledBox
      secondary
      glass
      borderRadius="l"
      title={
        <Typography.Body strong>
          <Trans>My liquidity</Trans>
        </Typography.Body>
      }
      titleGap={1}
      subtitle={
        !position.empty && (
          <Typography.Title level={3}>
            <ConvenientAssetView
              hidePrefix
              value={[position.totalX, position.totalY]}
            />
          </Typography.Title>
        )
      }
      subtitleGap={2}
      padding={3}
      height={position.empty ? 80 : undefined}
    >
      {position.empty ? (
        <Flex stretch align="center" justify="center">
          <Typography.Body align="center">
            <Trans>Your liquidity positions will appear here.</Trans>
          </Typography.Body>
        </Flex>
      ) : (
        <Flex col gap={2}>
          <InlineGrid gap={2}>
            <InlineGrid.Item
              title={
                <AssetTitle asset={position.pool.x.asset} gap={1} level={5} />
              }
              value={
                <Typography.Body size="large" strong>
                  {position.totalX.toString()}
                </Typography.Body>
              }
            />
            <InlineGrid.Item
              title={
                <AssetTitle asset={position.pool.y.asset} gap={1} level={5} />
              }
              value={
                <Typography.Body size="large" strong>
                  {position.totalY.toString()}
                </Typography.Body>
              }
            />
          </InlineGrid>
          <Flex align="center" col={s} gap={2}>
            {position.lockedLp.isPositive() && (
              <Flex.Item flex={1} width={s ? '100%' : undefined}>
                <Box
                  glass
                  style={{ background: 'var(--spectrum-box-bg-hover-glass)' }}
                  borderRadius="s"
                  padding={[1, 2]}
                >
                  <InlineGrid gap={1}>
                    <InlineGrid.Item
                      title={
                        <Typography.Body size="small" strong>
                          <Trans>Locked</Trans>
                        </Typography.Body>
                      }
                      value={''}
                    />
                    <InlineGrid.Item
                      title={
                        <AssetTitle
                          size="extraSmall"
                          asset={position.pool.x.asset}
                          level="small-strong"
                        />
                      }
                      value={
                        <Typography.Body strong size="small">
                          {position.lockedX.toString()}
                        </Typography.Body>
                      }
                    />
                    <InlineGrid.Item
                      title={
                        <AssetTitle
                          size="extraSmall"
                          asset={position.pool.y.asset}
                          level="small-strong"
                        />
                      }
                      value={
                        <Typography.Body strong size="small">
                          {position.lockedY.toString()}
                        </Typography.Body>
                      }
                    />
                  </InlineGrid>
                </Box>
              </Flex.Item>
            )}
            {position.stakedLp.isPositive() && (
              <Flex.Item flex={1} width={s ? '100%' : undefined}>
                <Box
                  glass
                  style={{ background: 'var(--spectrum-box-bg-hover-glass)' }}
                  borderRadius="s"
                  padding={[1, 2]}
                >
                  <InlineGrid gap={1}>
                    <InlineGrid.Item
                      title={
                        <Typography.Body size="small" strong>
                          <Trans>Staked in farms</Trans>
                        </Typography.Body>
                      }
                      value={''}
                    />
                    <InlineGrid.Item
                      title={
                        <AssetTitle
                          size="extraSmall"
                          asset={position.pool.x.asset}
                          level="small-strong"
                        />
                      }
                      value={
                        <Typography.Body strong size="small">
                          {position.stakedX.toString()}
                        </Typography.Body>
                      }
                    />
                    <InlineGrid.Item
                      title={
                        <AssetTitle
                          size="extraSmall"
                          asset={position.pool.y.asset}
                          level="small-strong"
                        />
                      }
                      value={
                        <Typography.Body strong size="small">
                          {position.stakedY.toString()}
                        </Typography.Body>
                      }
                    />
                  </InlineGrid>
                </Box>
              </Flex.Item>
            )}
          </Flex>
        </Flex>
      )}
    </TitledBox>
  );
};
