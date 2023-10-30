import { Amount, Sidechain } from "../../types";

export type UseSidechainApiResult = {
  estimateWithdrawalFeeBySidechain: (
    sidechain: Sidechain
  ) => Promise<Amount | undefined>;
};
