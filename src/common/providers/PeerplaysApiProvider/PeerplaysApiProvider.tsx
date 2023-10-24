import counterpart from "counterpart";
import hirestime from "hirestime";
import { shuffle } from "lodash";
import {
  Apis,
  ChainConfig,
  ChainStore,
  ConnectionManager,
  WhaleVaultConfig,
} from "peerplaysjs-lib";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useAppSettingsContext } from "../";
import { defaultToken } from "../../../api/params";
import {
  ApiLatencies,
  ApiServer,
  ApisInstanceType,
  ApisType,
  AvailableGrapheneApis,
  ConnectionManagerType,
  GrapheneApiType,
  LatencyPreferences,
  Node,
  NodeTree,
  NodeTreeBranch,
  WhaleVaultType,
} from "../../types";

import {
  NodeTransitionCallbackType,
  PeerPlaysApiContextType,
} from "./PeerplaysApiProvider.types";

type Props = {
  children: React.ReactNode;
};

const REFRESHING_CONNECTION_ATTEMPTS_LIMIT = 8;

const PeerPlaysApiContext = createContext<PeerPlaysApiContextType>(
  {} as PeerPlaysApiContextType
);

ChainStore.setDispatchFrequency(60);

/** PeerplaysApiProvider is a helper context that facilitates connecting, switching, reconnecting, and using Peerplays api
 */
