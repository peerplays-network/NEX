import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
import { capitalize } from "lodash";
import Link from "next/link";
import { useCallback, useRef } from "react";

import {
  BITCOIN_NETWORK,
  ETHEREUM_NETWORK,
  HIVE_NETWORK,
} from "../../../../../api/params";
import {
  renderPaginationItem,
  TableDownloader,
} from "../../../../../common/components";
import { useViewportContext } from "../../../../../common/providers";
import { MemberType } from "../../../../../common/types";
import { SearchOutlined } from "../../../../../ui/src";
import { VoteRow, VoteStatus } from "../../../types";

import * as Styled from "./VoteTable.styled";
import { showVotesColumns } from "./components";
import { useVoteTable } from "./hooks";

type Props = {
  tab: string;
  votesRows: VoteRow[];
  loading: boolean;
  addVote: (voteId: string) => void;
  removeVote: (voteId: string) => void;
  localApprovedVotesIds: string[];
  voteToAllSidechains: (sonAccountId: string) => void;
  removeAllSidechainsVotes: (sonAccountId: string) => void;
};

export const VoteTable = ({
  tab,
  votesRows,
  loading,
  addVote,
  removeVote,
  localApprovedVotesIds,
  voteToAllSidechains,
  removeAllSidechainsVotes,
}: Props): JSX.Element => {
  const { searchDataSource, setSearchDataSource } = useVoteTable({ votesRows });

  const { md } = useViewportContext();
  const columns = showVotesColumns(
    localApprovedVotesIds,
    addVote,
    removeVote,
    tab as MemberType,
    voteToAllSidechains,
    removeAllSidechainsVotes
  );
  const componentRef = useRef<HTMLDivElement>(null);
  const renderWitnessListItem = useCallback(
    (item: VoteRow) => (
      <Styled.VoteListItem key={item.key}>
        <Styled.VoteItemContent>
          <div className="item-info">
            <span className="item-info-title">{columns[0].title()}</span>
            <span className="item-info-value">{item.rank}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[1].title()}</span>
            <span className="item-info-value">
              <Link href={`/user/${item.name}`}>{item.name}</Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[2].title()}</span>
            <span className="item-info-value">
              <span>{item.active === true ? <Styled.ActiveIcon /> : ``}</span>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[3].title()}</span>
            <span className="item-info-value">
              <Link href={`${item.url}`} target="_blank">
                <Styled.urlIcon rotate={45} />
              </Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[4].title()}</span>
            <span className="item-info-value">{item.votes}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[5].title()}</span>
            <span className="item-info-value">
              <Styled.MissedBlocks>{item.missedBlocks}</Styled.MissedBlocks>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[6].title()}</span>
            <span className="item-info-value">
              {item.status === VoteStatus.UNAPPROVED ? (
                <>
                  <Styled.Xmark></Styled.Xmark>
                  <Styled.NotApprovedStatus>
                    {counterpart.translate(`pages.voting.status.not_approved`)}
                  </Styled.NotApprovedStatus>
                </>
              ) : (
                <>
                  <Styled.Check></Styled.Check>
                  <Styled.ApprovedStatus>
                    {counterpart.translate(`pages.voting.status.approved`)}
                  </Styled.ApprovedStatus>
                </>
              )}
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[7].title()}</span>
            <span className="item-info-value">
              {!localApprovedVotesIds.includes(item.id) ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    addVote(item.id);
                  }}
                >
                  <Styled.LikeOutlinedIcon />
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    removeVote(item.id);
                  }}
                >
                  <Styled.LikeFilledIcon />
                </div>
              )}
            </span>
          </div>
        </Styled.VoteItemContent>
      </Styled.VoteListItem>
    ),
    [columns, localApprovedVotesIds, addVote, removeVote]
  );
  const renderCommitteeListItem = useCallback(
    (item: VoteRow) => (
      <Styled.VoteListItem key={item.key}>
        <Styled.VoteItemContent>
          <div className="item-info">
            <span className="item-info-title">{columns[0].title()}</span>
            <span className="item-info-value">{item.rank}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[1].title()}</span>
            <span className="item-info-value">
              <Link href={`/user/${item.name}`}>{item.name}</Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[2].title()}</span>
            <span className="item-info-value">
              <span>{item.active === true ? <Styled.ActiveIcon /> : ``}</span>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[3].title()}</span>
            <span className="item-info-value">
              <Link href={`${item.url}`} target="_blank">
                <Styled.urlIcon rotate={45} />
              </Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[4].title()}</span>
            <span className="item-info-value">{item.votes}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[5].title()}</span>
            <span className="item-info-value">
              {item.status === VoteStatus.UNAPPROVED ? (
                <>
                  <Styled.Xmark></Styled.Xmark>
                  <Styled.NotApprovedStatus>
                    {counterpart.translate(`pages.voting.status.not_approved`)}
                  </Styled.NotApprovedStatus>
                </>
              ) : (
                <>
                  <Styled.Check></Styled.Check>
                  <Styled.ApprovedStatus>
                    {counterpart.translate(`pages.voting.status.approved`)}
                  </Styled.ApprovedStatus>
                </>
              )}
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[6].title()}</span>
            <span className="item-info-value">
              {!localApprovedVotesIds.includes(item.id) ? (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    addVote(item.id);
                  }}
                >
                  <Styled.LikeOutlinedIcon />
                </div>
              ) : (
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    removeVote(item.id);
                  }}
                >
                  <Styled.LikeFilledIcon />
                </div>
              )}
            </span>
          </div>
        </Styled.VoteItemContent>
      </Styled.VoteListItem>
    ),
    [columns, localApprovedVotesIds, addVote, removeVote]
  );
  const renderSonListItem = useCallback(
    (item: VoteRow) => (
      <Styled.VoteListItem key={item.key}>
        <Styled.VoteItemContent>
          <div className="item-info">
            <span className="item-info-title">{columns[0].title()}</span>
            <span className="item-info-value">{item.rank}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[1].title()}</span>
            <span className="item-info-value">
              <Link href={`/user/${item.name}`}>{item.name}</Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[2].title()}</span>
            <span className="item-info-value">
              {item.activeChains?.join(", ")}
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[3].title()}</span>
            <span className="item-info-value">
              <span>{item.active === true ? <Styled.ActiveIcon /> : ``}</span>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[4].title()}</span>
            <span className="item-info-value">
              <Link href={`${item.url}`} target="_blank">
                <Styled.urlIcon rotate={45} />
              </Link>
            </span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[5].title()}</span>
            <span className="item-info-value">{item.votes}</span>
          </div>
          <div className="item-info">
            <span className="item-info-title">{columns[6].title()}</span>
            <span className="item-info-value">
              {item.status === VoteStatus.UNAPPROVED ? (
                <>
                  <Styled.Xmark></Styled.Xmark>
                  <Styled.NotApprovedStatus>
                    {counterpart.translate(`pages.voting.status.not_approved`)}
                  </Styled.NotApprovedStatus>
                </>
              ) : (
                <>
                  <Styled.Check></Styled.Check>
                  <Styled.ApprovedStatus>
                    {counterpart.translate(`pages.voting.status.approved`)}
                  </Styled.ApprovedStatus>
                </>
              )}
            </span>
          </div>

          <Styled.ItemHeader>
            {counterpart.translate("tableHead.active_on")}
          </Styled.ItemHeader>
          {item.hasSidechains?.bitcoin && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{BITCOIN_NETWORK}</span>
                <span className="item-info-value">
                  {item.actives?.bitcoin ? <Styled.ActiveIcon /> : ``}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.ethereum && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{ETHEREUM_NETWORK}</span>
                <span className="item-info-value">
                  {item.actives?.ethereum ? <Styled.ActiveIcon /> : ``}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.hive && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{HIVE_NETWORK}</span>
                <span className="item-info-value">
                  {item.actives?.hive ? <Styled.ActiveIcon /> : ``}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}

          <Styled.ItemHeader>
            {counterpart.translate("tableHead.total_votes_on")}
          </Styled.ItemHeader>
          {item.hasSidechains?.bitcoin && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{BITCOIN_NETWORK}</span>
                <span className="item-info-value">
                  {item.sidechainVotes?.bitcoin}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.ethereum && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{ETHEREUM_NETWORK}</span>
                <span className="item-info-value">
                  {item.sidechainVotes?.ethereum}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.hive && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{HIVE_NETWORK}</span>
                <span className="item-info-value">
                  {item.sidechainVotes?.hive}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}

          <Styled.ItemHeader>
            {counterpart.translate("tableHead.status_on")}
          </Styled.ItemHeader>
          {item.hasSidechains?.bitcoin && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{BITCOIN_NETWORK}</span>
                <span className="item-info-value">
                  {item.statuses?.bitcoin === VoteStatus.APPROVED ? (
                    <>
                      <Styled.Check></Styled.Check>
                      <Styled.ApprovedStatus>
                        {counterpart.translate(`pages.voting.status.approved`)}
                      </Styled.ApprovedStatus>
                    </>
                  ) : (
                    <>
                      <Styled.Xmark></Styled.Xmark>
                      <Styled.NotApprovedStatus>
                        {counterpart.translate(
                          `pages.voting.status.not_approved`
                        )}
                      </Styled.NotApprovedStatus>
                    </>
                  )}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.ethereum && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{ETHEREUM_NETWORK}</span>
                <span className="item-info-value">
                  {item.statuses?.ethereum === VoteStatus.APPROVED ? (
                    <>
                      <Styled.Check></Styled.Check>
                      <Styled.ApprovedStatus>
                        {counterpart.translate(`pages.voting.status.approved`)}
                      </Styled.ApprovedStatus>
                    </>
                  ) : (
                    <>
                      <Styled.Xmark></Styled.Xmark>
                      <Styled.NotApprovedStatus>
                        {counterpart.translate(
                          `pages.voting.status.not_approved`
                        )}
                      </Styled.NotApprovedStatus>
                    </>
                  )}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.hive && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{HIVE_NETWORK}</span>
                <span className="item-info-value">
                  {item.statuses?.hive === VoteStatus.APPROVED ? (
                    <>
                      <Styled.Check></Styled.Check>
                      <Styled.ApprovedStatus>
                        {counterpart.translate(`pages.voting.status.approved`)}
                      </Styled.ApprovedStatus>
                    </>
                  ) : (
                    <>
                      <Styled.Xmark></Styled.Xmark>
                      <Styled.NotApprovedStatus>
                        {counterpart.translate(
                          `pages.voting.status.not_approved`
                        )}
                      </Styled.NotApprovedStatus>
                    </>
                  )}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}

          <Styled.ItemHeader>
            {counterpart.translate("tableHead.action")}
          </Styled.ItemHeader>
          {item.hasSidechains?.bitcoin && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{BITCOIN_NETWORK}</span>
                <span className="item-info-value">
                  {!localApprovedVotesIds.includes(
                    item.sidechainVotesIds?.bitcoin as string
                  ) ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        addVote(item.sidechainVotesIds?.bitcoin as string);
                      }}
                    >
                      <Styled.LikeOutlinedIcon />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        removeVote(item.sidechainVotesIds?.bitcoin as string);
                      }}
                    >
                      <Styled.LikeFilledIcon />
                    </div>
                  )}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.ethereum && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{ETHEREUM_NETWORK}</span>
                <span className="item-info-value">
                  {!localApprovedVotesIds.includes(
                    item.sidechainVotesIds?.ethereum as string
                  ) ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        addVote(item.sidechainVotesIds?.ethereum as string);
                      }}
                    >
                      <Styled.LikeOutlinedIcon />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        removeVote(item.sidechainVotesIds?.ethereum as string);
                      }}
                    >
                      <Styled.LikeFilledIcon />
                    </div>
                  )}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
          {item.hasSidechains?.hive && (
            <Styled.IndentedListItem>
              <div className="item-info">
                <span className="item-info-title">{HIVE_NETWORK}</span>
                <span className="item-info-value">
                  {!localApprovedVotesIds.includes(
                    item.sidechainVotesIds?.hive as string
                  ) ? (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        addVote(item.sidechainVotesIds?.hive as string);
                      }}
                    >
                      <Styled.LikeOutlinedIcon />
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        removeVote(item.sidechainVotesIds?.hive as string);
                      }}
                    >
                      <Styled.LikeFilledIcon />
                    </div>
                  )}
                </span>
              </div>
            </Styled.IndentedListItem>
          )}
        </Styled.VoteItemContent>
      </Styled.VoteListItem>
    ),
    [columns, localApprovedVotesIds, addVote, removeVote]
  );
  const renderListItem = useCallback(
    (item: any) => {
      if (tab === "sons") {
        return renderSonListItem(item);
      } else if (tab === "committees") {
        return renderCommitteeListItem(item);
      } else {
        return renderWitnessListItem(item);
      }
    },
    [tab, renderWitnessListItem, renderCommitteeListItem, renderSonListItem]
  );

  const expandedRowRenderForSonsTab = useCallback(
    (record: VoteRow) => {
      return (
        <Styled.ExpandableContainer>
          {/* Header row */}
          <Styled.SidechainRow>
            <Styled.SidechainCol span={5}>
              <Styled.ExpandableHeader>
                {counterpart.translate("tableHead.sidechain")}
              </Styled.ExpandableHeader>
            </Styled.SidechainCol>
            <Styled.SidechainCol span={4}>
              <Styled.ExpandableHeader>
                {counterpart.translate("tableHead.active")}
              </Styled.ExpandableHeader>
            </Styled.SidechainCol>
            <Styled.SidechainCol span={6}>
              <Styled.ExpandableHeader>
                {counterpart.translate("tableHead.total_votes")}
              </Styled.ExpandableHeader>
            </Styled.SidechainCol>
            <Styled.SidechainCol span={5}>
              <Styled.ExpandableHeader>
                {counterpart.translate("tableHead.status")}
              </Styled.ExpandableHeader>
            </Styled.SidechainCol>
            <Styled.SidechainCol span={4}>
              <Styled.ExpandableHeader>
                {counterpart.translate("tableHead.action")}
              </Styled.ExpandableHeader>
            </Styled.SidechainCol>
          </Styled.SidechainRow>
          {/* Bitcoin row */}
          {record.hasSidechains?.bitcoin && (
            <Styled.SidechainRow>
              <Styled.SidechainCol span={5}>
                {BITCOIN_NETWORK}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={4}>
                <span>
                  {record.actives?.bitcoin ? <Styled.ActiveIcon /> : ``}
                </span>
              </Styled.SidechainCol>
              <Styled.SidechainCol span={6}>
                {record.sidechainVotes?.bitcoin
                  ? record.sidechainVotes.bitcoin
                  : ""}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={5}>
                {record.statuses?.bitcoin ? (
                  <>
                    {record.statuses.bitcoin === "unapproved" ? (
                      <>
                        <Styled.Xmark></Styled.Xmark>
                        <Styled.NotApprovedStatus>
                          {counterpart.translate(
                            `pages.voting.status.not_approved`
                          )}
                        </Styled.NotApprovedStatus>
                      </>
                    ) : (
                      <>
                        <Styled.Check></Styled.Check>
                        <Styled.ApprovedStatus>
                          {counterpart.translate(
                            `pages.voting.status.approved`
                          )}
                        </Styled.ApprovedStatus>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={4}>
                {!localApprovedVotesIds.includes(
                  record.sidechainVotesIds?.bitcoin as string
                ) ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      addVote(record.sidechainVotesIds?.bitcoin as string);
                    }}
                  >
                    <Styled.LikeOutlinedIcon />
                  </div>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      removeVote(record.sidechainVotesIds?.bitcoin as string);
                    }}
                  >
                    <Styled.LikeFilledIcon />
                  </div>
                )}
              </Styled.SidechainCol>
            </Styled.SidechainRow>
          )}
          {/* Ethereum row */}
          {record.hasSidechains?.ethereum && (
            <Styled.SidechainRow>
              <Styled.SidechainCol span={5}>
                {ETHEREUM_NETWORK}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={4}>
                <span>
                  {record.actives?.ethereum ? <Styled.ActiveIcon /> : ``}
                </span>
              </Styled.SidechainCol>
              <Styled.SidechainCol span={6}>
                {record.sidechainVotes?.ethereum
                  ? record.sidechainVotes.ethereum
                  : ""}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={5}>
                {record.statuses?.ethereum ? (
                  <>
                    {record.statuses.ethereum === "unapproved" ? (
                      <>
                        <Styled.Xmark></Styled.Xmark>
                        <Styled.NotApprovedStatus>
                          {counterpart.translate(
                            `pages.voting.status.not_approved`
                          )}
                        </Styled.NotApprovedStatus>
                      </>
                    ) : (
                      <>
                        <Styled.Check></Styled.Check>
                        <Styled.ApprovedStatus>
                          {counterpart.translate(
                            `pages.voting.status.approved`
                          )}
                        </Styled.ApprovedStatus>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={4}>
                {!localApprovedVotesIds.includes(
                  record.sidechainVotesIds?.ethereum as string
                ) ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      addVote(record.sidechainVotesIds?.ethereum as string);
                    }}
                  >
                    <Styled.LikeOutlinedIcon />
                  </div>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      removeVote(record.sidechainVotesIds?.ethereum as string);
                    }}
                  >
                    <Styled.LikeFilledIcon />
                  </div>
                )}
              </Styled.SidechainCol>
            </Styled.SidechainRow>
          )}
          {/* Hive row */}
          {record.hasSidechains?.hive && (
            <Styled.SidechainRow>
              <Styled.SidechainCol span={5}>{HIVE_NETWORK}</Styled.SidechainCol>
              <Styled.SidechainCol span={4}>
                <span>{record.actives?.hive ? <Styled.ActiveIcon /> : ``}</span>
              </Styled.SidechainCol>
              <Styled.SidechainCol span={6}>
                {record.sidechainVotes?.hive ? record.sidechainVotes.hive : ""}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={5}>
                {record.statuses?.hive ? (
                  <>
                    {record.statuses.hive === "unapproved" ? (
                      <>
                        <Styled.Xmark></Styled.Xmark>
                        <Styled.NotApprovedStatus>
                          {counterpart.translate(
                            `pages.voting.status.not_approved`
                          )}
                        </Styled.NotApprovedStatus>
                      </>
                    ) : (
                      <>
                        <Styled.Check></Styled.Check>
                        <Styled.ApprovedStatus>
                          {counterpart.translate(
                            `pages.voting.status.approved`
                          )}
                        </Styled.ApprovedStatus>
                      </>
                    )}
                  </>
                ) : (
                  ""
                )}
              </Styled.SidechainCol>
              <Styled.SidechainCol span={4}>
                {!localApprovedVotesIds.includes(
                  record.sidechainVotesIds?.hive as string
                ) ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      addVote(record.sidechainVotesIds?.hive as string);
                    }}
                  >
                    <Styled.LikeOutlinedIcon />
                  </div>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      removeVote(record.sidechainVotesIds?.hive as string);
                    }}
                  >
                    <Styled.LikeFilledIcon />
                  </div>
                )}
              </Styled.SidechainCol>
            </Styled.SidechainRow>
          )}
        </Styled.ExpandableContainer>
      );
    },
    [localApprovedVotesIds, addVote, removeVote]
  );

  return (
    <Styled.VoteTableWrapper>
      <Styled.VoteHeaderBar>
        <Styled.Title>
          {capitalize(counterpart.translate(`pages.voting.${tab}.heading`))}{" "}
        </Styled.Title>
        <SearchTableInput
          columns={columns as ColumnsType<unknown>}
          dataSource={votesRows}
          setDataSource={setSearchDataSource}
          inputProps={{
            placeholder: counterpart.translate(
              `pages.blocks.${tab}.search_${tab}`
            ),
            suffix: <SearchOutlined />,
          }}
        />
        <TableDownloader
          componentRef={componentRef}
          data={votesRows}
        ></TableDownloader>
      </Styled.VoteHeaderBar>
      <Styled.Container>
        {md ? (
          <Styled.VoteList
            itemLayout="vertical"
            dataSource={searchDataSource}
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              defaultCurrent: 1,
              showSizeChanger: true,
              showLessItems: true,
              size: "small",
              itemRender: renderPaginationItem(),
            }}
            renderItem={renderListItem}
          />
        ) : (
          <Styled.VoteTable
            columns={columns as ColumnsType<unknown>}
            dataSource={searchDataSource}
            loading={loading}
            pagination={{
              defaultPageSize: 20,
              defaultCurrent: 1,
              showSizeChanger: true,
              size: "small",
              showLessItems: true,
              itemRender: renderPaginationItem(),
            }}
            size="small"
            expandable={
              tab === "sons"
                ? {
                    expandedRowRender: expandedRowRenderForSonsTab,
                    expandRowByClick: false,
                  }
                : undefined
            }
          />
        )}
      </Styled.Container>

      <Styled.PrintTable>
        <div ref={componentRef}>
          <Styled.VoteTable
            dataSource={votesRows}
            columns={columns as ColumnsType<unknown>}
            loading={loading}
            pagination={false}
          />
        </div>
      </Styled.PrintTable>
    </Styled.VoteTableWrapper>
  );
};
