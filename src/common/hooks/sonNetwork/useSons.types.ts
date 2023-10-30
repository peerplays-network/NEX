import { ActiveSon, Asset, GlobalProperties, SonAccount } from "../../types";

export type UseSonsResult = {
  getSonAccountVotes: (
    son: SonAccount,
    voteAsset: Asset
  ) => {
    bitcoinTotalVotes: number | undefined;
    bitcoinVoteAsset: Asset | undefined;
    hiveTotalVotes: number | undefined;
    hiveVoteAsset: Asset | undefined;
    ethereumTotalVotes: number | undefined;
    ethereumVoteAsset: Asset | undefined;
  };
  getSonAccountVoteId: (son: SonAccount) => {
    bitcoinVoteId: string | undefined;
    ethereumVoteId: string | undefined;
    hiveVoteId: string | undefined;
  };
  getActiveSons: (globalProperties: GlobalProperties) => {
    bitcoinActiveSons: ActiveSon[];
    bitcoinActiveSonsIds: string[];
    ethereumActiveSons: ActiveSon[];
    ethereumActiveSonsIds: string[];
    hiveActiveSons: ActiveSon[];
    hiveActiveSonsIds: string[];
  };
  getSonAccountsVotesIds: (sons: SonAccount[]) => {
    bitcoinVotesIds: (string | undefined)[];
    ethereumVotesIds: (string | undefined)[];
    hiveVotesIds: (string | undefined)[];
  };
};
