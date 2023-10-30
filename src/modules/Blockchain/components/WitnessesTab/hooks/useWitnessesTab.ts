import { useCallback, useEffect, useState } from "react";

import {
  useAccount,
  useArrayLimiter,
  useAsset,
  useBlockchain,
  useFormDate,
  useMembers,
} from "../../../../../common/hooks";
import { useAssetsContext } from "../../../../../common/providers";

import {
  UseWitnessesTabResult,
  WitnessStats,
  WitnessTableRow,
} from "./useWitnessesTab.types";

export function useWitnessesTab(): UseWitnessesTabResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchDataSource, setSearchDataSource] = useState<WitnessTableRow[]>(
    []
  );
  const [witnessTableRows, setWitnessTableRows] = useState<WitnessTableRow[]>();
  const [witnessStats, setWitnessStats] = useState<WitnessStats>({
    active: [],
    reward: [],
    earnings: [],
    budget: [],
    nextVote: [],
  });
  const [activeWitnesses, setActiveWitnesses] = useState<number>(0);
  const [currentWitness, setCurrentWitness] = useState<string>("");
  const [reward, setReward] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);
  const [nextVote, setNextVote] = useState<string>("");
  const [budget, setBudget] = useState<number>(0);

  const { getUserNameById } = useAccount();
  const { getWitnesses } = useMembers();
  const { updateArrayWithLimit } = useArrayLimiter();
  const { formAssetBalance, setPrecision } = useAsset();
  const { defaultAsset } = useAssetsContext();
  const { getAvgBlockTime, getDynamicGlobalProperties, getGlobalProperties } =
    useBlockchain();
  const { formLocalDate } = useFormDate();

  const getDaysInThisMonth = useCallback(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, []);

  const getWitnessData = useCallback(async () => {
    if (defaultAsset) {
      try {
        const [gpo, dgpo] = await Promise.all([
          getGlobalProperties(),
          getDynamicGlobalProperties(),
        ]);
        if (gpo && dgpo) {
          const rewardAmount = setPrecision(
            false,
            gpo.parameters.witness_pay_per_block,
            defaultAsset.precision
          );
          const budgetAmount = setPrecision(
            false,
            dgpo.witness_budget,
            defaultAsset.precision
          );
          const { witnesses, witnessesIds } = await getWitnesses();
          const now = new Date().getTime();
          const nextVoteTime = new Date(dgpo.next_maintenance_time).getTime();
          const nextVoteDistance = now - nextVoteTime;
          const currentWitness = await getUserNameById(dgpo.current_witness);
          if (witnesses && witnesses.length > 0) {
            witnesses.sort((a, b) => b.total_votes - a.total_votes);
            const witnessesRows: WitnessTableRow[] = [];
            let index = 0;
            for (const witness of witnesses) {
              const votesAsset = formAssetBalance(
                defaultAsset,
                Number(witness.total_votes)
              );
              witnessesRows.push({
                key: index,
                rank: index + 1,
                name: witnessesIds.filter(
                  (witnessId) => witnessId[1] === witness.id
                )[0][0],
                active:
                  gpo["active_witnesses"].indexOf(witness.id) >= 0
                    ? true
                    : false,
                url: witness.url,
                lastBlock: witness.last_confirmed_block_num,
                missedBlocks: witness.total_missed,
                totalVotes: `${votesAsset?.amount} ${votesAsset?.symbol}`,
                publicKey: witness.signing_key,
              } as WitnessTableRow);
              index = index + 1;
            }
            const activeWitnesses = witnessesRows.filter(
              (witness) => witness.active === true
            );
            const avgTime = getAvgBlockTime();
            const blocksPerMonth = avgTime
              ? (60 / avgTime) * 60 * 24 * getDaysInThisMonth()
              : 0;
            const earnings = (
              (blocksPerMonth / witnessesRows.length) *
              rewardAmount
            ).toFixed(defaultAsset.precision);
            return {
              witnessesRows,
              activeWitnesses: activeWitnesses.length,
              reward: rewardAmount,
              earnings: Number(earnings),
              budget: budgetAmount,
              nextVote: formLocalDate(dgpo.next_maintenance_time, [
                "month",
                "date",
                "time",
              ]),
              currentWitness,
              witnessStats: {
                active: updateArrayWithLimit(
                  witnessStats.active,
                  activeWitnesses.length,
                  99
                ),
                reward: updateArrayWithLimit(
                  witnessStats.reward,
                  rewardAmount,
                  99
                ),
                earnings: updateArrayWithLimit(
                  witnessStats.earnings,
                  Number(earnings),
                  99
                ),
                budget: updateArrayWithLimit(
                  witnessStats.budget,
                  budgetAmount,
                  99
                ),
                nextVote: updateArrayWithLimit(
                  witnessStats.nextVote,
                  nextVoteDistance,
                  99
                ),
              },
            };
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [
    defaultAsset,
    getGlobalProperties,
    getDynamicGlobalProperties,
    setPrecision,
    getWitnesses,
    getUserNameById,
    formAssetBalance,
    getAvgBlockTime,
    getDaysInThisMonth,
  ]);

  useEffect(() => {
    let ignore = false;
    async function setWinessDate() {
      setLoading(true);
      const witnessData = await getWitnessData();
      if (!ignore && witnessData) {
        setWitnessTableRows(witnessData.witnessesRows);
        setSearchDataSource(witnessData.witnessesRows);
        setActiveWitnesses(witnessData.activeWitnesses);
        setReward(witnessData.reward);
        setEarnings(witnessData.earnings);
        setBudget(witnessData.budget);
        setNextVote(witnessData.nextVote);
        setCurrentWitness(witnessData.currentWitness);
        setWitnessStats(witnessData.witnessStats);
        setLoading(false);
      }
    }
    setWinessDate();
    const witnessInterval = setInterval(() => setWinessDate(), 3000);
    return () => {
      ignore = true;
      clearInterval(witnessInterval);
    };
  }, [
    setLoading,
    getWitnessData,
    setWitnessTableRows,
    setSearchDataSource,
    setActiveWitnesses,
    setReward,
    setEarnings,
    setBudget,
    setNextVote,
    setCurrentWitness,
    setWitnessStats,
  ]);

  return {
    loading,
    witnessTableRows,
    witnessStats,
    activeWitnesses,
    reward,
    earnings,
    budget,
    nextVote,
    currentWitness,
    searchDataSource,
    setSearchDataSource,
  };
}
