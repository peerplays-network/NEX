import { Dispatch, SetStateAction } from "react";

export type UseBlockchainTabResult = {
  loading: boolean;
  blockColumns: BlockColumnType[];
  blockchainTableRows?: DataTableRow[];
  blockchainStats: BlockchainStats;
  currentBlockHeight: number;
  lastIrreversibleBlock: string;
  avgTime: number;
  supply: BlockchainSupply;
  searchDataSource: DataTableRow[];
  setSearchDataSource: Dispatch<SetStateAction<DataTableRow[]>>;
};

export type BlockchainSupply = {
  amount: number;
  symbol: string;
};

export type BlockchainStats = {
  currentBlockHeight: number[];
  lastIrreversible: number[];
  avgTime: number[];
  supply: number[];
};

export type DataTableRow = {
  key: number;
  blockID: number;
  time: string;
  witness: string;
  transaction?: number;
};

export type BlockColumnType = {
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
  onFilter: ((value: string, record: DataTableRow) => boolean) | undefined;
  sorter:
    | ((
        a: {
          blockID: number;
        },
        b: {
          blockID: number;
        }
      ) => number)
    | ((
        a: {
          time: string;
        },
        b: {
          time: string;
        }
      ) => number)
    | ((
        a: {
          transaction: number;
        },
        b: {
          transaction: number;
        }
      ) => number)
    | undefined;
};
