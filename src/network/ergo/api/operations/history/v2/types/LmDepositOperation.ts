import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../../common/models/Currency';
import {
  LmDepositItem,
  OperationStatus,
  OperationType,
} from '../../../../../../../common/models/OperationV2';
import { TxId } from '../../../../../../../common/types';
import {
  mapRawBaseExecutedOperationToBaseExecutedOperation,
  mapRawBaseOtherOperationToBaseOtherOperation,
  mapRawBaseRefundedOperationToBaseRefundedOperation,
  OperationMapper,
  RawBaseExecutedOperation,
  RawBaseOtherOperation,
  RawBaseRefundedOperation,
} from './BaseOperation';

export interface RawLmDepositOperation {
  readonly poolId: string;
  readonly input: TokenAmount;
}

export type RawLmDepositExecutedOperation = RawBaseExecutedOperation &
  RawLmDepositOperation;

export type RawLmDepositRefundedOperation = RawBaseRefundedOperation &
  RawLmDepositOperation;

export type RawLmDepositOtherOperation = RawBaseOtherOperation &
  RawLmDepositOperation;

export interface RawLmDepositItem {
  LmDepositApi:
    | RawLmDepositExecutedOperation
    | RawLmDepositRefundedOperation
    | RawLmDepositOtherOperation;
}

export const mapRawLmDepositItemToLmDeposit: OperationMapper<
  RawLmDepositItem,
  LmDepositItem
> = (item: RawLmDepositItem, ammPools: AmmPool[]): LmDepositItem => {
  const { status, input } = item.LmDepositApi;
  const pool = ammPools.find((ap) => ap.lp.asset.id === input.tokenId)!;

  if (status === OperationStatus.Evaluated) {
    return {
      ...mapRawBaseExecutedOperationToBaseExecutedOperation(item.LmDepositApi),
      input: new Currency(BigInt(input.amount), pool.lp.asset),
      pool,
      type: OperationType.LmDeposit,
    };
  }
  if (status === OperationStatus.Refunded) {
    return {
      ...mapRawBaseRefundedOperationToBaseRefundedOperation(item.LmDepositApi),
      input: new Currency(BigInt(input.amount), pool.lp.asset),
      pool,
      type: OperationType.LmDeposit,
    };
  }
  return {
    ...mapRawBaseOtherOperationToBaseOtherOperation(item.LmDepositApi),
    input: new Currency(BigInt(input.amount), pool.lp.asset),
    pool,
    type: OperationType.LmDeposit,
  };
};

export const getRegisterTxIdFromRawLmDepositItem = (
  rawSwapItem: RawLmDepositItem,
): TxId => rawSwapItem.LmDepositApi.registerTx.id;
