import { Dispatch, SetStateAction } from "react";

export type UseAccountsTabResult = {
  loading: boolean;
  accountsColumns: AccountColumnType[];
  accountsTableRows: AccountsTableRow[] | undefined;
  searchDataSource: AccountsTableRow[];
  setSearchDataSource: Dispatch<SetStateAction<AccountsTableRow[]>>;
};

export type AccountsTableRow = {
  key: string;
  AccountID: string;
  AccountName: string;
  Balance: number;
};

export type AccountColumnType = {
  title: () => JSX.Element;
  dataIndex: string;
  key: string;
  render: ((witness: string) => JSX.Element) | undefined;
  filters:
    | {
        text: string;
        value: string;
      }[]
    | undefined;
  filterMode: string | undefined;
  filterSearch: boolean | undefined;
  onFilter: ((value: string, record: AccountsTableRow) => boolean) | undefined;
  sorter:
    | ((
        a: {
          AccountId: string;
        },
        b: {
          AccountId: string;
        }
      ) => number)
    | ((
        a: {
          AccountName: string;
        },
        b: {
          AccountName: string;
        }
      ) => number)
    | ((
        a: {
          Balance: number;
        },
        b: {
          Balance: number;
        }
      ) => number)
    | undefined;
};
