import counterpart from "counterpart";
import Link from "next/link";

import {
  BITCOIN_NETWORK,
  ETHEREUM_NETWORK,
  HIVE_NETWORK,
} from "../../../../../../api/params";
import { TableHeading } from "../../../../../../common/components";
import { MemberType } from "../../../../../../common/types";
import { VoteRow, VoteStatus } from "../../../../types";
import * as Styled from "../VoteTable.styled";

type VoteColumnType = {
  title: () => JSX.Element;
  dataIndex: string;
  key: string;
  render:
    | ((active: boolean) => JSX.Element)
    | ((activeChains: string[]) => JSX.Element)
    | ((_value: string, _record: VoteRow) => JSX.Element)
    | undefined;
  filters:
    | boolean
    | {
        text: string;
        value: string;
      }[]
    | {
        text: string;
        value: boolean;
      }[]
    | undefined;
  filterMode: string | undefined;
  filterSearch: boolean | undefined;
  onFilter:
    | ((value: boolean, record: VoteRow) => boolean)
    | ((value: string, record: VoteRow) => boolean | undefined)
    | ((value: string, record: VoteRow) => boolean)
    | undefined;
  sorter:
    | ((a: { rank: number }, b: { rank: number }) => number)
    | ((a: { votes: string }, b: { votes: string }) => number)
    | ((a: { missedBlocks: number }, b: { missedBlocks: number }) => number)
    | undefined;
};

