// import { uniq } from "lodash";
import { uniq } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { useAsset } from "../../../../../common/hooks";
import { AccountColumns } from "../components";

import {
  AccountColumnType,
  AccountsTableRow,
  UseAccountsTabResult,
} from "./useAccountsTab.types";

export function useAccountsTab(): UseAccountsTabResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchDataSource, setSearchDataSource] = useState<AccountsTableRow[]>(
    []
  );
  const [accountsTableRows, setAccountsTableRows] =
    useState<AccountsTableRow[]>();
  const [accountsColumns, setAccountsColumns] = useState<AccountColumnType[]>(
    []
  );

  const { getAssetHolders } = useAsset();

  const formAccountsColumns = useCallback(
    (accountsRows: AccountsTableRow[]) => {
      const accountIds = accountsRows.map((account) => account.AccountID);
      const allNames = accountsRows.map((row) => row.AccountName);
      const accountBalances = accountsRows.map((row) => row.Balance);
      const uniqNames = uniq(allNames);
      const updatedColumns: AccountColumnType[] = AccountColumns.map(
        (column) => {
          switch (true) {
            case column.key === "AccountId":
              column.filters = accountIds.map((accountId) => {
                return { text: accountId, value: accountId };
              });
              break;
            case column.key === "AccountName":
              column.filters = uniqNames.map((name) => {
                return { text: name, value: name };
              });
              break;
            case column.key === "Balance":
              column.filters = accountBalances.map((balance) => {
                return { text: balance.toString(), value: balance.toString() };
              });
              break;
          }
          return { ...column };
        }
      );
      return updatedColumns;
    },
    [AccountColumns]
  );

  const getAccountRows = useCallback(async () => {
    try {
      const rawAssetHolders = await getAssetHolders();
      if (!rawAssetHolders || rawAssetHolders.length === 0) return [];
      const accountsRows = rawAssetHolders.map((assetHolder) => {
        return {
          key: assetHolder.account_id,
          AccountID: assetHolder.account_id,
          AccountName: assetHolder.name,
          Balance: Number(assetHolder.amount),
        } as AccountsTableRow;
      });
      return accountsRows;
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [getAssetHolders]);

  useEffect(() => {
    let ignore = false;
    async function setAccountRows() {
      setLoading(true);
      const accountRows = await getAccountRows();
      if (!ignore) {
        setAccountsTableRows(accountRows);
        const updatedColumns = formAccountsColumns(accountRows);
        setAccountsColumns(updatedColumns);
        setSearchDataSource(accountRows);
        setLoading(false);
      }
    }
    setAccountRows();
    return () => {
      ignore = true;
    };
  }, [
    getAccountRows,
    formAccountsColumns,
    setAccountsColumns,
    setAccountsTableRows,
    setSearchDataSource,
    setLoading,
  ]);

  return {
    loading,
    accountsColumns,
    searchDataSource,
    setSearchDataSource,
    accountsTableRows,
  };
}
