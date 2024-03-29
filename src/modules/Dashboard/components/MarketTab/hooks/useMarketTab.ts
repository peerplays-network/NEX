import { useCallback, useEffect, useState } from "react";

import { useMarketPairStats } from "../../../../../common/hooks";
import { PairNameAndMarketStats } from "../../../../../common/types";

import { UseMarketTabResult } from "./useMarketTab.types";

export function useMarketTab(): UseMarketTabResult {
  const [pairs, setPairs] = useState<PairNameAndMarketStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    getDefaultPairs,
    formPairStats,
    loading: pairLoading,
  } = useMarketPairStats();

  const getMarketPairStatsForPairs = useCallback(async () => {
    if (!pairLoading) {
      try {
        setLoading(true);
        const pairs = getDefaultPairs();
        const updatedPairs = await Promise.all(pairs.map(formPairStats));
        setPairs(updatedPairs);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    }
  }, [setPairs, formPairStats, getDefaultPairs, setLoading, pairLoading]);

  useEffect(() => {
    getMarketPairStatsForPairs();
  }, [getMarketPairStatsForPairs]);

  return {
    pairs,
    loading,
  };
}
