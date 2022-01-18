import { ChainStore } from "peerplaysjs-lib";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { PeerplaysApi, PeerplaysApiProvider, Props } from "../../../";
import { defaultNodesList } from "../../api/params";
import { initNode } from "../../api/services/initNode";
import { initCache, initSettings } from "../../api/utils";
import { initLocale } from "../../api/utils/locale";

const defaultPeerplaysApiContext: PeerplaysApi = {
  instance: {},
  isLoadingConnection: false,
  isConnectionError: false,
  dbApi: null,
};

const peerplaysApiContext = createContext<PeerplaysApi>(
  defaultPeerplaysApiContext
);

export function usePeerplaysApi(): PeerplaysApi {
  return useContext(peerplaysApiContext);
}

export function PeerplaysApiProvider({ children }: Props): JSX.Element {
  const [instance, setInstance] = useState<any>({});
  const [isLoadingConnection, setIsLoadingConnection] =
    useState<boolean>(false);
  const [isConnectionError, setIsConnectionError] = useState<boolean>(false);

  const setSocketCallBack = (instance: any): void => {
    instance.setRpcConnectionStatusCallback(async (status: string) => {
      if (status !== "closed") return;
      setIsLoadingConnection(true);
      const activeUrl = instance.url;
      const newInstance = await initNode(activeUrl, true);
      if (!newInstance) {
        setIsConnectionError(true);
      } else {
        setInstance(newInstance);
        setIsLoadingConnection(false);
      }
    });
  };

  const initFirstNode = useCallback(async () => {
    setIsLoadingConnection(true);
    let initedNode: any;

    for (const node of defaultNodesList) {
      const initedInstance = await initNode(node.url, true);
      if (initedInstance) {
        initedNode = { ...node, ...initedInstance };
        break;
      }
    }

    if (!initedNode) {
      setIsConnectionError(true);
    } else {
      ChainStore.setDispatchFrequency(0);
      ChainStore.init();
      setInstance(initedNode.instance);
      setIsLoadingConnection(false);
      setSocketCallBack(initedNode.instance);
    }
  }, []);

  const dbApi = useCallback(
    (request, data = []) =>
      instance["_db"].exec(request, data).catch(async (err: any) => {
        const error = "Error: websocket state error:3";
        const url = instance.url;
        if (error === err.message) {
          setIsLoadingConnection(true);
          const initedNode = await initNode(url, true);
          if (!initedNode) {
            setIsConnectionError(true);
          } else {
            setInstance(initedNode.instance);
            setIsLoadingConnection(false);
          }
        }
      }),
    [instance]
  );

  useEffect(() => {
    initCache();
    initSettings();
    initLocale();
    initFirstNode();
  }, []);
  return (
    <peerplaysApiContext.Provider
      value={{ instance, isLoadingConnection, isConnectionError, dbApi }}
    >
      {children}
    </peerplaysApiContext.Provider>
  );
}
