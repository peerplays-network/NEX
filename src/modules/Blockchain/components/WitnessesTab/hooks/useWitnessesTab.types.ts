import { Dispatch, SetStateAction } from "react";

export type UseWitnessesTabResult = {
  loading: boolean;
  witnessTableRows: WitnessTableRow[] | undefined;
  witnessStats: WitnessStats;
  activeWitnesses: number;
  reward: number;
  earnings: number;
  budget: number;
  nextVote: string;
  currentWitness: string;
  searchDataSource: WitnessTableRow[];
  setSearchDataSource: Dispatch<SetStateAction<WitnessTableRow[]>>;
};

export type WitnessStats = {
  active: number[];
  reward: number[];
  earnings: number[];
  budget: number[];
  nextVote: number[];
};

export type WitnessTableRow = {
  key: number;
  rank: number;
  name: string;
  active: boolean;
  url: string;
  lastBlock: number;
  missedBlocks: number;
  nextVote: string;
  totalVotes: string;
  publicKey: string;
};
