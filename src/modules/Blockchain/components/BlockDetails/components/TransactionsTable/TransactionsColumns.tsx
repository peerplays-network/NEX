import Link from "next/link";

import { TableHeading } from "../../../../../../common/components";
import { TransactionRow } from "../../hooks/useBlockDetails.types";

import * as Styled from "./TransactionsTable.styled";

export const TransactionsColumns = (
  block: number
): {
  title: () => JSX.Element;
  dataIndex: string;
  key: string;
  render:
    | ((rank: number) => JSX.Element)
    | ((id: string, record: TransactionRow) => JSX.Element)
    | ((expiration: string) => JSX.Element)
    | ((operations: unknown[]) => JSX.Element)
    | ((extensions: unknown[]) => JSX.Element)
    | undefined;
  filters: unknown | undefined;
  filterMode: string | undefined;
  filterSearch: boolean | undefined;
  onFilter: unknown | undefined;
  sorter:
    | ((a: { rank: number }, b: { rank: number }) => number)
    | ((a: { id: string }, b: { id: string }) => number)
    | ((a: { expiration: string }, b: { expiration: string }) => number)
    | ((a: { operations: unknown[] }, b: { operations: unknown[] }) => number)
    | ((a: { refBlockPrefix: number }, b: { refBlockPrefix: number }) => number)
    | ((a: { refBlockNum: number }, b: { refBlockNum: number }) => number)
    | ((a: { extensions: unknown[] }, b: { extensions: unknown[] }) => number)
    | undefined;
}[] => {
  const headings = [
    "rank",
    "transaction_hash",
    "expiration",
    "operations",
    "ref_block_prefix",
    "ref_block_num",
    "extensions",
  ];
  const keys = [
    "rank",
    "id",
    "expiration",
    "operations",
    "refBlockPrefix",
    "refBlockNum",
    "extensions",
  ];
  const renders = [
    (rank: number): JSX.Element => <span>{rank}</span>,
    (id: string, record: TransactionRow): JSX.Element => (
      <Link href={`/blockchain/${block}/${record.id}`}>
        <Styled.CenterEllipsis>
          <span className="ellipsis">{id}</span>
          <span className="indent">{id}</span>
        </Styled.CenterEllipsis>
      </Link>
    ),
    (expiration: string): JSX.Element => (
      <Styled.TimeStamp>{expiration}</Styled.TimeStamp>
    ),
    (operations: unknown[]): JSX.Element => <span>{operations.length}</span>,
    undefined,
    undefined,
    (extensions: unknown[]): JSX.Element => <span>{extensions.length}</span>,
  ];
  const filters = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const filterModes = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const filterSearch = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const onFilters = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const sorters = [
    (a: { rank: number }, b: { rank: number }) => a.rank - b.rank,
    undefined,
    (a: { expiration: string }, b: { expiration: string }) =>
      new Date(a.expiration).getTime() - new Date(b.expiration).getTime(),
    (a: { operations: unknown[] }, b: { operations: unknown[] }) =>
      a.operations.length - b.operations.length,
    (a: { refBlockPrefix: number }, b: { refBlockPrefix: number }) =>
      a.refBlockPrefix - b.refBlockPrefix,
    (a: { refBlockNum: number }, b: { refBlockNum: number }) =>
      a.refBlockNum - b.refBlockNum,
    (a: { extensions: unknown[] }, b: { extensions: unknown[] }) =>
      a.extensions.length - b.extensions.length,
  ];

  const columns = headings.map((heading, index) => {
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

  return columns;
};
