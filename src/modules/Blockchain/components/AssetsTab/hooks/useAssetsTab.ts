//done
import { uniq } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { utils } from "../../../../../api/utils";
import {
  useAccount,
  useArrayLimiter,
  useAsset,
} from "../../../../../common/hooks";
import { AssetsColumns } from "../components";

import {
  AssetColumnType,
  AssetTableRow,
  UseAssetsTabResult,
} from "./useAssetsTab.types";

export function useAssetsTab(): UseAssetsTabResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchDataSource, setSearchDataSource] = useState<AssetTableRow[]>([]);
  const [assetTableRows, setAssetTableRows] = useState<AssetTableRow[]>();
  const [assetsStats, setAssetsStats] = useState<number[]>([]);
  const [assetsColumns, setAssetsColumns] = useState<AssetColumnType[]>([]);

  const { updateArrayWithLimit } = useArrayLimiter();
  const { getAllAssets } = useAsset();
  const { getAccounts } = useAccount();

  const formAssetsColumns = useCallback(
    (assetsRows: AssetTableRow[]) => {
      const symbols = assetsRows.map((asset) => asset.symbol);
      const allIssuers = assetsRows.map((row) => row.issuer);
      const uniqIssuers = uniq(allIssuers);
      const allNames = assetsRows.map((row) => row.name);
      const uniqNames = uniq(allNames);
      const updatedColumns: AssetColumnType[] = AssetsColumns.map((column) => {
        switch (true) {
          case column.key === "symbol":
            column.filters = symbols.map((symbol) => {
              return { text: symbol, value: symbol };
            });
            break;
          case column.key === "name":
            column.filters = uniqNames.map((name) => {
              return { text: name, value: name };
            });
            break;
          case column.key === "issuer":
            column.filters = uniqIssuers.map((issuer) => {
              return { text: issuer, value: issuer };
            });
            break;
        }
        return { ...column };
      });
      return updatedColumns;
    },
    [AssetsColumns]
  );

  const getAssetsRows = useCallback(async () => {
    try {
      const rawAssets = await getAllAssets();
      if (rawAssets && rawAssets.length > 0) {
        const rawAssetsIssuersIds = rawAssets.map((asset) => asset.issuer);
        const rawAssetsIssuersAccounnts = await getAccounts(
          rawAssetsIssuersIds
        );
        const assetsRows = rawAssets.map((asset) => {
          const issuer = rawAssetsIssuersAccounnts?.find(
            (account) => account?.id === asset.issuer
          );
          return {
            key: asset.id,
            id: asset.id,
            symbol: asset.symbol,
            name: utils.getNativeBlockchainFromAssetSymbol(asset.symbol),
            maxSupply: Number(asset.options.max_supply),
            precision: asset.precision,
            issuer: issuer ? issuer.name : "",
            info: asset.options.description,
          } as AssetTableRow;
        });
        return assetsRows;
      }
      return [];
    } catch (e) {
      console.log(e);
      return [];
    }
  }, [getAllAssets, getAccounts, utils]);

  useEffect(() => {
    let ignore = false;

    async function setAssetRows() {
      setLoading(true);
      const assetsRows = await getAssetsRows();
      if (!ignore) {
        const updatedColumns = formAssetsColumns(assetsRows);
        setAssetsColumns(updatedColumns);
        setAssetTableRows(assetsRows);
        setSearchDataSource(assetsRows);
        setAssetsStats(
          updateArrayWithLimit(assetsStats, assetsRows.length, 99)
        );

        setLoading(false);
      }
    }
    setAssetRows();
    const assetInterval = setInterval(() => setAssetRows(), 3000);

    return () => {
      ignore = true;
      clearInterval(assetInterval);
    };
  }, [
    getAssetsRows,
    formAssetsColumns,
    setAssetsColumns,
    setAssetTableRows,
    setSearchDataSource,
    setAssetsStats,
    setLoading,
  ]);

  return {
    loading,
    assetsColumns,
    assetTableRows,
    assetsStats,
    searchDataSource,
    setSearchDataSource,
  };
}
