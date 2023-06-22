import Link from "next/link";

import { TableHeading } from "../../../../../common/components";
import { AccountColumnType } from "../hooks";

const headings = ["account_id", "account_name", "balance"];
const keys = ["AccountID", "AccountName", "Balance"];
const renders = [
  (accountID: string): JSX.Element => <a>{accountID}</a>,
  (accountName: string): JSX.Element => (
    <Link href={`/user/${accountName}`} target="_blank">
      {accountName}
    </Link>
  ),
  undefined,
];
const filters = [undefined, undefined, undefined];
const filterModes = [undefined, undefined, undefined];
const filterSearch = [undefined, undefined, undefined];
const onFilters = [
  undefined,
  // (value: string, record: AccountsTableRow): boolean =>
  //   record.AccountName.includes(value),
  undefined,
  undefined,
  // undefined,
];
const sorters = [
  // (a: { accountId: string }, b: { accountId: string }) =>
  //   a.accountId - b.accountId,
  // (a: { accountName: string }, b: { accountName: string }) =>
  //   a.accountName - b.accountName,
  // (a: { balance: number }, b: { balance: number }) => a.balance - b.balance,
  // (a: { transactionCount: number }, b: { transactionCount: number }) =>
  //   a.transactionCount - b.transactionCount
  undefined,
  undefined,
  undefined,
  // undefined,
  //   (a: { transaction: number }, b: { transaction: number }) =>
  //     a.transaction - b.transaction,
];

export const AccountColumns: AccountColumnType[] = headings.map(
  (heading, index) => {
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
  }
);
