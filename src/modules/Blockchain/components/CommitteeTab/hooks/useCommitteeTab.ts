import { useCallback, useEffect, useState } from "react";

import {
  useArrayLimiter,
  useAsset,
  useMembers,
} from "../../../../../common/hooks";
import { useAssetsContext } from "../../../../../common/providers";

import {
  CommitteeTableRow,
  UseCommitteeTabResult,
} from "./useCommitteeTab.types";

export function useCommitteeTab(): UseCommitteeTabResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchDataSource, setSearchDataSource] = useState<CommitteeTableRow[]>(
    []
  );
  const [activeCommittee, setActiveCommittee] = useState<number>(0);
  const [committeeStats, setCommitteeStats] = useState<number[]>([]);
  const [committeeTableRows, setCommitteeTableRows] =
    useState<CommitteeTableRow[]>();

  const { formAssetBalance } = useAsset();
  const { defaultAsset } = useAssetsContext();
  const { updateArrayWithLimit } = useArrayLimiter();
  const { getCommittees } = useMembers();

  const getCommitteesTableData = useCallback(async () => {
    if (defaultAsset) {
      try {
        const { committees, committeesIds } = await getCommittees();

        if (committees && committees.length > 0) {
          committees.sort((a, b) => b.total_votes - a.total_votes);

          const committeeRows = committees.map((committee, index) => {
            const votesAsset = formAssetBalance(
              defaultAsset,
              Number(committee.total_votes)
            );
            return {
              key: index,
              rank: index + 1,
              name: committeesIds.filter(
                (committeeId) => committeeId[1] === committee.id
              )[0][0],
              active: (votesAsset?.amount as number) > 0 ? true : false,
              url: committee.url,
              totalVotes: `${votesAsset?.amount} ${votesAsset?.symbol}`,
            } as CommitteeTableRow;
          });

          const activeCommitteeRows = committeeRows.filter(
            (committee) => committee.active
          );
          return {
            committeeRows,
            activeCommittee: activeCommitteeRows.length,
            committeeStats: updateArrayWithLimit(
              committeeStats,
              activeCommitteeRows.length,
              99
            ),
          };
        }
      } catch (e) {
        console.log(e);
      }
    }
  }, [defaultAsset, getCommittees, formAssetBalance, updateArrayWithLimit]);

  useEffect(() => {
    let ignore = false;

    async function setCommitteeRows() {
      setLoading(true);
      const committeesTableInfo = await getCommitteesTableData();
      if (!ignore && committeesTableInfo) {
        setCommitteeTableRows(committeesTableInfo.committeeRows);
        setSearchDataSource(committeesTableInfo.committeeRows);
        setActiveCommittee(committeesTableInfo.activeCommittee);
        setCommitteeStats(committeesTableInfo.committeeStats);
        setLoading(false);
      }
    }
    setCommitteeRows();
    const committeeInterval = setInterval(() => setCommitteeRows(), 3000);

    return () => {
      ignore = true;
      clearInterval(committeeInterval);
    };
  }, [
    setLoading,
    getCommitteesTableData,
    setCommitteeTableRows,
    setSearchDataSource,
    setActiveCommittee,
    setCommitteeStats,
  ]);

  return {
    loading,
    activeCommittee,
    committeeStats,
    committeeTableRows,
    searchDataSource,
    setSearchDataSource,
  };
}
