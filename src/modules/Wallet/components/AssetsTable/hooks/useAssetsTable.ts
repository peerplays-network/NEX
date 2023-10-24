import { sum, uniq } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

import { utils } from "../../../../../api/utils";
import { useAccount, useAsset } from "../../../../../common/hooks";
import { useUserContext } from "../../../../../common/providers";
import { AccountBalance, FullAccount } from "../../../../../common/types";
import { AssetColumnType, createAssetsColumns } from "../../AssetsColumns";

import { AssetTableRow, UseAssetsTabResult } from "./useAssetsTable.types";

type Args = {
  actionType?: "send_receive" | "receive_select" | "send_select";
  filterAsset?: string;
  userName?: string;
  showActions?: boolean;
};

export function useAssetsTable({
  filterAsset,
  actionType,
  userName,
  showActions = true,
}: Args): UseAssetsTabResult {
  const [searchDataSource, setSearchDataSource] = useState<AssetTableRow[]>([]);
  const [fullAccount, _setFullAccount] = useState<FullAccount | undefined>();

  const [loading, setLoading] = useState<boolean>(true);
  const { localStorageAccount } = useUserContext();
  const { getFullAccount } = useAccount();
  const { getAssetById, setPrecision, limitByPrecision } = useAsset();

  const formAssetRow = useCallback(
    async (balance: AccountBalance): Promise<AssetTableRow> => {
      const asset = await getAssetById(balance.asset_type);
      const available = setPrecision(false, balance.balance, asset?.precision);
      let inOrders = 0;
      if (fullAccount) {
        const limitOrders = fullAccount.limit_orders;
        const limitOrdersForTheAsset = limitOrders.filter((limitOrder) => {
          const orderAssetsIds = [limitOrder.sell_price.base.asset_id];
          return orderAssetsIds.includes(asset?.id as string);
        });
        const limitOrdersAmountsForTheAsset = limitOrdersForTheAsset.map(
          (order) => setPrecision(false, order.for_sale, asset?.precision)
        );
        inOrders = sum(limitOrdersAmountsForTheAsset);
      }
      return {
        key: asset?.id as string,
        symbol: asset?.symbol as string,
        name: utils.getNativeBlockchainFromAssetSymbol(asset?.symbol as string),
        available: available,
        inOrders: limitByPrecision(inOrders, asset?.precision),
      };
    },
    [fullAccount, setPrecision]
  );

  const assetsTableRows = useMemo(async () => {
    if (fullAccount) {
      const assetsRows = await Promise.all(
        fullAccount.balances
          .filter(async (balance: AccountBalance) => {
            const asset = await getAssetById(balance.asset_type);
            return asset?.symbol !== filterAsset;
          })
          .map(async (balance: AccountBalance) => {
            return await formAssetRow(balance);
          })
      );
      setSearchDataSource(assetsRows);
      return assetsRows;
    } else {
      return [];
    }
  }, [fullAccount, filterAsset, formAssetRow]);

  const assetsColumns = useMemo(() => {
    const symbols = searchDataSource.map((assetRow) => assetRow.symbol);
    const allNames = searchDataSource.map((assetRow) => assetRow.name);
    const uniqNames = uniq(allNames);
    const updatedColumns: AssetColumnType[] = createAssetsColumns(
      actionType,
      showActions
    ).map((column) => {
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
      }
      return { ...column };
    });
    return updatedColumns;
  }, [assetsTableRows, createAssetsColumns, actionType]);

  useEffect(() => {
    let ignore = false;
    let fullAccount: FullAccount | undefined;
    async function setFullAccount() {
      setLoading(true);
      if (userName === undefined) {
        fullAccount = await getFullAccount(localStorageAccount, false);
      } else {
        fullAccount = await getFullAccount(userName, false);
      }
      if (!ignore) {
        _setFullAccount(fullAccount);
        setLoading(false);
      }
    }
    setFullAccount();
    return () => {
      ignore = true;
    };
  }, [
    setLoading,
    getFullAccount,
    localStorageAccount,
    userName,
    _setFullAccount,
  ]);

  return {
    loading,
    assetsColumns,
    searchDataSource,
    setSearchDataSource,
  };
}