export const PeerplaysApiProvider = ({ children }: Props): JSX.Element => {
  const [whaleVaultInstance, setWhaleVaultInstance] =
    useState<WhaleVaultType>();
  const [willTransitionToInProgress, setWillTransitionToInProgress] = useState<
    boolean | string | { background: boolean; key: string }
  >(false);
  // boolean flag if the lowest latency node should be autoselected
  const _isAutoSelection = useRef<boolean>(false);
  // function that can be provided to willTransitionTo
  const statusCallback = useRef<NodeTransitionCallbackType>();
  const connectionManager = useRef<ConnectionManagerType>(
    new ConnectionManager({ url: "", urls: [] as string[] })
  );
  const connectionStart = useRef<number>();
  const connectInProgress = useRef<boolean>(false);
  const oldChain = useRef<string>();

  // Pinger
  const pingerBeSatisfiedWith = useRef<{
    instant: number;
    low: number;
    medium: number;
  }>({ instant: 0, low: 0, medium: 0 });
  const pingerCounter = useRef<{
    instant: number;
    low: number;
    medium: number;
  }>({ instant: 0, low: 0, medium: 0 });
  const suitableNodeFound = useRef<boolean>(false);
  const pingInBackGround = useRef<boolean>(false);
  const updateTransitionTargetKey = useRef<string>();
  const pingerNodeURLs = useRef<string[]>([]);
  const currentNode = useRef<number>(0);
  const localLatencyCache = useRef<ApiLatencies>({});
  const callbackWasCalled = useRef<boolean>(false);
  const range = useRef<number>(3);
  const callback = useRef<(() => Promise<void>) | (() => void)>();

  //DirectPinger
  const directPingerUrls = useRef<
    {
      url: string;
      latency: number | undefined;
    }[]
  >([]);
  const directPingerTimeout = useRef<number>(2000);

  // PingerStrategy
  const pingerStrategyNodesList = useRef<ApiServer[]>([]);
  const pingerStrategyCallback = useRef<(() => Promise<void>) | (() => void)>();
  const nodeTree = useRef<NodeTree>({});
  const preferences = useRef<LatencyPreferences>({} as LatencyPreferences);
  const apiInstance = useRef<ApisInstanceType>();

  const {
    setApiSettings,
    apiSettings,
    latencyChecks,
    setLatencyChecks,
    apiLatencies,
    setApiLatencies,
    latencyPreferences,
    setLatencyPreferences,
    setConnectedNode,
  } = useAppSettingsContext();

  const isAutoSelection = useCallback(() => {
    return _isAutoSelection.current;
  }, [_isAutoSelection, _isAutoSelection.current]);

  const isTransitionInProgress = useCallback(() => {
    return (
      !!willTransitionToInProgress &&
      typeof willTransitionToInProgress !== "object"
    );
  }, [willTransitionToInProgress]);

  const isBackgroundPingingInProgress = useCallback(() => {
    return (
      !!willTransitionToInProgress &&
      typeof willTransitionToInProgress === "object"
    );
  }, [willTransitionToInProgress]);

  const getTransitionTarget = useCallback(() => {
    if (isTransitionInProgress()) {
      return willTransitionToInProgress;
    }
  }, [isTransitionInProgress, willTransitionToInProgress]);

  const apiUrlSecuritySuitable = useCallback((apiNodeUrl: string) => {
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:"
    ) {
      return apiNodeUrl.indexOf("ws://") == -1;
    } else {
      return true;
    }
  }, []);

  /**
   * Get the node url that the user has chosen to connect to or has been able to connect to through fallback
   *
   * @returns {*}
   */
  const getSelectedNode = useCallback(() => {
    return apiSettings.selectedNode;
  }, [apiSettings]);

  /**
   * Returns a list of all configured api nodes
   *
   * @returns list of dictionaries with keys: url, hidden, location
   */
  const getAllApiServers = useCallback(() => {
    return apiSettings.apiServers.filter((apiServer) => {
      // Remove all but the whitelisted ones
      const filteredApiServers = apiSettings.filteredApiServers;
      if (filteredApiServers.length > 0) {
        // list may contain urls or regions
        if (filteredApiServers.indexOf(apiServer.node.url) !== -1) {
          return true;
        }
        if (
          !!apiServer.node.region &&
          filteredApiServers.indexOf(apiServer.node.region) !== -1
        ) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    });
  }, [apiSettings, apiSettings.apiServers, apiSettings.filteredApiServers]);

  /**
   * Returns a list of all nodes as given by the flags, always sorted
   *
   * @param latenciesMap (default undefined) map of all latencies, if null taken from settings
   * @param latencies (default true) if true, and latenciesMap has entries, then filter out all without latency
   * @param hidden (default false) if false, filter out all hidden nodes
   * @param unsuitableSecurity (default false) if false, filter out all with unsuitable security
   *
   * @returns list of viable api nodes (with above filters applied)
   *          if latencies is given, the nodes are sorted with descending latency (index 0 fasted one)
   */
  const getNodes: (
    latenciesMap?: ApiLatencies,
    withLatencies?: boolean,
    hidden?: boolean,
    unsuitableSecurity?: boolean
  ) => ApiServer[] = useCallback(
    (
      latenciesMap,
      withLatencies = true,
      hidden = false,
      unsuitableSecurity = false
    ) => {
      let filledLatenciesMap: ApiLatencies;
      if (!latenciesMap) {
        filledLatenciesMap = apiLatencies;
      } else {
        filledLatenciesMap = latenciesMap;
      }
      if (withLatencies) {
        // if there are no latencies, return all that are left after filtering
        withLatencies = Object.keys(filledLatenciesMap).length > 0;
      }
      let filteredApiServers = getAllApiServers().filter((apiServer) => {
        // Skip hidden nodes
        if (!hidden && apiServer.hidden) return false;

        // remove the automatic fallback dummy url
        if (apiServer.node.url.indexOf("fake.automatic-selection") !== -1)
          return false;

        // Remove insecure websocket urls when using secure protocol
        if (
          !unsuitableSecurity &&
          !apiUrlSecuritySuitable(apiServer.node.url)
        ) {
          return false;
        }
        // we don't know any latencies, return all
        if (!withLatencies) return true;

        // only keep the ones we were able to connect to
        return !!filledLatenciesMap[apiServer.node.url];
      });
      // create more info in the entries
      filteredApiServers = filteredApiServers.map((apiServer) => {
        apiServer.name = apiServer.node.location || "Unknown";
        if (apiServer.node.url in filledLatenciesMap) {
          apiServer.latency = filledLatenciesMap[apiServer.node.url];
        } else {
          apiServer.latency = undefined;
        }
        return apiServer;
      });
      // now sort
      filteredApiServers = filteredApiServers.sort((a, b) => {
        // if both have latency, sort according to that
        if (a.latency && b.latency) {
          return a.latency - b.latency;
          // sort testnet to the bottom
        } else if (!a.latency && !b.latency) {
          return 1;
          // otherwise prefer the pinged one
        } else if (a.latency && !b.latency) {
          return -1;
        } else if (b.latency && !a.latency) {
          return 1;
        }
        return 0;
      });

      /*
       * We've somehow filtered out all nodes, revert to the full list of
       * nodes in that case
       */
      if (!filteredApiServers.length) {
        console.warn("No nodes length, returning all of them");
        return getAllApiServers();
      }
      return filteredApiServers;
    },
    [getAllApiServers, apiUrlSecuritySuitable, apiLatencies]
  );

  /**
   * Returns a list of viable api nodes that we consider connecting to
   *
   * @param all (default false) if true, all nodes are returned
   * @param latenciesMap (default undefined) map of all latencies, if null taken from settings
   * @param keepObject (default false) either returns only the url or full node object
   * @returns list of strings or list of ApiServers
   */
  const getNodesToConnectTo: (
    latenciesMap?: ApiLatencies,
    all?: boolean,
    keepObject?: boolean
  ) => ApiServer[] | string[] = useCallback(
    (latenciesMap, all = false, keepObject = false) => {
      const nodeList = getNodes(latenciesMap, !all); // drop location, only urls in list
      if (!keepObject) {
        const urls = nodeList.map((apiServer) => apiServer.node.url);
        return urls;
      } else {
        return nodeList;
      }
    },
    [getNodes]
  );

  const getFirstToTry = useCallback(
    (urls: string[]) => {
      let tryThisNode = getSelectedNode();
      // fallback to the best of the pre-defined URLs ...

      // ... if there is no preset connectionString fallback to lowest latency
      if (!tryThisNode) tryThisNode = urls[0];

      // ... if auto selection is on (is also ensured in initConnection, but we don't want to ping
      //     a unreachable url)
      if (isAutoSelection()) {
        tryThisNode = urls[0];
        console.log("auto selecting to " + tryThisNode);
      }

      if (!tryThisNode) {
        // something went horribly wrong, no node to connect to
        throw new Error("No node to connect to found, this should not happen.");
      }

      // ... if insecure websocket url is used when using secure protocol
      //    (the list urls only contains matching ones)
      if (!apiUrlSecuritySuitable(tryThisNode)) tryThisNode = urls[0];

      return tryThisNode;
    },
    [getSelectedNode, isAutoSelection, apiUrlSecuritySuitable]
  );

  const initConnectionManager: (urls?: string[]) => void = useCallback(
    (urls) => {
      if (!urls) {
        urls = getNodesToConnectTo(undefined, true) as string[];
      }
      // decide where to connect to first
      const connectionString = getFirstToTry(urls);
      setWillTransitionToInProgress(connectionString);
      const _connectionManager: ConnectionManagerType = new ConnectionManager({
        url: connectionString,
        urls: urls,
      });
      connectionManager.current = _connectionManager;
    },
    [
      getNodesToConnectTo,
      getFirstToTry,
      setWillTransitionToInProgress,
      connectionManager,
    ]
  );

  const updateTransitionTarget = useCallback(
    (update: string | { background: boolean; key: string } | boolean) => {
      setWillTransitionToInProgress(update);
      if (statusCallback.current !== undefined) {
        statusCallback.current(update);
      }
    },
    [statusCallback, statusCallback.current, setWillTransitionToInProgress]
  );

  const clearLatencies = useCallback(() => {
    setApiLatencies({} as ApiLatencies);
  }, [setApiLatencies]);

  const transitionDone = useCallback(() => {
    setWillTransitionToInProgress(false);
    statusCallback.current = undefined;
  }, [setWillTransitionToInProgress]);

  const enableBackgroundPinging = useCallback(() => {
    pingerBeSatisfiedWith.current = { instant: 0, low: 0, medium: 0 };
    pingerCounter.current = { instant: 0, low: 0, medium: 0 };
    suitableNodeFound.current = false;
    pingInBackGround.current = true;
  }, []);

  const addPingerNodes: (
    nodes: string[],
    reset?: boolean,
    translationKey?: string
  ) => void = useCallback(
    (nodes, reset = true, translationKey = undefined) => {
      updateTransitionTargetKey.current = translationKey;
      if (reset || pingerNodeURLs.current.length === 0) {
        pingerNodeURLs.current = nodes;
        currentNode.current = 0;
        pingerCounter.current = { instant: 0, low: 0, medium: 0 };
        localLatencyCache.current = {};
        suitableNodeFound.current = false;
        pingInBackGround.current = false;
      } else {
        const notAddedNodeURLs: string[] = [];
        nodes.forEach((node) => {
          if (pingerNodeURLs.current.indexOf(node) === -1) {
            notAddedNodeURLs.push(node);
          }
        });
        pingerNodeURLs.current = [
          ...pingerNodeURLs.current,
          ...notAddedNodeURLs,
        ];
      }
    },
    [pingerNodeURLs, pingerNodeURLs.current]
  );

  const continueToPing = useCallback(() => {
    return (
      currentNode.current < pingerNodeURLs.current.length &&
      (!suitableNodeFound.current || pingInBackGround.current)
    );
  }, [
    currentNode,
    currentNode.current,
    pingerNodeURLs,
    pingerNodeURLs.current,
    pingerNodeURLs.current.length,
    suitableNodeFound,
    suitableNodeFound.current,
    pingInBackGround,
    pingInBackGround.current,
  ]);

  const notifyCallback = useCallback(() => {
    if (callbackWasCalled.current) {
      return false;
    } else {
      return (
        suitableNodeFound.current ||
        currentNode.current === pingerNodeURLs.current.length
      );
    }
  }, [
    callbackWasCalled,
    callbackWasCalled.current,
    suitableNodeFound,
    suitableNodeFound.current,
    currentNode.current,
    pingerNodeURLs,
    pingerNodeURLs.current,
    pingerNodeURLs.current.length,
  ]);

  const addDirectPingerURL = useCallback(
    (url: string) => {
      directPingerUrls.current = [
        ...directPingerUrls.current,
        { url, latency: NaN },
      ];
    },
    [
      directPingerUrls,
      directPingerUrls.current,
      directPingerUrls.current.length,
    ]
  );

  const checkURL = useCallback(
    (url: string) => {
      return new Promise<undefined | number>((resolve) => {
        setTimeout(function () {
          resolve(undefined);
        }, directPingerTimeout.current);
        try {
          let closeTime = 0;
          const connection = new WebSocket(url);
          const openTime = hirestime();
          connection.onerror = () => {
            resolve(undefined);
          };
          connection.onopen = () => {
            connection.onmessage = function () {
              closeTime = openTime.ms();
              connection.close();
              resolve(closeTime);
            };
            connection.onmessage.bind(connection);
            connection.send(
              '{"id":1,"method":"call","params":[1,"login",["",""]]}'
            );
          };
        } catch (e) {
          console.log(e);
          resolve(undefined);
        }
      });
    },
    [directPingerTimeout, directPingerTimeout.current]
  );

  const runCheck = useCallback(async () => {
    const latencyPromises: Promise<number | undefined>[] = [];

    for (const directPingerUrl of directPingerUrls.current) {
      const latencyPromise = checkURL(directPingerUrl.url);
      latencyPromises.push(latencyPromise);
    }

    const latencies = await Promise.all(latencyPromises);

    directPingerUrls.current = directPingerUrls.current.map((url, index) => {
      return {
        url: url.url,
        latency: latencies[index],
      };
    });
    directPingerUrls.current.sort((a, b) => {
      return Number(a.latency) - Number(b.latency);
    });
    return directPingerUrls.current.slice();
  }, [
    directPingerUrls,
    directPingerUrls.current,
    directPingerUrls.current.length,
    checkURL,
  ]);

  const checkUrlsPings = useCallback(
    async (urls: string[]) => {
      urls.forEach((url) => {
        addDirectPingerURL(url);
      });
      const _all = {} as ApiLatencies;
      try {
        const result = await runCheck();
        if (result && Object.keys(result).length > 0) {
          result.forEach((item) => {
            _all[item.url] = item.latency;
          });
        }
        return _all;
      } catch (err) {
        console.error(err);
      }
    },
    [addDirectPingerURL, runCheck]
  );

  const checkIfSuitableFound = useCallback(() => {
    if (
      pingerCounter.current.instant > 0 ||
      pingerCounter.current.low >= 2 ||
      pingerCounter.current.medium >= 3
    ) {
      suitableNodeFound.current = true;
    }
  }, [pingerCounter, pingerCounter.current]);

  const updateSuitabilityCounter = useCallback(
    (res: ApiLatencies) => {
      for (const nodeUrl in Object.keys(res)) {
        if ((res[nodeUrl] as number) < pingerBeSatisfiedWith.current.instant) {
          pingerCounter.current.instant = pingerCounter.current.instant + 1;
        } else if (
          (res[nodeUrl] as number) < pingerBeSatisfiedWith.current.low
        ) {
          pingerCounter.current.low = pingerCounter.current.low + 1;
        } else if (
          (res[nodeUrl] as number) < pingerBeSatisfiedWith.current.medium
        ) {
          pingerBeSatisfiedWith.current.medium =
            pingerBeSatisfiedWith.current.medium + 1;
        }
      }
      checkIfSuitableFound();
    },
    [
      pingerBeSatisfiedWith,
      pingerBeSatisfiedWith.current,
      pingerCounter,
      pingerCounter.current,
      checkIfSuitableFound,
    ]
  );

  const _updateLatencies: (
    mapOfPings: ApiLatencies,
    force: boolean,
    container?: ApiLatencies
  ) => void = useCallback(
    (mapOfPings, force = true, container = undefined) => {
      const _apiLatencies = apiLatencies;
      for (const node in mapOfPings) {
        if (!force && node in _apiLatencies) {
          continue;
        }
        _apiLatencies[node] = mapOfPings[node];
        if (container !== undefined) {
          container[`${node}`] = mapOfPings[node];
        }
      }
      setApiLatencies(_apiLatencies);
    },
    [apiLatencies, setApiLatencies]
  );

  const handlePingResult = useCallback(
    (res?: ApiLatencies) => {
      if (!!res && Object.keys(res).length > 0) {
        updateSuitabilityCounter(res);
        // build additional ping cache
        _updateLatencies(res, true, localLatencyCache.current);
      }
    },
    [
      updateSuitabilityCounter,
      _updateLatencies,
      localLatencyCache,
      localLatencyCache.current,
    ]
  );

  const pingNodesInBatches = useCallback(async () => {
    // cache the value, callback might change something
    const _continueToPing = continueToPing();
    if (notifyCallback()) {
      callbackWasCalled.current = true;
      if (continueToPing()) {
        console.log(
          "Node with sufficient latency found, continueing to ping the rest in background"
        );
      }
      if (callback.current) {
        callback.current();
      }
    }

    if (_continueToPing) {
      const pingNow = pingerNodeURLs.current.slice(
        currentNode.current,
        currentNode.current + range.current
      );
      const key =
        updateTransitionTargetKey.current === undefined
          ? "app_init.check_latency_feedback"
          : updateTransitionTargetKey.current;
      if (!pingInBackGround.current) {
        updateTransitionTarget(
          counterpart.translate(key, {
            pinged: currentNode.current,
            totalToPing: pingerNodeURLs.current.length,
          })
        );
      } else {
        updateTransitionTarget({
          background: true,
          key: counterpart.translate(key, {
            pinged: currentNode.current,
            totalToPing: pingerNodeURLs.current.length,
          }),
        });
      }
      try {
        const localApiLatencies = await checkUrlsPings(pingNow);
        handlePingResult(localApiLatencies);
      } catch (err) {
        console.error("doLatencyUpdate error", err);
      } finally {
        currentNode.current = currentNode.current + pingNow.length;
        setTimeout(pingNodesInBatches, 500);
      }
    } else {
      // show message for seconds, then finished
      updateTransitionTarget(false);
    }
  }, [
    continueToPing,
    notifyCallback,
    callback,
    callback.current,
    pingerNodeURLs,
    pingerNodeURLs.current,
    pingerNodeURLs.current.length,
    currentNode,
    currentNode.current,
    range,
    range.current,
    updateTransitionTargetKey,
    updateTransitionTargetKey.current,
    pingInBackGround,
    pingInBackGround.current,
    updateTransitionTarget,
    checkUrlsPings,
    handlePingResult,
  ]);

  /**
   * Ping the currently stored nodes and call the callback when done.
   *
   * @param callbackFunc function handle callback when pinging is done
   * @param nodes optional, add to internal node list before pinging
   */
  const pingNodes: (
    callbackFunc?: (() => Promise<void>) | (() => void),
    nodes?: string[]
  ) => Promise<void> = useCallback(
    async (callbackFunc, nodes = undefined) => {
      if (nodes) {
        addPingerNodes(nodes, true);
      }
      callbackWasCalled.current = false;
      callback.current = callbackFunc;
      // defaults
      range.current = 3;
      await pingNodesInBatches();
    },
    [addPingerNodes, pingNodesInBatches]
  );

  const updateBeSatisfiedWith = useCallback((pingAll: boolean) => {
    if (pingAll) {
      pingerBeSatisfiedWith.current = { instant: 0, low: 0, medium: 0 };
    } else {
      pingerBeSatisfiedWith.current = {
        instant: 500,
        low: 800,
        medium: 1500,
      };
    }
  }, []);

  const sortNodesToTree = useCallback((nodesToPing: ApiServer[]) => {
    const _nodeTree = {} as NodeTree;
    nodesToPing.forEach((_node) => {
      const region = _node.node.region as string;
      const country = _node.node.country as string;
      if (_nodeTree[region] === undefined) {
        _nodeTree[region] = { all: [] as Node[] } as NodeTreeBranch;
      }
      if ((_nodeTree[region] as NodeTreeBranch)[country] === undefined) {
        (_nodeTree[region] as NodeTreeBranch)[country] = [];
      }

      (_nodeTree[region] as NodeTreeBranch).all.push(_node.node);
      ((_nodeTree[region] as NodeTreeBranch)[country] as Node[]).push(
        _node.node
      );
    });
    nodeTree.current = _nodeTree;
  }, []);

  const pingTheRest = useCallback(async () => {
    addPingerNodes(
      pingerStrategyNodesList.current.map((a) => a.node.url),
      false,
      "app_init.check_latency_feedback_rest"
    );
    await pingNodes(pingerStrategyCallback.current);
  }, [
    addPingerNodes,
    pingNodes,
    pingerStrategyNodesList,
    pingerStrategyNodesList.current,
    pingerStrategyCallback,
    pingerStrategyCallback.current,
  ]);

  const getLocalLatencyMap = useCallback(() => {
    return localLatencyCache.current;
  }, [localLatencyCache, localLatencyCache.current]);

  const getFromRegion: (
    regionKey: string,
    countryKey?: string,
    amount?: number,
    randomOrder?: boolean
  ) => Node[] = useCallback(
    (regionKey, countryKey = undefined, amount = 10, randomOrder = true) => {
      const filtered: Node[] = [];

      let countryKeys: string[] = [];
      if (!countryKey) {
        countryKeys = ["all"];
      } else {
        countryKeys = [countryKey];
      }

      countryKeys.forEach((_countryKey) => {
        if (
          !nodeTree.current[regionKey] ||
          !(nodeTree.current[regionKey] as NodeTreeBranch)[_countryKey]
        ) {
          return;
        }

        const allFromRegion = (nodeTree.current[regionKey] as NodeTreeBranch)[
          _countryKey
        ] as Node[];

        const shuffled = randomOrder ? shuffle(allFromRegion) : allFromRegion;

        let i;
        for (i = 1; i <= amount; i++) {
          if (shuffled.length >= i) filtered.push(shuffled[i - 1]);
        }
      });

      return filtered;
    },
    [nodeTree, nodeTree.current]
  );

  const pingAllFromOneRegion: (region?: string) => Promise<void> = useCallback(
    async (region = undefined) => {
      if (region === undefined) {
        const bestOne = getNodes(getLocalLatencyMap());
        region = bestOne && bestOne[0].node.region;
      }
      if (region) {
        addPingerNodes(
          getFromRegion(region).map((a) => a.url),
          false,
          "app_init.check_latency_feedback_region"
        );
      }

      await pingNodes(pingTheRest);
    },
    [
      getNodes,
      getLocalLatencyMap,
      addPingerNodes,
      getFromRegion,
      pingNodes,
      pingTheRest,
    ]
  );

  const pingAllFromOneCountry: (
    region?: string,
    country?: string
  ) => Promise<void> = useCallback(
    async (region = undefined, country = undefined) => {
      if (region === undefined) {
        const bestOne = getNodes(getLocalLatencyMap());
        region = bestOne && bestOne[0].node.region;
        country = bestOne && bestOne[0].node.country;
      }
      if (region && country) {
        addPingerNodes(
          getFromRegion(region, country).map((a) => a.url),
          false,
          "app_init.check_latency_feedback_country"
        );
      }

      await pingNodes(pingAllFromOneRegion);
    },
    [
      getNodes,
      getLocalLatencyMap,
      addPingerNodes,
      getFromRegion,
      pingNodes,
      pingAllFromOneRegion,
    ]
  );

  const getFromEachRegion: (amount?: number, randomOrder?: boolean) => Node[] =
    useCallback(
      (amount = 2, randomOrder = true) => {
        const filtered: Node[] = [];

        Object.keys(nodeTree.current).forEach((regionKey) => {
          const allFromRegion = (nodeTree.current[regionKey] as NodeTreeBranch)[
            "all"
          ];
          let i;
          for (i = 1; i <= amount; i++) {
            if (allFromRegion.length >= i) filtered.push(allFromRegion[i - 1]);
          }
        });

        if (randomOrder) {
          return shuffle(filtered);
        } else {
          return filtered;
        }
      },
      [nodeTree, nodeTree.current]
    );

  const pingTheWorld = useCallback(async () => {
    addPingerNodes(
      getFromEachRegion().map((a) => a.url),
      false,
      "app_init.check_latency_feedback_world"
    );
    await pingNodes(pingAllFromOneCountry);
  }, [addPingerNodes, getFromEachRegion, pingNodes, pingAllFromOneCountry]);

  const decideNext = useCallback(async () => {
    if (!!preferences.current.region && !!preferences.current.country) {
      await pingAllFromOneCountry(
        preferences.current.region,
        preferences.current.country
      );
    } else if (preferences.current.region) {
      await pingAllFromOneRegion(preferences.current.region);
    } else {
      await pingTheWorld();
    }
  }, [
    preferences,
    preferences.current,
    pingAllFromOneCountry,
    pingAllFromOneRegion,
    pingTheWorld,
  ]);

  const ping: (
    firstURL?: string,
    _preferences?: LatencyPreferences
  ) => Promise<void> = useCallback(
    async (firstURL, _preferences = {} as LatencyPreferences) => {
      preferences.current = _preferences;

      if (firstURL) {
        addPingerNodes(
          [firstURL],
          false,
          "app_init.check_latency_feedback_last"
        );
        await pingNodes(decideNext);
      } else {
        await decideNext();
      }
    },
    [preferences, preferences.current, addPingerNodes, pingNodes, decideNext]
  );

  /**
   * Updates the latency of all target nodes
   *
   * @param discardOldLatencies boolean if true drop all old latencies and reping
   * @param pingAll boolean if true, resolve promise after all nodes are pinged, if false resolve when sufficiently small latency has been found
   * @param pingInBackground integer if > 0, pinging will continue in background after promise is resolved, Integer value will be used as delay
   * to start background ping
   * @returns {Promise<void>}
   */
  const doLatencyUpdate: (
    discardOldLatencies?: boolean,
    pingAll?: boolean,
    pingInBackground?: number
  ) => Promise<void> = useCallback(
    async (
      discardOldLatencies = false,
      pingAll = false,
      pingInBackground = 5000
    ) => {
      updateTransitionTarget(counterpart.translate("app_init.check_latency"));

      // if for some reason this method is called before connections are setup via willTransitionTo,
      // initialize the manager
      if (!connectionManager.current) {
        initConnectionManager();
      }
      const nodeList = getNodesToConnectTo(
        undefined,
        true,
        true
      ) as ApiServer[];
      pingerStrategyNodesList.current = nodeList;
      if (discardOldLatencies) {
        clearLatencies();
      }

      const originalURL = connectionManager.current.url;

      updateBeSatisfiedWith(pingAll);
      sortNodesToTree(nodeList);

      function donePinging() {
        // resort the api nodes with the new pings
        const apiServers = getNodesToConnectTo(
          undefined,
          false,
          true
        ) as ApiServer[];
        connectionManager.current.urls = apiServers.map((a) => a.node.url);
        // update preferences
        setLatencyPreferences({
          region: apiServers[0].node.region,
          country: apiServers[0].node.country,
        } as LatencyPreferences);

        if (
          isAutoSelection() &&
          originalURL !== connectionManager.current.urls[0]
        ) {
          connectionManager.current.url = connectionManager.current.urls[0];
          console.log(
            "auto selecting to " +
              connectionManager.current.url +
              " after latency update"
          );
        } else {
          connectionManager.current.url = originalURL;
        }
        transitionDone();

        if (pingInBackground > 0) {
          const _func = function () {
            // wait for transition to be completed
            if (!willTransitionToInProgress) {
              enableBackgroundPinging();
              pingNodes(() => {
                const _nodes = getNodesToConnectTo(
                  undefined,
                  false,
                  true
                ) as ApiServer[];
                connectionManager.current.urls = _nodes.map((a) => a.node.url);
                transitionDone();
              });
            } else {
              setTimeout(_func, 2000);
            }
          };
          setTimeout(_func, pingInBackground);
        }
      }
      pingerStrategyCallback.current = donePinging;

      await ping(
        isAutoSelection() ? undefined : getSelectedNode(),
        latencyPreferences
      );
    },
    [
      updateTransitionTarget,
      connectionManager,
      connectionManager.current,
      initConnectionManager,
      getNodesToConnectTo,
      clearLatencies,
      updateBeSatisfiedWith,
      sortNodesToTree,
      setLatencyPreferences,
      isAutoSelection,
      transitionDone,
      willTransitionToInProgress,
      enableBackgroundPinging,
      pingNodes,
      getSelectedNode,
      ping,
      latencyPreferences,
    ]
  );

  const setSelectedNode = useCallback(
    (url: string) => {
      // only update settings if changed
      if (apiSettings.selectedNode !== url) {
        setApiSettings({ ...apiSettings, selectedNode: url });
      }
    },
    [apiSettings, setApiSettings]
  );

  const onConnect = useCallback(async () => {
    if (connectInProgress.current) {
      console.error("MULTIPLE CONNECT IN PROGRESS");
      return;
    }
    connectInProgress.current = true;
    const _apiInstance = (Apis as ApisType).instance();
    if (_apiInstance) {
      let currentUrl = _apiInstance.ws_rpc?.ws.url as string;
      currentUrl =
        currentUrl[currentUrl.length - 1] !== "/"
          ? currentUrl
          : currentUrl.slice(0, currentUrl.length - 1);
      if (!isAutoSelection()) {
        setSelectedNode(currentUrl);
      }

      // the ping calculated here does not reflect the same ping as in checkConnection from ConnectionManager,
      // thus always updating would be "unfair" and also is confusing in UI
      const mapOfPings = {} as ApiLatencies;
      mapOfPings[currentUrl] =
        new Date().getTime() - (connectionStart.current as number);
      _updateLatencies(mapOfPings, false);
    }

    const currentChain = _apiInstance?.chain_id;
    const chainChanged = oldChain.current !== currentChain;
    oldChain.current = currentChain;

    const chainStoreResetPromise: Promise<void> = chainChanged
      ? ChainStore.resetCache(false)
      : Promise.resolve();
    try {
      await chainStoreResetPromise;
      connectInProgress.current = false;
      setConnectedNode(connectionManager.current.url);
      apiInstance.current = _apiInstance as ApisInstanceType;
      if (chainChanged) {
        ChainConfig.setPrefix(defaultToken);
      }
      transitionDone();
    } catch (e) {
      console.log(e);
      connectInProgress.current = false;
      transitionDone();
      throw new Error();
    }
  }, [
    connectInProgress,
    connectInProgress.current,
    isAutoSelection,
    setSelectedNode,
    _updateLatencies,
    setConnectedNode,
    connectionManager,
    connectionManager.current,
    transitionDone,
    oldChain,
    oldChain.current,
  ]);

  const onResetError = async (failingNodeUrl: string, err: any) => {
    console.error("onResetError:", err, failingNodeUrl);
    oldChain.current = "old";
    console.log(
      counterpart.translate("settings.connection_error", {
        url: failingNodeUrl || "",
        error: err,
      })
    );
    const _apiLatencies = apiLatencies;
    delete _apiLatencies[failingNodeUrl];
    setApiLatencies(apiLatencies);

    await Apis.instance().close();
    transitionDone();
    await willTransitionTo(true);
  };

  const attemptReconnect = useCallback(async () => {
    oldChain.current = "old";
    const apiInstance = (Apis as ApisType).reset(
      connectionManager.current.url,
      true,
      undefined
    );
    try {
      await apiInstance.init_promise;
      await onConnect();
    } catch (e: any) {
      await onResetError(connectionManager.current.url, e);
    }
  }, [connectionManager, connectionManager.current, onConnect, onResetError]);

  const initiateConnection = useCallback(
    async (appInit: boolean) => {
      setWillTransitionToInProgress(connectionManager.current.url);
      connectionStart.current = new Date().getTime();

      console.log("Connecting to " + connectionManager.current.url);

      if (appInit) {
        // only true if app is initialized
        updateTransitionTarget(
          counterpart.translate("app_init.connecting", {
            server: connectionManager.current.url,
          })
        );
        try {
          await connectionManager.current.connectWithFallback(true);
          if (!isAutoSelection()) {
            setSelectedNode(connectionManager.current.url);
          }
          await onConnect();
        } catch (error: any) {
          console.error(
            "----- App.willTransitionTo error ----->",
            error,
            new Error().stack
          );
          if (error.name === "InvalidStateError") {
            alert(
              "Can't access local storage.\nPlease make sure your browser is not in private/incognito mode."
            );
          } else {
            transitionDone();
          }
          throw new Error();
        }
      } else {
        // in case switches manually, reset the settings so we don't connect to
        // a faulty node twice. If connection is established, onConnect sets the settings again
        if (!isAutoSelection()) {
          setSelectedNode("");
        }

        await attemptReconnect();
      }
    },
    [
      connectionManager,
      connectionManager.current,
      updateTransitionTarget,
      isAutoSelection,
      setSelectedNode,
      onConnect,
      transitionDone,
      attemptReconnect,
      setWillTransitionToInProgress,
    ]
  );

  /**
   * Is called once when router is initialized, and then if a connection error occurs or user manually
   * switches nodes
   *
   * @param appInit true when called via router, false false when node is manually selected in access settings
   * @param statusCallback null function  can be given by the requesting component to notify the user of status changes
   * @returns {Promise}
   */
  const willTransitionTo = useCallback(
    async (appInit = true, _statusCallback?: NodeTransitionCallbackType) => {
      if (isTransitionInProgress()) {
        return;
      }
      statusCallback.current = _statusCallback;
      setWillTransitionToInProgress(true);

      const _apiLatencies = apiLatencies;
      let latenciesEstablished = Object.keys(_apiLatencies).length > 0;

      const _latencyChecks = latencyChecks;
      if (_latencyChecks >= REFRESHING_CONNECTION_ATTEMPTS_LIMIT) {
        // every x connect attempts we refresh the api latency list
        // automatically
        setLatencyChecks(0);
        latenciesEstablished = false;
      } else {
        // otherwise increase the counter
        if (appInit) {
          setLatencyChecks(_latencyChecks + 1);
        }
      }

      const urls = getNodesToConnectTo(_apiLatencies, false) as string[];
      const selectedNode = getSelectedNode();

      // set auto selection flag
      _isAutoSelection.current =
        selectedNode.indexOf("fake.automatic-selection") !== -1;

      initConnectionManager(urls);

      if (!latenciesEstablished || Object.keys(_apiLatencies).length == 0) {
        console.log("do latency update");
        try {
          await doLatencyUpdate();
        } catch (e) {
          console.log("catch doLatency", e);
          transitionDone();
          throw new Error();
        }

        await initiateConnection(appInit);
      } else {
        await initiateConnection(appInit);
      }
    },
    [
      isTransitionInProgress,
      apiLatencies,
      latencyChecks,
      setLatencyChecks,
      getNodesToConnectTo,
      getSelectedNode,
      initConnectionManager,
      doLatencyUpdate,
      initiateConnection,
      transitionDone,
      setWillTransitionToInProgress,
    ]
  );

  const getApi = useCallback(
    (type: AvailableGrapheneApis) => {
      return (request: string, data: any = []) => {
        if (
          apiInstance.current &&
          Object.keys(apiInstance.current).length > 0
        ) {
          let selectedApi: GrapheneApiType;
          switch (type) {
            case "_db":
              // code block
              selectedApi = apiInstance.current._db;
              break;
            case "_hist":
              // code block
              selectedApi = apiInstance.current._hist;
              break;
            case "_net":
              selectedApi = apiInstance.current._net;
              break;
            case "_crypto":
              selectedApi = apiInstance.current._crypto;
              break;
            case "_bookie":
              selectedApi = apiInstance.current._bookie;
              break;
            case "_sidechain":
              selectedApi = apiInstance.current._sidechain;
              break;
            case "_asset":
              selectedApi = apiInstance.current._asset;
              break;
            default:
              selectedApi = apiInstance.current._db;
            // code block
          }
          return selectedApi.exec(request, data);
        }
      };
    },
    [apiInstance, apiInstance.current]
  );

  const dbApi = useCallback(getApi("_db"), [getApi]);
  const historyApi = useCallback(getApi("_hist"), [getApi]);
  const sidechainApi = useCallback(getApi("_sidechain"), [getApi]);
  const assetApi = useCallback(getApi("_asset"), [getApi]);

  useEffect(() => {
    if ((window as any).whalevault) {
      WhaleVaultConfig.setWhaleVault((window as any).whalevault);
      setWhaleVaultInstance((window as any).whalevault as WhaleVaultType);
    }
  }, []);

  const context = useMemo(() => {
    return {
      apiInstance: apiInstance.current,
      getNodes,
      willTransitionTo,
      dbApi,
      historyApi,
      sidechainApi,
      assetApi,
      isTransitionInProgress,
      getTransitionTarget,
      isAutoSelection,
      isBackgroundPingingInProgress,
      whaleVaultInstance,
    };
  }, [
    apiInstance,
    apiInstance.current,
    getNodes,
    willTransitionTo,
    dbApi,
    historyApi,
    sidechainApi,
    assetApi,
    isTransitionInProgress,
    getTransitionTarget,
    isAutoSelection,
    isBackgroundPingingInProgress,
    whaleVaultInstance,
  ]);

  return (
    <PeerPlaysApiContext.Provider value={context}>
      {children}
    </PeerPlaysApiContext.Provider>
  );
};

export const usePeerplaysApiContext = (): PeerPlaysApiContextType => {
  return useContext<PeerPlaysApiContextType>(PeerPlaysApiContext);
};
