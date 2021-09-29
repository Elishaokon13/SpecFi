import { TxId } from '@ergolabs/ergo-sdk';

import { ERG_EXPLORER_URL } from '../constants/env';

export const exploreTx = (txId: TxId): unknown =>
  window.open(`${ERG_EXPLORER_URL}/transactions/${txId}`, '_blank');
