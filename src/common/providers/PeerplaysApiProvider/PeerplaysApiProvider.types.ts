import {
  ApiLatencies,
  ApiServer,
  ApisInstanceType,
  WhaleVaultType,
} from "../../types";

export type NodeTransitionCallbackType = (
  status:
    | string
    | boolean
    | {
        background: boolean;
        key: string;
      }
) => void;

export type PeerPlaysApiContextType = {
  getNodes: (
    latenciesMap?: ApiLatencies,
    latencies?: boolean,
    hidden?: boolean,
    unsuitableSecurity?: boolean
  ) => ApiServer[];
  willTransitionTo: (
    appInit?: any,
    _statusCallback?: NodeTransitionCallbackType | undefined
  ) => Promise<void>;
  dbApi: (request: string, data?: any) => Promise<any> | undefined;
  historyApi: (request: string, data?: any) => Promise<any> | undefined;
  assetApi: (request: string, data?: any) => Promise<any> | undefined;
  isTransitionInProgress: () => boolean;
  getTransitionTarget: () =>
    | string
    | boolean
    | {
        background: boolean;
        key: string;
      }
    | undefined;
  isAutoSelection: () => boolean;
  isBackgroundPingingInProgress: () => boolean;
  apiInstance: ApisInstanceType | undefined;
  whaleVaultInstance: WhaleVaultType | undefined;
};
