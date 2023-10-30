import { Dispatch, SetStateAction } from "react";

export type UseSonsTabResult = {
  loading: boolean;
  sonsTableRows: SonsTableRow[] | undefined;
  searchDataSource: SonsTableRow[];
  sonsStats: SonsStats;
  activeBitcoinSons: number;
  activeHiveSons: number;
  activeEthereumSons: number;
  budget: number;
  nextVote: string;
  setSearchDataSource: Dispatch<SetStateAction<SonsTableRow[]>>;
};

export type SonsStats = {
  activeBitcoin: number[];
  activeHive: number[];
  activeEthereum: number[];
  budget: number[];
  nextVote: number[];
};

export type SonsTableRow = {
  key: number;
  rank: number;
  name: string;
  accountId: string;
  url: string;
  activeChains: string[];
  //expandable
  bitcoinActive: boolean;
  ethereumActive: boolean;
  hiveActive: boolean;
  bitcoinTotalVotes?: string;
  ethereumTotalVotes?: string;
  hiveTotalVotes?: string;
};
