export type UseBlockchainTab = {
  loading: boolean;
  blockchainData: BlockChainData;
  searchValue: string;
  onSearch: (value: string) => void;
};

export type BlockTableRow = {
  blockID: string;
  time: string;
  witness: string;
  transaction: number;
};

export type BlockChainData = {
  currentBlock: number;
  supply: {
    amount: number;
    symbol: string;
  };
  activeWitnesses: string[];
  avgTime: number;
  recentBlocks: BlockTableRow[];
};
