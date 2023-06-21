export type RPCConnectionStatusType = {
  CLOSED: "closed";
  ERROR: "error";
  OPEN: "open";
  RECONNECTED: "reconnected";
};

export type ChainWebSocketType = {
  cbId: number;
  cbs: {
    [requestId: string]: {
      time: Date;
      resolve: (value: any) => void;
      reject: (reason?: any) => void;
    };
  };
  connect_promise: Promise<void>;
  connected: boolean;
  connectionTimeout: NodeJS.Timeout | null;
  createConnection: () => Promise<void>;
  createConnectionPromise: (
    resolve: () => void,
    reject: (error: Error) => Promise<Error>
  ) => void;
  currentReject: (error: Error) => Promise<Error>;
  currentResolve: () => Promise<void>;
  healthCheck: NodeJS.Timeout | null;
  listener: (response: any) => void;
  onConnectionClose: (error: Error) => void;
  onConnectionError: (error: Error) => void;
  onConnectionOpen: () => void;
  onConnectionTerminate: () => void;
  onConnectionTimeout: () => void;
  on_reconnect: null | (() => void);
  reconnectTimeout: NodeJS.Timeout | null;
  serverAddress: string;
  status: RPCConnectionStatusType;
  statusCb: (value?: string) => void;
  subs: { [requestId: number]: any };
  unsub: { [requestId: number]: number };
  timeoutInterval: number;
  ws: WebSocket;
  addEventListeners: () => void;
  call: (params: any[]) => Promise<any>;
  close: () => void;
  debug: (params: any[]) => void;
  login: (user: string, password: string) => Promise<any>;
  removeEventListeners: () => void;
  resetConnection: () => void;
};
//Done
export type GrapheneApiType = {
  ws_rpc: ChainWebSocketType;
  api_name: string;
  api_id: number;
  init: () => Promise<GrapheneApiType>;
  exec: (method: string, params: any[]) => Promise<any>;
};

export type AvailableGrapheneApis =
  | "_db"
  | "_hist"
  | "_net"
  | "_crypto"
  | "_bookie"
  | "_sidechain"
  | "_asset";
//Done
export type ApisInstanceType = {
  chain_id: string;
  init_promise: Promise<
    [
      GrapheneApiType,
      GrapheneApiType,
      GrapheneApiType,
      GrapheneApiType,
      GrapheneApiType,
      GrapheneApiType,
      GrapheneApiType
    ]
  >;
  statusCb: (value?: string) => void;
  url: string;

  ws_rpc: ChainWebSocketType | null;
  _db: GrapheneApiType;
  _net: GrapheneApiType;
  _hist: GrapheneApiType;
  _crypto: GrapheneApiType;
  _bookie: GrapheneApiType;
  _sidechain: GrapheneApiType;
  _asset: GrapheneApiType;
  connect: (cs: string, connectTimeout: number) => void;
  close: () => void;
  db_api: () => GrapheneApiType;
  network_api: () => GrapheneApiType;
  history_api: () => GrapheneApiType;
  crypto_api: () => GrapheneApiType;
  bookie_api: () => GrapheneApiType;
  sidechain_api: () => GrapheneApiType;
  asset_api: () => GrapheneApiType;
  setRpcConnectionStatusCallback: (callback: (value?: string) => void) => void;
};

// Done
export type ApisType = {
  setRpcConnectionStatusCallback: (callback: (value?: string) => void) => void;
  reset: (
    cs: string,
    connect: boolean,
    connectTimeout?: number
  ) => ApisInstanceType;
  instance: (
    cs?: string,
    connect?: boolean,
    connectTimeout?: number
  ) => ApisInstanceType | undefined;
  chainId: () => string;
  close: () => void;
};

export type ConnectionManagerType = {
  url: string;
  urls: string[];
  logFailure: (url: string) => void;
  isURL: (str: string) => boolean;
  connect: (connect?: boolean, url?: string) => Promise<void>;
  connectWithFallback: (
    connect?: boolean,
    url?: string,
    index?: null,
    resolve?: any,
    reject?: any
  ) => Promise<void>;
  ping: (conn: ChainWebSocketType, resolve: any, reject: any) => Promise<any>;
  sortNodesByLatency: (resolve: any, reject: any) => Promise<any>;
  checkConnections: (resolve: any, reject: any) => Promise<any>;
};

export type CommonWhaleVaultResponse = {
  data: {
    addKeys: any;
    appid: string;
    domain: string;
    request_id: number;
    type: string;
    username: string;
  };
  error: string | null;
  message: string;
  request_id: number;
  success: boolean;
};

export type WhaleVaultPubKeys = {
  activePubkey?: string;
  activePubkey_K1?: string;
  memoPubkey?: string;
  memoPubkey_K1?: string;
};

export type RequestPubKeysResponse = {
  result: {
    [username: string]: WhaleVaultPubKeys;
  };
};

export type WhaleVaultType = {
  current_id: number;
  promiseRequestPubKeys: (
    appid: string,
    account: string
  ) => Promise<CommonWhaleVaultResponse & RequestPubKeysResponse>;
  // promiseRequestDecryptMemo: (
  //   appid: string,
  //   account: string,
  //   message: string,
  //   keyType: "active" | "memo",
  //   reason: string
  // ) => Promise<void>;
};
