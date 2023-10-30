//done
import { useCallback, useEffect, useState } from "react";

import { usePeerplaysApiContext } from "../../providers";
import { Account, Sidechain } from "../../types";
import { useAccount } from "../account";
import { useBlockchain } from "../blockchain";

import { UseSonNetworkResult } from "./useSonNetwork.types";

export function useSonNetwork(): UseSonNetworkResult {
  const [sonAccount, _setSonAccount] = useState<Account>();
  const { dbApi } = usePeerplaysApiContext();
  const { getGlobalProperties, getChainProperties } = useBlockchain();
  const { getAccounts } = useAccount();

  const getSonAccount = useCallback(async () => {
    const gpo = await getGlobalProperties();
    if (gpo) {
      const son_id = gpo.parameters.extensions.son_account;
      const accounts = await getAccounts([son_id]);
      const son_account = accounts ? accounts[0] : undefined;
      return son_account;
    }
  }, [getGlobalProperties, getAccounts]);

  const getSonNetworkStatus = useCallback(async () => {
    try {
      const sonNetworkStatus = await dbApi("get_son_network_status", []);
      return sonNetworkStatus as [Sidechain, [string, string][]][];
    } catch (e) {
      console.log(e);
    }
  }, [dbApi]);

  const getSonNetworkStatusBySidechain = useCallback(
    async (chain: Sidechain) => {
      try {
        const sonNetworkStatus = await dbApi(
          "get_son_network_status_by_sidechain",
          [chain]
        );
        return sonNetworkStatus as [string, string][];
      } catch (e) {
        console.log(e);
      }
    },
    [dbApi]
  );

  const isSidechainSonNetworkOk = useCallback(
    async (chain: Sidechain) => {
      const sonNetworkStatus = await getSonNetworkStatusBySidechain(chain);
      if (!sonNetworkStatus || sonNetworkStatus.length === 0) {
        return false;
      }
      let activeSons = 0;
      sonNetworkStatus.forEach((status) => {
        if (status[1] === "OK, regular SON heartbeat") activeSons++;
      });
      const chainProperties = await getChainProperties();
      if (!chainProperties) return false;
      return activeSons >= chainProperties.immutable_parameters.min_son_count;
    },
    [getSonNetworkStatusBySidechain, getChainProperties]
  );

  useEffect(() => {
    let ignore = false;

    async function setSonAccount() {
      const sonAccount = await getSonAccount();
      if (!ignore) {
        _setSonAccount(sonAccount);
      }
    }

    setSonAccount();

    return () => {
      ignore = true;
    };
  }, [getSonAccount, _setSonAccount]);

  return {
    sonAccount,
    getSonNetworkStatus,
    getSonNetworkStatusBySidechain,
    isSidechainSonNetworkOk,
  };
}
