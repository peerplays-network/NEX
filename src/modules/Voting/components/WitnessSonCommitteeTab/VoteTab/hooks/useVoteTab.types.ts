import { Dispatch } from "react";

import {
  TransactionMessageAction,
  TransactionMessageState,
} from "../../../../../../common/hooks";
import { SignerKey } from "../../../../../../common/types";
import { VoteRow } from "../../../../types";

export type UseVoteTabResult = {
  name: string;
  confirmed: boolean;
  tableRows: VoteRow[];
  localApprovedVotesIds: string[];
  isVotesChanged: boolean;
  resetChanges: () => void;
  addVote: (voteId: string) => void;
  removeVote: (voteId: string) => void;
  handleVoting: (signerKey: SignerKey) => Promise<void>;
  transactionMessageState: TransactionMessageState;
  dispatchTransactionMessage: Dispatch<TransactionMessageAction>;
  updateAccountFee: number | undefined;
  afterSuccessTransactionModalClose: (() => void) | undefined;
  voteToAllSidechains: (sonAccountId: string) => void;
  removeAllSidechainsVotes: (sonAccountId: string) => void;
};
