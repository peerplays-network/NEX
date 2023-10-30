export type UseBlockDetailsResult = {
  blockDetails: BlockDetailsType;
  loading: boolean;
  hasNextBlock: boolean;
  hasPreviousBlock: boolean;
  loadingSideBlocks: boolean;
};

export type TransactionRow = {
  key: number;
  rank: number;
  id: string;
  expiration: string;
  operations: unknown[][];
  operationResults: unknown[];
  refBlockPrefix: number;
  refBlockNum: number;
  extensions: unknown[];
  signatures: string[];
};

export type BlockDetailsType = {
  key: number;
  nextSecret?: string;
  previousSecret?: string;
  merkleRoot?: string;
  blockID: number;
  time: string;
  witness: string;
  witness_account_name?: string;
  signingKey?: string;
  witnessSignature?: string;
  transactions?: TransactionRow[];
};
