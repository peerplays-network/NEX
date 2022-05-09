import { capitalize } from "lodash";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

import { Layout } from "../../../../common/components";
import { VoteType } from "../../../../common/types";
import { Tabs } from "../../../../ui/src";
import { VoteTab } from "../../components";
import { useVoting } from "../../hooks";

import * as Styled from "./VotingPage.styled";

const { TabPane } = Tabs;

const VotingPage: NextPage = () => {
  const router = useRouter();
  const { tab } = router.query;
  const voteTabs: VoteType[] = ["witnesses", "sons", "committees"];
  const voteIdentifiers = [1, 3, 0];

  const {
    loading,
    serverApprovedVotes,
    allMembers,
    fullAccount,
    getVotes,
    allMembersIds,
    totalGpos,
    proxy,
  } = useVoting();

  return (
    <Layout
      title="Voting"
      type="card-lrg"
      heading="Voting"
      description="Voting Page"
      dexLayout={true}
    >
      <Styled.VotingPageCard>
        <Tabs
          defaultActiveKey={`${tab ? tab : "gpos"}`}
          onTabClick={(key) => {
            router.push(`/voting?tab=${key}`);
          }}
        >
          <TabPane tab="GPOS" key="gpos">
            <Styled.Text>GPOS Tab</Styled.Text>
          </TabPane>
          {voteTabs.map((voteTab, index) => {
            console.log("inja", index, voteTab);
            return (
              <TabPane tab={capitalize(voteTab)} key={voteTab}>
                <VoteTab
                  tab={voteTab}
                  serverApprovedVotes={serverApprovedVotes.filter(
                    (approvedVote) =>
                      parseInt(approvedVote.vote_id.split(":")[0]) ===
                      voteIdentifiers[index]
                  )}
                  allMembers={allMembers.filter(
                    (member) =>
                      parseInt(member.vote_id.split(":")[0]) ===
                      voteIdentifiers[index]
                  )}
                  fullAccount={fullAccount}
                  getVotes={getVotes}
                  allMembersIds={allMembersIds}
                  votesLoading={loading}
                  totalGpos={totalGpos}
                  proxy={proxy}
                />
              </TabPane>
            );
          })}

          <TabPane tab="Proxy" key="proxy">
            <Styled.Text>Proxy Tab</Styled.Text>
          </TabPane>
        </Tabs>
      </Styled.VotingPageCard>
    </Layout>
  );
};
export default VotingPage;
