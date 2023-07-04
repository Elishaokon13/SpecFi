import { FC } from 'react';

import { AmmPool } from '../../../../../common/models/AmmPool';
import { ListSkeletonLoadingState } from '../../../../../components/SkeletonLoader/ListSkeletonLoadingState.tsx';
import { TableView } from '../../../../../components/TableView/TableView';
import { PoolsOrPositionsTableView } from '../../common/PoolsOrPositionsTableView/PoolsOrPositionsTableView';
import { PoolDetails } from './PoolDetails/PoolDetails';

export interface PoolsOverviewProps {
  readonly ammPools: AmmPool[];
  readonly loading?: boolean;
}

export const PoolsOverview: FC<PoolsOverviewProps> = ({
  ammPools,
  loading,
}) => (
  <PoolsOrPositionsTableView
    expandComponent={PoolDetails}
    items={ammPools}
    poolMapper={(ammPool: AmmPool) => ammPool}
  >
    <TableView.State name="loading" condition={loading}>
      <ListSkeletonLoadingState />
    </TableView.State>
  </PoolsOrPositionsTableView>
);