const createWitnessColumns = (
  localApprovedVotesIds: string[],
  addVote: (voteId: string) => void,
  removeVote: (voteId: string) => void
) => {
  const headings = [
    "rank",
    "name",
    "active",
    "url",
    "votes",
    "missed_blocks",
    "status",
    "action",
  ];
  const keys = [
    "rank",
    "name",
    "active",
    "url",
    "votes",
    "missedBlocks",
    "status",
    "possibleAction",
  ];
  const renders = [
    //rank
    undefined,
    (name: string): JSX.Element => <Link href={`/user/${name}`}>{name}</Link>,
    (active: boolean): JSX.Element => (
      <span>{active === true ? <Styled.ActiveIcon /> : ``}</span>
    ),
    (url: string): JSX.Element => (
      <>
        {!url || url === "" ? (
          <span>{counterpart.translate(`field.labels.not_available`)}</span>
        ) : (
          <a href={`${url}`} target="_blank">
            <Styled.urlIcon rotate={45} />
          </a>
        )}
      </>
    ),
    //votes
    undefined,
    (missedBlocks: string): JSX.Element => (
      <Styled.MissedBlocks>{missedBlocks}</Styled.MissedBlocks>
    ),
    //status
    (_value: string, _record: VoteRow): JSX.Element => (
      <>
        {_value === "unapproved" ? (
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
      </>
    ),
    //possibleAction
    (_value: string, record: VoteRow): JSX.Element => (
      <>
        {!localApprovedVotesIds.includes(record.id) ? (
          <div
            className="cursor-pointer"
            onClick={() => {
              addVote(record.id);
            }}
          >
            <Styled.LikeOutlinedIcon />
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => {
              removeVote(record.id);
            }}
          >
            <Styled.LikeFilledIcon />
          </div>
        )}
      </>
    ),
  ];
  const filters = [
    undefined,
    undefined,
    [
      {
        text: counterpart.translate(`tableFilters.active`),
        value: true,
      },
      {
        text: counterpart.translate(`tableFilters.inactive`),
        value: false,
      },
    ],
    undefined,
    undefined,
    undefined,
    [
      {
        text: counterpart.translate(`tableFilters.approved`),
        value: VoteStatus.APPROVED,
      },
      {
        text: counterpart.translate(`tableFilters.not_approved`),
        value: VoteStatus.UNAPPROVED,
      },
    ],
    undefined,
  ];
  const filterModes = [
    undefined,
    undefined,
    "menu",
    undefined,
    undefined,
    undefined,
    "menu",
    "menu",
  ];
  const filterSearch = [
    undefined,
    undefined,
    false,
    undefined,
    undefined,
    undefined,
    false,
    false,
  ];
  const onFilters = [
    undefined,
    undefined,
    (value: boolean, record: VoteRow): boolean => record.active === value,
    undefined,
    undefined,
    undefined,
    (value: string, record: VoteRow): boolean => record.status === value,
    (value: string, record: VoteRow): boolean =>
      record.possibleAction === value,
  ];
  const sorters = [
    (a: { rank: number }, b: { rank: number }) => a.rank - b.rank,
    undefined,
    undefined,
    undefined,
    (a: { votes: string }, b: { votes: string }) =>
      parseFloat(a.votes) - parseFloat(b.votes),
    (a: { missedBlocks: number }, b: { missedBlocks: number }) =>
      a.missedBlocks - b.missedBlocks,
    undefined,
    undefined,
  ];
  return {
    headings,
    keys,
    renders,
    filters,
    filterModes,
    filterSearch,
    onFilters,
    sorters,
  };
};

const createSonsColumns = (
  localApprovedVotesIds: string[],
  voteToAllSidechains: (sonAccountId: string) => void,
  removeAllSidechainsVotes: (sonAccountId: string) => void
) => {
  const headings = [
    "rank",
    "name",
    "active_chains",
    "active_all_chains",
    "url",
    "votes_all_chains",
    "status_all_chains",
    "action_all_chains",
  ];
  const keys = [
    "rank",
    "name",
    "activeChains",
    "active",
    "url",
    "votes",
    "status",
    "possibleAction",
  ];
  const renders = [
    //rank
    undefined,
    (name: string): JSX.Element => <Link href={`/user/${name}`}>{name}</Link>,
    (activeChains: string[]): JSX.Element => (
      <span>{activeChains.join(", ")}</span>
    ),
    (active: boolean): JSX.Element => (
      <span>{active === true ? <Styled.ActiveIcon /> : ``}</span>
    ),
    (url: string): JSX.Element => (
      <>
        {!url || url === "" ? (
          <span>{counterpart.translate(`field.labels.not_available`)}</span>
        ) : (
          <a href={`${url}`} target="_blank">
            <Styled.urlIcon rotate={45} />
          </a>
        )}
      </>
    ),
    //votes
    undefined,
    //status
    (_value: string, _record: VoteRow): JSX.Element => (
      <>
        {_value === VoteStatus.UNAPPROVED ? (
          <>
            <Styled.Xmark></Styled.Xmark>
            <Styled.NotApprovedStatus>
              {counterpart.translate(`pages.voting.status.not_approved`)}
            </Styled.NotApprovedStatus>
          </>
        ) : _value === VoteStatus.PARTIALLY_APPROVED ? (
          <>
            <Styled.PartialCheck></Styled.PartialCheck>
            <Styled.PartiallyApprovedStatus>
              {counterpart.translate(`pages.voting.status.partially_approved`)}
            </Styled.PartiallyApprovedStatus>
          </>
        ) : (
          <>
            <Styled.Check></Styled.Check>
            <Styled.ApprovedStatus>
              {counterpart.translate(`pages.voting.status.approved`)}
            </Styled.ApprovedStatus>
          </>
        )}
      </>
    ),
    //possibleAction
    (_value: string, record: VoteRow): JSX.Element => (
      <>
        {Object.values(
          record.sidechainVotesIds as {
            [sidechain: string]: string;
          }
        ).some((voteId) => !localApprovedVotesIds.includes(voteId)) ? (
          <div
            className="cursor-pointer"
            onClick={() => {
              voteToAllSidechains(record.id);
            }}
          >
            <Styled.LikeOutlinedIcon />
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => {
              removeAllSidechainsVotes(record.id);
            }}
          >
            <Styled.LikeFilledIcon />
          </div>
        )}
      </>
    ),
  ];
  const filters = [
    //rank
    undefined,
    //name
    undefined,
    //activeChains,
    [
      {
        text: BITCOIN_NETWORK,
        value: BITCOIN_NETWORK.toLowerCase(),
      },
      {
        text: ETHEREUM_NETWORK,
        value: ETHEREUM_NETWORK.toLowerCase(),
      },
      {
        text: HIVE_NETWORK,
        value: HIVE_NETWORK.toLowerCase(),
      },
    ],
    //active
    [
      {
        text: counterpart.translate(`tableFilters.active`),
        value: true,
      },
      {
        text: counterpart.translate(`tableFilters.inactive`),
        value: false,
      },
    ],
    //url
    undefined,
    //votes
    undefined,
    //status
    [
      {
        text: counterpart.translate(`tableFilters.approved`),
        value: VoteStatus.APPROVED,
      },
      {
        text: counterpart.translate(`tableFilters.not_approved`),
        value: VoteStatus.UNAPPROVED,
      },
    ],
    //possibleAction
    false,
  ];
  const filterModes = [
    //rank
    undefined,
    //name
    undefined,
    //activeChains
    "menu",
    //active
    "menu",
    //url
    undefined,
    //votes
    undefined,
    //status
    "menu",
    //possibleAction
    undefined,
  ];
  const filterSearch = [
    //rank
    undefined,
    //name
    undefined,
    //activeChains
    false,
    //active
    false,
    //url
    undefined,
    //votes
    undefined,
    //status
    false,
    //possibleAction
    undefined,
  ];
  const onFilters = [
    //rank
    undefined,
    //name
    undefined,
    //activeChains
    (value: string, record: VoteRow): boolean | undefined =>
      record.activeChains?.includes(value),
    //active
    (value: boolean, record: VoteRow): boolean => record.active === value,
    //url
    undefined,
    //votes
    undefined,
    //status
    (value: string, record: VoteRow): boolean => record.status === value,
    //possibleAction
    undefined,
  ];
  const sorters = [
    //rank
    (a: { rank: number }, b: { rank: number }) => a.rank - b.rank,
    //name
    undefined,
    //activeChains
    undefined,
    //active
    undefined,
    //url
    undefined,
    //votes
    (a: { votes: string }, b: { votes: string }) =>
      parseFloat(a.votes) - parseFloat(b.votes),
    //status
    undefined,
    //possibleAction
    undefined,
  ];
  return {
    headings,
    keys,
    renders,
    filters,
    filterModes,
    filterSearch,
    onFilters,
    sorters,
  };
};

