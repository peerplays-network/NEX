import {
  Account,
  Asset,
  BitcoinSidechainAccounts,
  EthereumSidechainAccounts,
  KeyType,
  SidechainAccount,
} from "../../types";

export type UserContextType = {
  localStorageAccount: string;
  setLocalStorageAccount: (value: string) => void;

  id: string;
  name: string;
  assets: Asset[];
  password: string;
  keyType: KeyType;
  account: Account | undefined;

  updateAccount: (
    id: string,
    name: string,
    assets: Asset[],
    account: Account | undefined
  ) => void;
  setAssets: (assets: Asset[]) => void;
  savePassword: (password: string, keyType: KeyType) => void;
  removePassword: () => void;

  getSidechainAccounts: (accountId: string) => Promise<void>;
  sidechainAccounts: {
    [sidechain: string]:
      | {
          account: SidechainAccount;
          hasDepositAddress: boolean;
        }
      | undefined;
  };
  loadingSidechainAccounts: boolean;

  sessionBitcoinSidechainAccounts: BitcoinSidechainAccounts;
  setSessionBitcoinSidechainAccounts: (value: BitcoinSidechainAccounts) => void;
  sessionEthereumSidechainAccounts: EthereumSidechainAccounts;
  setSessionEthereumSidechainAccounts: (
    value: EthereumSidechainAccounts
  ) => void;
};
