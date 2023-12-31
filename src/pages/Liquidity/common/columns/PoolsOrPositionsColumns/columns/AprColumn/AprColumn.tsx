import { Flex } from '@ergolabs/ui-kit';
import { FC } from 'react';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { DataTag } from '../../../../../../../components/common/DataTag/DataTag';
import { IsCardano } from '../../../../../../../components/IsCardano/IsCardano';
import { IsErgo } from '../../../../../../../components/IsErgo/IsErgo';
import { CardanoAprColumnContent } from './CardanoAprColumnContent/CardanoAprColumnContent';
import { ErgoAprColumnContent } from './ErgoAprColumnContent/ErgoAprColumnContent';

export interface AprColumnProps {
  readonly ammPool: AmmPool;
  readonly isAllContentTrigger?: boolean;
}

export const AprColumn: FC<AprColumnProps> = ({
  ammPool,
  isAllContentTrigger,
}) => (
  <Flex>
    <DataTag
      content={
        <>
          <IsErgo>
            <ErgoAprColumnContent ammPool={ammPool} />
          </IsErgo>
          <IsCardano>
            <CardanoAprColumnContent
              ammPool={ammPool}
              isAllContentTrigger={isAllContentTrigger}
            />
          </IsCardano>
        </>
      }
    />
  </Flex>
);
