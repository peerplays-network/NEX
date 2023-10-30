import { GPOSInfo } from "../../../common/hooks";
import { FullAccount, Member, Proxy } from "../../../common/types";

export type UseVotingResult = {
  loadingUserVotes: boolean;
  serverApprovedVotesIds: string[];
  allMembers: Member[];
  fullAccount: FullAccount | undefined;
  allMembersIds: [string, string][];
  gposInfo: GPOSInfo;
  proxy: Proxy;
  getUserVotes: () => Promise<void>;
  loadingMembers: boolean;
  voteTabLoaded: boolean;
};
