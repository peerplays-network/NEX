import { Affix } from "antd";
import counterpart from "counterpart";
import { capitalize } from "lodash";
import Link from "next/link";

import { VoteForm, VoteTable } from "..";
import { useViewportContext } from "../../../../../common/providers";
import { FullAccount, Member, Proxy } from "../../../../../common/types";
import { InfoCircleOutlined } from "../../../../../ui/src";

import * as Styled from "./VoteTab.styled";
import { useVoteTab } from "./hooks";

type Props = {
  tab: string;
  votesLoading: boolean;
  tabAllMembers: Member[];
  fullAccount: FullAccount | undefined;
  getUserVotes: () => Promise<void>;
  allMembersIds: [string, string][];
  totalGpos: number;
  proxy: Proxy;
  tabServerApprovedVotesIds: string[];
};

export const VoteTab = ({
  tab,
  votesLoading,
  tabAllMembers,
  fullAccount,
  getUserVotes,
  allMembersIds,
  totalGpos,
  proxy,
  tabServerApprovedVotesIds,
}: Props): JSX.Element => {
  const {
    name,
    confirmed,
    tableRows,
    localApprovedVotesIds,
    isVotesChanged,
    resetChanges,
    addVote,
    removeVote,
    handleVoting,
    dispatchTransactionMessage,
    transactionMessageState,
    updateAccountFee,
    afterSuccessTransactionModalClose,
    voteToAllSidechains,
    removeAllSidechainsVotes,
  } = useVoteTab({
    tab,
    votesLoading,
    tabAllMembers,
    fullAccount,
    getUserVotes,
    allMembersIds,
    totalGpos,
    tabServerApprovedVotesIds,
  });
  const { md } = useViewportContext();

  const renderVotesForm = !md ? (
    <VoteForm
      confirmed={confirmed}
      tab={tab}
      isVotesChanged={isVotesChanged}
      resetChanges={resetChanges}
      name={name}
      handleVoting={handleVoting}
      dispatchTransactionMessage={dispatchTransactionMessage}
      transactionMessageState={transactionMessageState}
      updateAccountFee={updateAccountFee}
      proxy={proxy}
      localApprovedVotesIds={localApprovedVotesIds}
      tabServerApprovedVotesIds={tabServerApprovedVotesIds}
      afterSuccessTransactionModalClose={afterSuccessTransactionModalClose}
    />
  ) : (
    <Affix offsetBottom={0}>
      <VoteForm
        confirmed={confirmed}
        tab={tab}
        isVotesChanged={isVotesChanged}
        resetChanges={resetChanges}
        name={name}
        handleVoting={handleVoting}
        dispatchTransactionMessage={dispatchTransactionMessage}
        transactionMessageState={transactionMessageState}
        updateAccountFee={updateAccountFee}
        proxy={proxy}
        localApprovedVotesIds={localApprovedVotesIds}
        tabServerApprovedVotesIds={tabServerApprovedVotesIds}
        afterSuccessTransactionModalClose={afterSuccessTransactionModalClose}
      />
    </Affix>
  );
  return (
    <Styled.Container>
      <Styled.Title>
        {counterpart.translate(`field.labels.vote_for`, {
          tab: capitalize(counterpart.translate(`pages.voting.${tab}.heading`)),
        })}
        <InfoCircleOutlined />
        <Link href={""}>{counterpart.translate(`links.learn_more`)}</Link>
      </Styled.Title>
      <Styled.VoteTabCard>
        <VoteTable
          tab={tab}
          loading={votesLoading || tableRows.length === 0}
          votesRows={tableRows}
          addVote={addVote}
          removeVote={removeVote}
          localApprovedVotesIds={localApprovedVotesIds}
          voteToAllSidechains={voteToAllSidechains}
          removeAllSidechainsVotes={removeAllSidechainsVotes}
        />
        {!(votesLoading || tableRows.length === 0) ? renderVotesForm : ""}
      </Styled.VoteTabCard>
    </Styled.Container>
  );
};
