import { uniq } from "lodash";
import { useCallback, useEffect, useState } from "react";

import {
  useArrayLimiter,
  useAsset,
  useBlockchain,
  useFormDate,
} from "../../../../../common/hooks";
import { useAssetsContext } from "../../../../../common/providers";
import { BlockColumns } from "../components";

import {
  BlockchainStats,
  BlockchainSupply,
  BlockColumnType,
  DataTableRow,
  UseBlockchainTabResult,
} from "./useBlockchainTab.types";

export function useBlockchainTab(): UseBlockchainTabResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchDataSource, setSearchDataSource] = useState<DataTableRow[]>([]);
  const [blockchainTableRows, setDataTableRows] = useState<DataTableRow[]>();
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number>(0);
  const [lastIrreversibleBlock, setLastIrreversibleBlock] =
    useState<string>("");
  const [avgTime, setAvgTime] = useState<number>(0);
  const [supply, setSupply] = useState<BlockchainSupply>({
    amount: 0,
    symbol: "TEST",
  });
  const [blockchainStats, setBlockchainStats] = useState<BlockchainStats>({
    currentBlockHeight: [],
    lastIrreversible: [],
    avgTime: [],
    supply: [],
  });
  const [blockColumns, setBlockColumns] = useState<BlockColumnType[]>([]);
  const { defaultAsset } = useAssetsContext();
  const { updateArrayWithLimit } = useArrayLimiter();
  const {
    getDynamicGlobalProperties,
    getAssetDynamicData,
    getRecentBlocks,
    getAvgBlockTime,
  } = useBlockchain();
  const { setPrecision } = useAsset();
  const { formDate } = useFormDate();

  const formBlockchainColumns = useCallback(
    (blockRows: DataTableRow[]) => {
      const allWitnesses = blockRows.map((block) => block.witness);
      const witnesses = uniq(allWitnesses);
      const updateBlockColumns = BlockColumns.map((column) => {
        if (column.key === "witness") {
          column.filters = witnesses.map((witness) => {
            return { text: witness, value: witness };
          });
        }
        return { ...column } as BlockColumnType;
      });
      return updateBlockColumns;
    },
    [BlockColumns]
  );

  const getBlockchainData = useCallback(async () => {
    try {
      const recentBlocks = getRecentBlocks();
      const [dgpo, assetDynamicData] = await Promise.all([
        getDynamicGlobalProperties(),
        getAssetDynamicData(),
      ]);
      if (defaultAsset && dgpo && assetDynamicData) {
        const chainAvgTime = getAvgBlockTime();
        const blockRows: DataTableRow[] = recentBlocks.map((block) => {
          return {
            key: block.id as number,
            blockID: block.id as number,
            time: formDate(block.timestamp, ["month", "date", "year", "time"]),
            witness: block.witness_account_name,
            transaction: block.transactions.length,
          };
        });
        const distance_form_irreversible =
          dgpo.head_block_number - dgpo.last_irreversible_block_num;
        const supplyAmount = setPrecision(
          false,
          parseInt(assetDynamicData.current_supply),
          defaultAsset.precision
        );
        return {
          blockRows,
          currentBlockHeight: dgpo.head_block_number,
          lastIrreversibleBlock:
            dgpo.last_irreversible_block_num +
            " (-" +
            distance_form_irreversible +
            ")",
          avgTime: Number(chainAvgTime.toFixed(0)),
          supply: {
            amount: supplyAmount,
            symbol: defaultAsset.symbol,
          },
          blockchainStats: {
            currentBlockHeight: updateArrayWithLimit(
              blockchainStats.currentBlockHeight,
              dgpo.head_block_number,
              99
            ),
            lastIrreversible: updateArrayWithLimit(
              blockchainStats.lastIrreversible,
              distance_form_irreversible,
              99
            ),
            avgTime: updateArrayWithLimit(
              blockchainStats.avgTime,
              Number(chainAvgTime.toFixed(0)),
              99
            ),
            supply: updateArrayWithLimit(
              blockchainStats.supply,
              supplyAmount,
              99
            ),
          },
        };
      }
    } catch (e) {
      console.log(e);
    }
  }, [
    getRecentBlocks,
    getDynamicGlobalProperties,
    getAssetDynamicData,
    defaultAsset,
    getAvgBlockTime,
    setPrecision,
    updateArrayWithLimit,
  ]);

  useEffect(() => {
    let ignore = false;
    async function setBlockchainData() {
      setLoading(true);
      const blockData = await getBlockchainData();
      if (!ignore && blockData) {
        const updatedColumns = formBlockchainColumns(blockData.blockRows);
        setBlockColumns(updatedColumns);
        setDataTableRows(blockData.blockRows);
        setSearchDataSource(blockData.blockRows);
        setCurrentBlockHeight(blockData.currentBlockHeight);
        setLastIrreversibleBlock(blockData.lastIrreversibleBlock);
        setAvgTime(blockData.avgTime);
        setSupply(blockData.supply);
        setBlockchainStats(blockData.blockchainStats);
        setLoading(false);
      }
    }
    setBlockchainData();

    const blockchainInterval = setInterval(() => setBlockchainData(), 3000);
    return () => {
      ignore = true;
      clearInterval(blockchainInterval);
    };
  }, [
    getBlockchainData,
    formBlockchainColumns,
    setBlockColumns,
    setDataTableRows,
    setSearchDataSource,
    setCurrentBlockHeight,
    setLastIrreversibleBlock,
    setAvgTime,
    setSupply,
    setBlockchainStats,
    setLoading,
  ]);

  return {
    loading,
    blockColumns,
    blockchainTableRows,
    blockchainStats,
    currentBlockHeight,
    lastIrreversibleBlock,
    avgTime,
    supply,
    searchDataSource,
    setSearchDataSource,
  };
}
