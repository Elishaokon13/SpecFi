import { exhaustMap, filter, publishReplay, refCount, switchMap } from 'rxjs';

import { WalletState } from '../../common';
import { networkContext$ } from '../networkContext/networkContext';
import { selectedWallet$, selectedWalletState$ } from '../wallets';

export const utxos$ = selectedWalletState$.pipe(
  filter((state) => state === WalletState.CONNECTED),
  switchMap(() => networkContext$),
  exhaustMap(() =>
    selectedWallet$.pipe(
      filter(Boolean),
      switchMap((w) => w.getUtxos()),
    ),
  ),
  publishReplay(1),
  refCount(),
);
