import axios from 'axios';
import keyBy from 'lodash/keyBy';
import {
  catchError,
  exhaustMap,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
} from 'rxjs';

import { PoolId } from '../../../../common/types';
import { Dictionary } from '../../../../common/utils/Dictionary';
import { cardanoNetworkData } from '../../utils/cardanoNetworkData';
import { networkContext$ } from '../networkContext/networkContext';

export interface AmmPoolAnalytics {
  id: PoolId;
  tvl: number | null;
  volume: number | null;
  yearlyFeesPercent: number | undefined;
}

export const ammPoolsStats$: Observable<Dictionary<AmmPoolAnalytics>> =
  networkContext$.pipe(
    exhaustMap(() =>
      from(
        axios.get<AmmPoolAnalytics[]>(
          `${cardanoNetworkData.analyticUrl}pools/overview`,
          {
            params: {
              after: 0,
            },
          },
        ),
      ),
    ),
    map((res) => res.data),
    catchError(() => of([])),
    map((analytics: AmmPoolAnalytics[]) => keyBy(analytics, (a) => a.id)),
    publishReplay(1),
    refCount(),
  );