const createCommitteesColumns = (
  localApprovedVotesIds: string[],
  addVote: (voteId: string) => void,
  removeVote: (voteId: string) => void
) => {
  const headings = [
    "rank",
    "name",
    "active",
    "url",
    "votes",
    "status",
    "action",
  ];
  const keys = [
    "rank",
    "name",
    "active",
    "url",
    "votes",
    "status",
    "possibleAction",
  ];
  const renders = [
    //rank
    undefined,
    (name: string): JSX.Element => <Link href={`/user/${name}`}>{name}</Link>,
    (active: boolean): JSX.Element => (
      <span>{active === true ? <Styled.ActiveIcon /> : ``}</span>
    ),
    (url: string): JSX.Element => (
      <>
        {!url || url === "" ? (
          <span>{counterpart.translate(`field.labels.not_available`)}</span>
        ) : (
          <a href={`${url}`} target="_blank">
            <Styled.urlIcon rotate={45} />
          </a>
        )}
      </>
    ),
    //votes
    undefined,
    //status
    (_value: string, _record: VoteRow): JSX.Element => (
      <>
        {_value === "unapproved" ? (
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
      </>
    ),
    //possibleAction
    (_value: string, record: VoteRow): JSX.Element => (
      <>
        {!localApprovedVotesIds.includes(record.id) ? (
          <div
            className="cursor-pointer"
            onClick={() => {
              addVote(record.id);
            }}
          >
            <Styled.LikeOutlinedIcon />
          </div>
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => {
              removeVote(record.id);
            }}
          >
            <Styled.LikeFilledIcon />
          </div>
        )}
      </>
    ),
  ];
  const filters = [
    //rank
    undefined,
    //name
    undefined,
    //active
    [
      {
        text: counterpart.translate(`tableFilters.active`),
        value: true,
      },
      {
        text: counterpart.translate(`tableFilters.inactive`),
        value: false,
      },
    ],
    //url
    undefined,
    //votes
    undefined,
    //status
    [
      {
        text: counterpart.translate(`tableFilters.approved`),
        value: VoteStatus.APPROVED,
      },
      {
        text: counterpart.translate(`tableFilters.not_approved`),
        value: VoteStatus.UNAPPROVED,
      },
    ],
    //possibleAction
    undefined,
  ];
  const filterModes = [
    undefined,
    undefined,
    "menu",
    undefined,
    undefined,
    "menu",
    "menu",
  ];
  const filterSearch = [
    undefined,
    undefined,
    false,
    undefined,
    undefined,
    false,
    false,
  ];
  const onFilters = [
    undefined,
    undefined,
    (value: boolean, record: VoteRow): boolean => record.active === value,
    undefined,
    undefined,
    (value: string, record: VoteRow): boolean => record.status === value,
    undefined,
  ];
  const sorters = [
    (a: { rank: number }, b: { rank: number }) => a.rank - b.rank,
    undefined,
    undefined,
    undefined,
    (a: { votes: string }, b: { votes: string }) =>
      parseFloat(a.votes) - parseFloat(b.votes),
    undefined,
    undefined,
  ];
  return {
    headings,
    keys,
    renders,
    filters,
    filterModes,
    filterSearch,
    onFilters,
    sorters,
  };
};

export const showVotesColumns = (
  localApprovedVotesIds: string[],
  addVote: (voteId: string) => void,
  removeVote: (voteId: string) => void,
  tab: MemberType,
  voteToAllSidechains: (sonAccountId: string) => void,
  removeAllSidechainsVotes: (sonAccountId: string) => void
): VoteColumnType[] => {
  if (tab === "sons") {
    const {
      headings,
      keys,
      renders,
      filters,
      filterModes,
      filterSearch,
      onFilters,
      sorters,
    } = createSonsColumns(
      localApprovedVotesIds,
      voteToAllSidechains,
      removeAllSidechainsVotes
    );
    return headings.map((heading, index) => {
      return {
        title: (): JSX.Element => <TableHeading heading={heading} />,
        dataIndex: keys[index],
        key: keys[index],
        render: renders[index],
        filters: filters[index],
        filterMode: filterModes[index],
        filterSearch: filterSearch[index],
        onFilter: onFilters[index],
        sorter: sorters[index],
      };
    });
  } else if (tab === "committees") {
    const {
      headings,
      keys,
      renders,
      filters,
      filterModes,
      filterSearch,
      onFilters,
      sorters,
    } = createCommitteesColumns(localApprovedVotesIds, addVote, removeVote);
    return headings.map((heading, index) => {
      return {
        title: (): JSX.Element => <TableHeading heading={heading} />,
        dataIndex: keys[index],
        key: keys[index],
        render: renders[index],
        filters: filters[index],
        filterMode: filterModes[index],
        filterSearch: filterSearch[index],
        onFilter: onFilters[index],
        sorter: sorters[index],
      };
    });
  } else {
    const {
      headings,
      keys,
      renders,
      filters,
      filterModes,
      filterSearch,
      onFilters,
      sorters,
    } = createWitnessColumns(localApprovedVotesIds, addVote, removeVote);
    return headings.map((heading, index) => {
      return {
        title: (): JSX.Element => <TableHeading heading={heading} />,
        dataIndex: keys[index],
        key: keys[index],
        render: renders[index],
        filters: filters[index],
        filterMode: filterModes[index],
        filterSearch: filterSearch[index],
        onFilter: onFilters[index],
        sorter: sorters[index],
      };
    });
  }
};
