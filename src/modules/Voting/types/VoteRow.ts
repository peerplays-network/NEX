import { MemberType } from "../../../common/types";

export type VoteRow = {
  // this is vote_id for witnesses and committees and member.id for son
  id: string;
  key: string;
  rank: number;
  type: MemberType;
  status: VoteStatus;
  name: string;
  url: string;
  votes: string;
  missedBlocks?: number;
  active: boolean;
  possibleAction: undefined;
  //son row
  activeChains?: string[];
  actives?: {
    bitcoin?: boolean;
    ethereum?: boolean;
    hive?: boolean;
  };
  statuses?: {
    bitcoin?: VoteStatus;
    ethereum?: VoteStatus;
    hive?: VoteStatus;
  };
  sidechainVotes?: {
    bitcoin?: string;
    ethereum?: string;
    hive?: string;
  };
  sidechainVotesIds?: {
    bitcoin?: string;
    ethereum?: string;
    hive?: string;
  };
  possibleActions?: {
    bitcoin: undefined;
    ethereum: undefined;
    hive: undefined;
  };
  hasSidechains?: {
    bitcoin: boolean;
    ethereum: boolean;
    hive: boolean;
  };
};

export enum VoteStatus {
  APPROVED = "approved",
  UNAPPROVED = "unapproved",
  PARTIALLY_APPROVED = "partial_approved",
}
