import { sum } from "lodash";
import { useCallback, useEffect, useState } from "react";

import {
  useArrayLimiter,
  useAsset,
  useBlockchain,
  useFormDate,
  useMembers,
  useSons,
} from "../../../../../common/hooks";
import { useAssetsContext } from "../../../../../common/providers";
import { Sidechain } from "../../../../../common/types";

import { SonsStats, SonsTableRow, UseSonsTabResult } from "./useSonsTab.types";

export function useSonsTab(): UseSonsTabResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchDataSource, setSearchDataSource] = useState<SonsTableRow[]>([]);
  const [sonsTableRows, setSonsTableRows] = useState<SonsTableRow[]>();
  const [sonsStats, setSonsStats] = useState<SonsStats>({
    activeBitcoin: [],
    activeHive: [],
    activeEthereum: [],
    budget: [],
    nextVote: [],
  });
  const [activeBitcoinSons, setActiveBitcoinSons] = useState<number>(0);
  const [activeHiveSons, setActiveHiveSons] = useState<number>(0);
  const [activeEthereumSons, setActiveEthereumSons] = useState<number>(0);
  const [budget, setBudget] = useState<number>(0);
  const [nextVote, setNextVote] = useState<string>("");

  const { getSons } = useMembers();
  const { updateArrayWithLimit } = useArrayLimiter();
  const { setPrecision } = useAsset();
  const { getSonAccountVotes } = useSons();
  const { defaultAsset } = useAssetsContext();
  const { getGlobalProperties, getDynamicGlobalProperties } = useBlockchain();
  const { formLocalDate } = useFormDate();

  const getSonsData = useCallback(async () => {
    if (defaultAsset) {
      const [gpo, dgpo] = await Promise.all([
        getGlobalProperties(),
        getDynamicGlobalProperties(),
      ]);
      if (gpo && dgpo) {
        const { sons, sonsIds } = await getSons();
        const budgetAmount = setPrecision(
          false,
          dgpo.son_budget,
          defaultAsset.precision
        );
        const now = new Date().getTime();
        const nextVoteTime = new Date(dgpo.next_maintenance_time).getTime();
        const nextVoteDistance = now - nextVoteTime;
        sons.sort(
          (a, b) =>
            sum(b.total_votes.map((vote) => vote[1])) -
            sum(a.total_votes.map((vote) => vote[1]))
        );
        const sonsRows: SonsTableRow[] = [];
        let index = 0;
        const sonsVotesAsset = sons.map((son) => {
          const { bitcoinVoteAsset, hiveVoteAsset, ethereumVoteAsset } =
            getSonAccountVotes(son, defaultAsset);
          return {
            bitcoinVoteAsset: bitcoinVoteAsset,
            hiveVoteAsset: hiveVoteAsset,
            ethereumVoteAsset: ethereumVoteAsset,
          };
        });

        for (const son of sons) {
          const activeChains = son.statuses
            .filter((status) => status[1] === "active")
            .map((status) => status[0]);

          sonsRows.push({
            key: index,
            rank: index + 1,
            name: sonsIds.filter((sonId) => sonId[1] === son.id)[0][0],
            accountId: son.son_account,
            url: son.url,
            activeChains: activeChains,
            bitcoinActive: activeChains.includes(Sidechain.BITCOIN),
            ethereumActive: activeChains.includes(Sidechain.ETHEREUM),
            hiveActive: activeChains.includes(Sidechain.HIVE),
            bitcoinTotalVotes: sonsVotesAsset[index].bitcoinVoteAsset
              ? `${sonsVotesAsset[index].bitcoinVoteAsset?.amount} ${sonsVotesAsset[index].bitcoinVoteAsset?.symbol}`
              : undefined,
            ethereumTotalVotes: sonsVotesAsset[index].ethereumVoteAsset
              ? `${sonsVotesAsset[index].ethereumVoteAsset?.amount} ${sonsVotesAsset[index].ethereumVoteAsset?.symbol}`
              : undefined,
            hiveTotalVotes: sonsVotesAsset[index].hiveVoteAsset
              ? `${sonsVotesAsset[index].hiveVoteAsset?.amount} ${sonsVotesAsset[index].hiveVoteAsset?.symbol}`
              : undefined,
          } as SonsTableRow);
          index = index + 1;
        }

        const activeBitcoinSons = sonsRows.filter(
          (son) => son.bitcoinActive === true
        );
        const activeHiveSons = sonsRows.filter(
          (son) => son.hiveActive === true
        );
        const activeEthereumSons = sonsRows.filter(
          (son) => son.ethereumActive === true
        );
        return {
          sonsRows,
          activeBitcoinSons: activeBitcoinSons.length,
          activeHiveSons: activeHiveSons.length,
          activeEthereumSons: activeEthereumSons.length,
          budget: budgetAmount,
          nextVote: formLocalDate(dgpo.next_maintenance_time, [
            "month",
            "date",
            "time",
          ]),
          sonsStats: {
            activeBitcoin: updateArrayWithLimit(
              sonsStats.activeBitcoin,
              activeBitcoinSons.length,
              99
            ),
            activeHive: updateArrayWithLimit(
              sonsStats.activeHive,
              activeHiveSons.length,
              99
            ),
            activeEthereum: updateArrayWithLimit(
              sonsStats.activeEthereum,
              activeEthereumSons.length,
              99
            ),
            budget: updateArrayWithLimit(sonsStats.budget, budgetAmount, 99),
            nextVote: updateArrayWithLimit(
              sonsStats.nextVote,
              nextVoteDistance,
              99
            ),
          },
        };
      }
    }
  }, [
    defaultAsset,
    getGlobalProperties,
    getDynamicGlobalProperties,
    getSons,
    setPrecision,
    getSonAccountVotes,
  ]);

  useEffect(() => {
    let ignore = false;
    async function setSonsData() {
      setLoading(true);
      const sonsData = await getSonsData();
      if (!ignore && sonsData) {
        setSonsTableRows(sonsData.sonsRows);
        setSearchDataSource(sonsData.sonsRows);
        setActiveBitcoinSons(sonsData.activeBitcoinSons);
        setActiveEthereumSons(sonsData.activeEthereumSons);
        setActiveHiveSons(sonsData.activeHiveSons);
        setBudget(sonsData.budget);
        setNextVote(sonsData.nextVote);
        setSonsStats(sonsData.sonsStats);
        setLoading(false);
      }
    }
    setSonsData();
    const sonsInterval = setInterval(() => setSonsData(), 3000);
    return () => {
      ignore = true;
      clearInterval(sonsInterval);
    };
  }, [
    setLoading,
    getSonsData,
    setSonsTableRows,
    setSearchDataSource,
    setActiveBitcoinSons,
    setActiveEthereumSons,
    setActiveHiveSons,
    setBudget,
    setNextVote,
    setSonsStats,
  ]);

  return {
    loading,
    sonsTableRows,
    searchDataSource,
    sonsStats,
    activeBitcoinSons,
    activeEthereumSons,
    activeHiveSons,
    budget,
    nextVote,
    setSearchDataSource,
  };
}
