import counterpart from "counterpart";
import { Apis, ChainStore } from "peerplaysjs-lib";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ApisInstanceType, DynamicGlobalProperties } from "../../types";

import { ChainStoreContextType } from "./ChainStoreProvider.types";

type Props = {
  children: React.ReactNode;
  apiInstance: ApisInstanceType | undefined;
  dbApi: (request: string, data?: any) => Promise<any> | undefined;
};

const defaultChainStoreState: ChainStoreContextType =
  {} as ChainStoreContextType;

const ChainStoreContext = createContext<ChainStoreContextType>(
  defaultChainStoreState
);

const OUT_OF_SYNC_LIMIT = 7;

export const ChainStoreProvider = ({
  children,
  apiInstance,
  dbApi,
}: Props): JSX.Element => {
  const [syncFail, setSyncFail] = useState<boolean>(false);
  const [synced, setSynced] = useState<boolean>(true);
  const [rpcConnectionStatus, setRpcConnectionStatus] = useState<
    string | undefined
  >("open");
  const dynGlobalObject = useRef<DynamicGlobalProperties>();

  const getBlockTime = useCallback(() => {
    if (dynGlobalObject.current) {
      let blockTime = dynGlobalObject.current.time;
      if (!/Z$/.test(blockTime)) {
        blockTime += "Z";
      }
      return new Date(blockTime);
    } else {
      throw new Error("Blocktime not available right now");
    }
  }, [dynGlobalObject, dynGlobalObject.current]);

  const getBlockTimeDelta = useCallback(() => {
    try {
      const bt =
        (getBlockTime().getTime() + ChainStore.getEstimatedChainTimeOffset()) /
        1000;
      const now = new Date().getTime() / 1000;
      return Math.abs(now - bt);
    } catch (e) {
      console.log(e);
      return -1;
    }
  }, [getBlockTime, ChainStore]);

  const getSyncStatus: () => boolean = useCallback(() => {
    const _synced = getBlockTimeDelta() < OUT_OF_SYNC_LIMIT;
    setSynced(_synced);
    return _synced;
  }, [getBlockTimeDelta, OUT_OF_SYNC_LIMIT, setSynced]);

  const chainStoreSub = useCallback(() => {
    const _synced = getSyncStatus();
    if (ChainStore.subscribed !== _synced || ChainStore.subError) {
      const syncFail =
        ChainStore.subError &&
        ChainStore.subError.message ===
          "ChainStore sync error, please check your system clock"
          ? true
          : false;
      setSyncFail(syncFail);
    }
  }, [getSyncStatus, ChainStore, setSyncFail]);

  const setListeners = useCallback(() => {
    try {
      ChainStore.subscribe(chainStoreSub);
    } catch (e) {
      console.error("e:", e);
    }
  }, [ChainStore, chainStoreSub]);

  const updateRpcConnectionStatus = useCallback(
    (status?: string) => {
      setRpcConnectionStatus(status);
    },
    [setRpcConnectionStatus]
  );

  const updateChainStates = useCallback(async () => {
    try {
      const dgpo = await dbApi("get_objects", [["2.1.0"]]);
      if (dgpo && dgpo.length > 0) {
        dynGlobalObject.current = dgpo[0] as DynamicGlobalProperties;
      }
    } catch (e) {
      console.log(e);
    }
  }, [dbApi]);

  useEffect(() => {
    setListeners();
    const syncCheckInterval = setInterval(getSyncStatus, 5000);
    return () => {
      clearInterval(syncCheckInterval);
    };
  }, [setListeners]);

  useEffect(() => {
    apiInstance?.setRpcConnectionStatusCallback(updateRpcConnectionStatus);
  }, [Apis, updateRpcConnectionStatus, apiInstance]);

  useEffect(() => {
    ChainStore.subscribe(updateChainStates);
    return () => {
      ChainStore.unsubscribe(updateChainStates);
    };
  }, [apiInstance]);

  const context = useMemo(() => {
    return {
      synced,
      getBlockTimeDelta,
      rpcConnectionStatus,
      OUT_OF_SYNC_LIMIT,
    };
  }, [synced, getBlockTimeDelta, rpcConnectionStatus, OUT_OF_SYNC_LIMIT]);

  return (
    <ChainStoreContext.Provider value={context}>
      {syncFail ? (
        <div
          style={{
            height: "100px",
            margin: "0",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h1>{counterpart.translate(`app_init.sync_error.title`)}</h1>
          <div>
            {counterpart.translate(`app_init.sync_error.first_description`)}
          </div>
          <div>
            {counterpart.translate(`app_init.sync_error.second_description`)}
          </div>
        </div>
      ) : (
        children
      )}
    </ChainStoreContext.Provider>
  );
};

export const useChainStoreContext = (): ChainStoreContextType => {
  return useContext<ChainStoreContextType>(ChainStoreContext);
};
