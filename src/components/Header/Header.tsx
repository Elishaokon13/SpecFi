import './Header.less';

import React from 'react';

import { useWallet } from '../../context';
import { Logo } from '../../ergodex-cdk';
import { BurgerMenu } from './BurgerMenu/BurgerMenu';
import { ConnectWallet } from './ConnectWallet/ConnectWallet';
import { GlobalSettings } from './GlobalSettings/GlobalSettings';
import { HeaderTabs } from './HeaderTabs';
import { NetworkDropdown } from './NetworkDropdown/NetworkDropdown';

const networks = [
  { name: 'ergo', token: 'erg', isDisabled: false },
  { name: 'cardano', token: 'ada', isDisabled: true },
];

export const Header: React.FC = () => {
  const { isWalletConnected, ergBalance, isWalletLoading } = useWallet();

  return (
    <header className="header">
      <div className="header__wrapper">
        <Logo label />
        <HeaderTabs />

        <div className="header__options">
          <NetworkDropdown networks={networks} />
          <ConnectWallet
            isWalletConnected={isWalletConnected}
            isWalletLoading={isWalletLoading}
            numberOfPendingTxs={0}
            balance={ergBalance}
            currency="ERG"
            address="9iKWmL5t3y9u59fUESsbFQzG933UPjR1v7LUAjM6XPMAcXNhBzL"
          />
          <GlobalSettings />
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};
