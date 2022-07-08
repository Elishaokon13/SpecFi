import { SupportedNetworks } from '../../../network/common/Network';
import { SupportedLocale } from '../../constants/locales';
import { AnalyticsTheme } from './types';

export type AnalyticsLaunchData = {
  network: SupportedNetworks;
  locale: SupportedLocale;
  theme: AnalyticsTheme;
  minerFee: number;
  ergo?: {
    nitro: number;
    slippage: number;
  };
  cardano?: {
    nitro: number;
    slippage: number;
  };
};