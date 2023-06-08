import { AssetClass } from '@spectrumlabs/cardano-dex-sdk/build/main/cardano/entities/assetClass';
import axios from 'axios';
import {
  combineLatest,
  defer,
  filter,
  first,
  from,
  map,
  Observable,
  of,
  publishReplay,
  refCount,
  switchMap,
} from 'rxjs';

import { applicationConfig } from '../../../../applicationConfig';
import { AssetInfo } from '../../../../common/models/AssetInfo';
import { Currency } from '../../../../common/models/Currency';
import { settings$ } from '../../settings/settings';
import { mapAssetClassToAssetInfo } from '../common/cardanoAssetInfo/getCardanoAssetInfo';

interface AvailableAssetItem {
  readonly dripAmount: number;
  readonly dripAsset: {
    unAssetClass: [
      { readonly unCurrencySymbol: string },
      { readonly unTokenName: string },
    ];
  };
}

const mapAssetItemToCurrency = (
  aai: AvailableAssetItem,
): Observable<Currency> =>
  mapAssetClassToAssetInfo({
    name: aai.dripAsset.unAssetClass[1].unTokenName,
    policyId: aai.dripAsset.unAssetClass[0].unCurrencySymbol,
  }).pipe(map((ai) => new Currency(BigInt(aai.dripAmount), ai)));

export const availableAssets$: Observable<Currency[]> = defer(() =>
  from(
    axios.get<AvailableAssetItem[]>(
      `${applicationConfig.networksSettings.cardanoPreview.faucet}assets`,
    ),
  ),
).pipe(
  map((res) => res.data),
  switchMap((items) => combineLatest(items.map(mapAssetItemToCurrency))),
  publishReplay(1),
  refCount(),
);

export const requestTestnetAsset = (
  assetInfo: AssetInfo<AssetClass>,
  recaptchaToken: string,
) =>
  settings$.pipe(
    filter(Boolean),
    first(),
    switchMap((settings) => {
      return settings.address
        ? from(
            axios.post(
              `${applicationConfig.networksSettings.cardanoPreview.faucet}askdrip`,
              {
                requestAddress: settings.address,
                requestAsset: `${assetInfo.data?.policyId}.${assetInfo.data?.name}`,
                reCaptchaToken: recaptchaToken,
              },
            ),
          )
        : of(undefined);
    }),
  );
