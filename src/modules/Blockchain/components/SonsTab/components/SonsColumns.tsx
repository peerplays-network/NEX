import counterpart from "counterpart";
import Link from "next/link";

import {
  BITCOIN_NETWORK,
  ETHEREUM_NETWORK,
  HIVE_NETWORK,
} from "../../../../../api/params";
import { TableHeading } from "../../../../../common/components";
import * as Styled from "../SonsTab.styled";
import { SonsTableRow } from "../hooks";

const headings = ["rank", "name", "account_id", "url", "active_chains"];
const keys = ["rank", "name", "accountId", "url", "activeChains"];
const renders = [
  //rank
  undefined,
  //name
  (name: string): JSX.Element => (
    <Link href={`/user/${name}`} target="_blank">
      {name}
    </Link>
  ),
  //accountId
  undefined,
  //url
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
  //activeChains
  (activeChains: string[]): JSX.Element => (
    <>
      <span>{activeChains.join(", ")}</span>
    </>
  ),
];
const filters = [
  //rank
  undefined,
  //name
  undefined,
  //accountId
  undefined,
  //url
  undefined,
  //activeChains
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
];
const filterModes = [undefined, undefined, undefined, undefined, "menu"];
const filterSearch = [undefined, undefined, undefined, undefined, false];
const onFilters = [
  undefined,
  undefined,
  undefined,
  undefined,
  (value: string, record: SonsTableRow): boolean =>
    record.activeChains.includes(value),
];
const sorters = [
  (a: { rank: number }, b: { rank: number }) => a.rank - b.rank,
  undefined,
  undefined,
  undefined,
  undefined,
];

export type SonColumnType = {
  title: () => JSX.Element;
  dataIndex: string;
  key: string;
  render:
    | ((name: string) => JSX.Element)
    | ((url: string) => JSX.Element)
    | ((activeChains: string[]) => JSX.Element)
    | undefined;
  filters:
    | {
        text: string;
        value: string;
      }[]
    | undefined;
  filterMode: string | undefined;
  filterSearch: boolean | undefined;
  onFilter: ((value: string, record: SonsTableRow) => boolean) | undefined;
  sorter:
    | ((
        a: {
          rank: number;
        },
        b: {
          rank: number;
        }
      ) => number)
    | undefined;
};

export const SonsColumns: SonColumnType[] = headings.map((heading, index) => {
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
