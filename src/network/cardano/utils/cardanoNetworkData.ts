import {
  OrderAddrs,
  OrderAddrsV1Mainnet,
  OrderAddrsV1Testnet,
} from '@spectrumlabs/cardano-dex-sdk/build/main/amm/scripts';

import { applicationConfig } from '../../../applicationConfig';
import { localStorageManager } from '../../../common/utils/localStorageManager';
import { SupportedNetworks } from '../../common/Network';

// TODO: MAKE REFACTORING AFTER MAINNET RELEASE
export type CardanoNetworkData =
  typeof applicationConfig.networksSettings['ergo'] & {
    readonly settingsKey: string;
    readonly walletKey: string;
    readonly addrs: OrderAddrs;
  };

// TODO: REWRITE AFTER RELEASE
const networkUrl: SupportedNetworks | 'cardano_mainnet' =
  location.pathname.split('/')[1] as any;
const possibleUrl =
  networkUrl === 'cardano' ||
  networkUrl === 'cardano_mainnet' ||
  networkUrl === 'cardano_preview'
    ? networkUrl
    : localStorageManager.get<SupportedNetworks>(
        'spectrum-selected-network-key',
      );

export const currentNetwork: SupportedNetworks =
  possibleUrl === 'ergo' || possibleUrl === 'cardano_mainnet'
    ? 'cardano'
    : possibleUrl || 'cardano';

export const cardanoNetworkData: CardanoNetworkData =
  currentNetwork === 'cardano'
    ? {
        ...applicationConfig.networksSettings.cardano,
        settingsKey: 'cardano-mainnet-settings',
        walletKey: 'cardano-mainnet-selected-wallet',
        addrs: OrderAddrsV1Mainnet,
      }
    : {
        ...applicationConfig.networksSettings.cardano_preview,
        settingsKey: 'cardano-preview-settings',
        walletKey: 'cardano-preview-selected-wallet',
        addrs: OrderAddrsV1Testnet,
      };
