import { useCallback } from "react";

import { Asset, GlobalProperties, Sidechain, SonAccount } from "../../types";
import { useAsset } from "../asset";

import { UseSonsResult } from "./useSons.types";

export function useSons(): UseSonsResult {
  const { formAssetBalance } = useAsset();

  const getSonAccountVotes = useCallback(
    (son: SonAccount, voteAsset: Asset) => {
      const bitcoinTotalVotes = son.total_votes.find(
        (total_vote) => total_vote[0] === Sidechain.BITCOIN
      );
      const hiveTotalVotes = son.total_votes.find(
        (total_vote) => total_vote[0] === Sidechain.HIVE
      );
      const ethereumTotalVotes = son.total_votes.find(
        (total_vote) => total_vote[0] === Sidechain.ETHEREUM
      );
      return {
        bitcoinTotalVotes: bitcoinTotalVotes ? bitcoinTotalVotes[1] : undefined,
        bitcoinVoteAsset: bitcoinTotalVotes
          ? formAssetBalance(voteAsset, bitcoinTotalVotes[1])
          : undefined,
        hiveTotalVotes: hiveTotalVotes ? hiveTotalVotes[1] : undefined,
        hiveVoteAsset: hiveTotalVotes
          ? formAssetBalance(voteAsset, hiveTotalVotes[1])
          : undefined,
        ethereumTotalVotes: ethereumTotalVotes
          ? ethereumTotalVotes[1]
          : undefined,
        ethereumVoteAsset: ethereumTotalVotes
          ? formAssetBalance(voteAsset, ethereumTotalVotes[1])
          : undefined,
      };
    },
    [formAssetBalance]
  );

  const getSonAccountVoteId = useCallback((son: SonAccount) => {
    const bitcoinVoteId = son.sidechain_vote_ids.find(
      (vote_id) => vote_id[0] === Sidechain.BITCOIN
    );
    const ethereumVoteId = son.sidechain_vote_ids.find(
      (vote_id) => vote_id[0] === Sidechain.ETHEREUM
    );
    const hiveVoteId = son.sidechain_vote_ids.find(
      (vote_id) => vote_id[0] === Sidechain.HIVE
    );
    return {
      bitcoinVoteId: bitcoinVoteId ? bitcoinVoteId[1] : undefined,
      ethereumVoteId: ethereumVoteId ? ethereumVoteId[1] : undefined,
      hiveVoteId: hiveVoteId ? hiveVoteId[1] : undefined,
    };
  }, []);

  const getSonAccountsVotesIds = useCallback(
    (sons: SonAccount[]) => {
      const bitcoinVotesIds: (string | undefined)[] = [];
      const ethereumVotesIds: (string | undefined)[] = [];
      const hiveVotesIds: (string | undefined)[] = [];
      sons.forEach((son) => {
        const { bitcoinVoteId, ethereumVoteId, hiveVoteId } =
          getSonAccountVoteId(son);
        bitcoinVotesIds.push(bitcoinVoteId);
        ethereumVotesIds.push(ethereumVoteId);
        hiveVotesIds.push(hiveVoteId);
      });
      return {
        bitcoinVotesIds,
        ethereumVotesIds,
        hiveVotesIds,
      };
    },
    [getSonAccountVoteId]
  );

  const getActiveSons = useCallback((globalProperties: GlobalProperties) => {
    const bitcoinActiveSons = globalProperties.active_sons.find(
      (sons) => sons[0] === Sidechain.BITCOIN
    );
    const bitcoinActiveSonsIds = bitcoinActiveSons
      ? bitcoinActiveSons[1].map((son) => son.son_id)
      : [];
    const ethereumActiveSons = globalProperties.active_sons.find(
      (sons) => sons[0] === Sidechain.ETHEREUM
    );
    const ethereumActiveSonsIds = ethereumActiveSons
      ? ethereumActiveSons[1].map((son) => son.son_id)
      : [];
    const hiveActiveSons = globalProperties.active_sons.find(
      (sons) => sons[0] === Sidechain.HIVE
    );
    const hiveActiveSonsIds = hiveActiveSons
      ? hiveActiveSons[1].map((son) => son.son_id)
      : [];
    return {
      bitcoinActiveSons: bitcoinActiveSons ? bitcoinActiveSons[1] : [],
      bitcoinActiveSonsIds: bitcoinActiveSonsIds,
      ethereumActiveSons: ethereumActiveSons ? ethereumActiveSons[1] : [],
      ethereumActiveSonsIds: ethereumActiveSonsIds,
      hiveActiveSons: hiveActiveSons ? hiveActiveSons[1] : [],
      hiveActiveSonsIds: hiveActiveSonsIds,
    };
  }, []);

  return {
    getSonAccountVotes,
    getSonAccountVoteId,
    getActiveSons,
    getSonAccountsVotesIds,
  };
}
