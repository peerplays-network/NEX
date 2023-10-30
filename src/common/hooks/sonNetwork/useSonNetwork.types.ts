import { Account, Sidechain } from "../../types";

export type UseSonNetworkResult = {
  sonAccount: Account | undefined;
  getSonNetworkStatus: () => Promise<
    [Sidechain, [string, string][]][] | undefined
  >;
  getSonNetworkStatusBySidechain: (
    chain: Sidechain
  ) => Promise<[string, string][] | undefined>;
  isSidechainSonNetworkOk: (chain: Sidechain) => Promise<boolean>;
};

export type SonNetworkStatus = {
  status: [string, string][];
  isSonNetworkOk: boolean;
};
