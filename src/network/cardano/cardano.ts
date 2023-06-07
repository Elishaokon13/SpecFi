import { Observable, of } from 'rxjs';

import { TxId } from '../../common/types';
import { Network } from '../common/Network';
import { convertToConvenientNetworkAsset } from './api/adaRatio/adaRatio';
import {
  getAddresses,
  getUnusedAddresses,
  getUsedAddresses,
} from './api/addresses/addresses';
import { ammPools$ } from './api/ammPools/ammPools';
import { CardanoAmmPool } from './api/ammPools/CardanoAmmPool';
import { assetBalance$ } from './api/balance/assetBalance';
import { lpBalance$ } from './api/balance/lpBalance';
import { networkAssetBalance$ } from './api/balance/networkAssetBalance';
import { networkAsset, useNetworkAsset } from './api/networkAsset/networkAsset';
import { networkContext$ } from './api/networkContext/networkContext';
import {
  deposit,
  useDepositValidators,
  useHandleDepositMaxButtonClick,
} from './api/operations/deposit';
import { redeem } from './api/operations/redeem';
import { refund } from './api/operations/refund';
import {
  swap,
  useHandleSwapMaxButtonClick,
  useSwapValidators,
} from './api/operations/swap';
import { platformStats$ } from './api/platformStats/platformStats';
import { getPoolChartData } from './api/poolChart/poolChart';
import { positions$ } from './api/positions/positions';
import {
  defaultTokenAssets$,
  getDefaultAssetsFor,
  importTokenAsset,
  tokenAssetsToImport$,
} from './api/tokens/tokens';
import {
  getOperationByTxId,
  getOperations,
} from './api/transactionHistory/transactionHistory';
import { CardanoWalletContract } from './api/wallet/common/CardanoWalletContract';
import {
  availableWallets,
  connectWallet,
  disconnectWallet,
  selectedWallet$,
  supportedWalletFeatures$,
  walletState$,
} from './api/wallet/wallet';
import { initialize, initialized$ } from './initialized';
import {
  CardanoSettings,
  setSettings,
  settings,
  settings$,
} from './settings/settings';
import {
  exploreAddress,
  exploreLastBlock,
  exploreToken,
  exploreTx,
} from './utils/utils';
import { OperationsSettings } from './widgets/OperationSettings/OperationsSettings';
import { SwapInfoContent } from './widgets/SwapInfoContent/SwapInfoContent';

export const cardanoNetwork: Network<
  CardanoWalletContract,
  CardanoSettings,
  CardanoAmmPool
> = {
  name: 'cardano',
  label: 'cardano',
  favicon: '/favicon-cardano.svg',
  convenientAssetDefaultPreview: '0 ADA',
  networkAsset,
  initialized$,
  initialize,
  networkAssetBalance$,
  assetBalance$,
  lpBalance$,
  locks$: of([]),
  positions$,
  displayedAmmPools$: ammPools$,
  ammPools$,
  getAddresses: getAddresses,
  getUsedAddresses: getUsedAddresses,
  getUnusedAddresses: getUnusedAddresses,
  getOperationByTxId: getOperationByTxId,
  getOperations,
  isOperationsSyncing$: of(false),

  platformStats$,
  connectWallet: connectWallet,
  disconnectWallet: disconnectWallet,
  availableWallets: availableWallets,
  walletState$: walletState$,
  selectedWallet$: selectedWallet$,
  supportedFeatures$: supportedWalletFeatures$,
  networkContext$,
  defaultAssets$: defaultTokenAssets$,
  assetsToImport$: tokenAssetsToImport$,
  // TODO: Implement assets fns
  getDefaultAssetsFor,
  getImportedAssetsFor: () => of([]),
  getAssetsToImportFor: () => of([]),
  importedAssets$: of([]),
  importTokenAsset,

  settings,
  settings$,
  setSettings,

  SwapInfoContent,
  OperationsSettings,

  exploreTx,
  exploreAddress,
  exploreLastBlock,
  exploreToken,
  swap,
  deposit,
  redeem,
  refund,
  lmRedeem(): Observable<TxId> {
    return of('');
  },
  lmDeposit(): Observable<TxId> {
    return of('');
  },

  convertToConvenientNetworkAsset,

  useSwapValidators,
  useHandleSwapMaxButtonClick,
  useDepositValidators,
  useHandleDepositMaxButtonClick,
  useCreatePoolValidationFee: (() => {}) as any,
  useNetworkAsset,

  getPoolChartData: getPoolChartData as any,
  pendingOperations$: of([]),
  queuedOperation$: of(undefined),
};
