import { RustModule } from '@ergolabs/ergo-sdk';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import Layout from './components/common/Layout/Layout';
import { MobilePlug } from './components/MobilePlug/MobilePlug';
import { TABLET_BRAKE_POINT } from './constants/screen';
import {
  AppLoadingProvider,
  SettingsProvider,
  // useAppLoadingState,
  WalletAddressesProvider,
  WalletContextProvider,
} from './context';
import { ConnectionContextProvider } from './context/ConnectionContext';
import { globalHistory } from './createBrowserHistory';
import { ContextModalProvider } from './ergodex-cdk';
import { useWindowSize } from './hooks/useWindowSize';
import { Swap } from './pages';
import { AddLiquidity } from './pages';
import { Pool } from './pages/Pool/Pool';
import { PoolPosition } from './pages/Pool/PoolPosition/PoolPosition';
import { Remove } from './pages/Remove/Remove';

const NotFound = () => <Redirect to="/swap" />;

export const App: React.FC = () => {
  const [isRustModuleLoaded, setIsRustModuleLoaded] = useState(false);

  const [windowWidth] = useWindowSize();

  useEffect(() => {
    RustModule.load().then(() => setIsRustModuleLoaded(true));
  }, []);

  if (!isRustModuleLoaded) {
    return null;
  }

  return (
    <ConnectionContextProvider>
      <Router history={globalHistory}>
        <AppLoadingProvider>
          <WalletContextProvider>
            <SettingsProvider>
              <WalletAddressesProvider>
                <ContextModalProvider>
                  <Layout>
                    {windowWidth > TABLET_BRAKE_POINT ? (
                      <Switch>
                        <Route path="/" exact>
                          <Redirect to="/swap" />
                        </Route>
                        <Route path="/swap" exact component={Swap} />
                        <Route path="/pool" exact component={Pool} />
                        <Route
                          path="/pool/add"
                          exact
                          component={AddLiquidity}
                        />
                        <Route
                          path="/pool/add/:poolId"
                          exact
                          component={AddLiquidity}
                        />
                        <Route
                          path="/pool/:poolId"
                          exact
                          component={PoolPosition}
                        />
                        <Route
                          path="/remove/:poolId"
                          exact
                          component={Remove}
                        />
                        <Route component={NotFound} />
                      </Switch>
                    ) : (
                      <MobilePlug />
                    )}
                  </Layout>
                </ContextModalProvider>
              </WalletAddressesProvider>
            </SettingsProvider>
          </WalletContextProvider>
        </AppLoadingProvider>
      </Router>
    </ConnectionContextProvider>
  );
};
