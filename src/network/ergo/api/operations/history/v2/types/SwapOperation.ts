import { TokenAmount } from '@ergolabs/ergo-sdk/build/main/entities/tokenAmount';

import { AmmPool } from '../../../../../../../common/models/AmmPool';
import { Currency } from '../../../../../../../common/models/Currency';
import {
  OperationStatus,
  OperationType,
  SwapItem,
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

export interface RawSwapOperation {
  readonly address: string;
  readonly poolId: string;
  readonly base: TokenAmount;
  readonly minQuote: TokenAmount;
}

export interface RawSwapExecutedOperation
  extends RawBaseExecutedOperation,
    RawSwapOperation {
  readonly quote: bigint;
}

export type RawSwapRefundedOperation = RawBaseRefundedOperation &
  RawSwapOperation;

export type RawSwapOtherOperation = RawBaseOtherOperation & RawSwapOperation;

export interface RawSwapItem {
  Swap:
    | RawSwapRefundedOperation
    | RawSwapExecutedOperation
    | RawSwapOtherOperation;
}

export const mapRawSwapItemToSwapItem: OperationMapper<RawSwapItem, SwapItem> =
  (item: RawSwapItem, ammPools: AmmPool[]): SwapItem => {
    const { status, address, base, poolId, minQuote } = item.Swap;
    const pool = ammPools.find((ap) => ap.id === poolId)!;
    const baseAsset =
      pool.x.asset.id === base.tokenId ? pool.x.asset : pool.y.asset;
    const quoteAsset =
      pool.x.asset.id === minQuote.tokenId ? pool.x.asset : pool.y.asset;

    if (status === OperationStatus.Evaluated) {
      return {
        ...mapRawBaseExecutedOperationToBaseExecutedOperation(item.Swap),
        address,
        base: new Currency(BigInt(base.amount), baseAsset),
        quote: new Currency(BigInt(item.Swap.quote), quoteAsset),
        pool,
        type: OperationType.Swap,
      };
    }
    if (status === OperationStatus.Refunded) {
      return {
        ...mapRawBaseRefundedOperationToBaseRefundedOperation(item.Swap),
        address,
        base: new Currency(BigInt(base.amount), baseAsset),
        quote: new Currency(BigInt(minQuote.amount), quoteAsset),
        pool,
        type: OperationType.Swap,
      };
    }
    return {
      ...mapRawBaseOtherOperationToBaseOtherOperation(item.Swap),
      address,
      base: new Currency(BigInt(base.amount), baseAsset),
      quote: new Currency(BigInt(minQuote.amount), quoteAsset),
      pool,
      type: OperationType.Swap,
    };
  };

export const getRegisterTxIdFromRawSwapItem = (
  rawSwapItem: RawSwapItem,
): TxId => rawSwapItem.Swap.registerTx.id;
