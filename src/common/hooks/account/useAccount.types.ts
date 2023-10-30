import {
  Account,
  FullAccount,
  KeyType,
  VestingBalance,
  WhaleVaultPubKeys,
} from "../../types";

export type UseAccountResult = {
  formAccountByName: (name: string, subscription: boolean) => Promise<void>;
  formAccountBalancesByName: (name: string) => Promise<void>;
  getFullAccount: (
    name: string,
    subscription: boolean
  ) => Promise<FullAccount | undefined>;
  getAccountByName: (name: string) => Promise<Account | undefined>;
  getPrivateKey: (password: string, role: string) => any;
  formAccountAfterConfirmation: (
    fullAccount: FullAccount,
    password: string,
    keyType: KeyType
  ) => Promise<void>;
  removeAccount: () => void;
  validateAccountPassword: (
    password: string,
    account: Account
  ) => {
    checkPassword: boolean;
    keyType: KeyType;
  };
  getUserNameById: (id: string) => Promise<string>;
  validateWhaleVaultPubKeys: (
    pubkeys: WhaleVaultPubKeys,
    account: Account
  ) => boolean;
  _validateUseWhaleVault: (
    account: Account,
    keyType?: KeyType | undefined
  ) => Promise<{
    response: string;
    isValid: boolean;
  }>;
  getAccounts: (
    idsOrNames: string[]
  ) => Promise<(Account | undefined)[] | undefined>;
  getUserNamesByIds: (ids: string[]) => Promise<string[]>;
  getVestingBalances: (
    accountNameOrId: string
  ) => Promise<VestingBalance[] | undefined>;
};
