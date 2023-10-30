import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import TagManager from "react-gtm-module";

import { config } from "../api/params";
import {
  AppSettingsProvider,
  AssetsProvider,
  BrowserHistoryProvider,
  ConnectionManagerProvider,
  FeesProvider,
  MarketProvider,
  MenuProvider,
  NotificationsProvider,
  PeerplaysApiProvider,
  UserProvider,
  ViewportProvider,
} from "../common/providers";
import "../ui/src/ui.less";

function App({ Component, pageProps }: AppProps): JSX.Element {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  );

  let didTagManagerInit = false;
  useEffect(() => {
    if (!didTagManagerInit) {
      didTagManagerInit = true;
      if (config.googleTagManagerId && config.googleTagManagerId !== "") {
        didTagManagerInit = true;
        const tagManagerArgs = {
          gtmId: config.googleTagManagerId,
        };
        TagManager.initialize(tagManagerArgs);
      }
    }
  }, []);

  return (
    <ViewportProvider>
      <AppSettingsProvider>
        <PeerplaysApiProvider>
          <ConnectionManagerProvider>
            <AssetsProvider>
              <FeesProvider>
                <UserProvider>
                  <BrowserHistoryProvider>
                    <NotificationsProvider>
                      <MenuProvider>
                        <MarketProvider>
                          <Component {...pageProps} />
                        </MarketProvider>
                      </MenuProvider>
                    </NotificationsProvider>
                  </BrowserHistoryProvider>
                </UserProvider>
              </FeesProvider>
            </AssetsProvider>
          </ConnectionManagerProvider>
        </PeerplaysApiProvider>
      </AppSettingsProvider>
    </ViewportProvider>
  );
}

export default App;
