import counterpart from "counterpart";
import Link from "next/link";

import { TableHeading } from "../../../../common/components";
import { AssetActionButton } from "../AssetActionButton";
import { AssetTableRow } from "../AssetsTable/hooks";

const headings = ["symbol", "name", "available", "in_orders", "actions"];
const keys = ["symbol", "name", "available", "inOrders", "actions"];
const renders: (
  actionType?: "send_receive" | "receive_select" | "send_select"
) => (((_text: string, record: AssetTableRow) => JSX.Element) | undefined)[] = (
  actionType = "send_receive"
) => [
  undefined,
  undefined,
  undefined,
  undefined,
  (_text: string, record: AssetTableRow): JSX.Element => {
    switch (actionType) {
      case "send_receive":
        return (
          <>
            <AssetActionButton
              txt={counterpart.translate(`buttons.send`)}
              href={`/wallet/${record.symbol}?tab=send`}
            />
            <AssetActionButton
              txt={counterpart.translate(`buttons.receive`)}
              href={`/wallet/${record.symbol}?tab=receive`}
            />
          </>
        );
      case "receive_select":
        return (
          <Link href={`/wallet/${record.symbol}?tab=receive`}>
            {counterpart.translate(`pages.wallet.select_this_asset`)}
          </Link>
        );
      default:
        return (
          <Link href={`/wallet/${record.symbol}?tab=send`}>
            {counterpart.translate(`pages.wallet.select_this_asset`)}
          </Link>
        );
    }
  },
];
const filters = [undefined, undefined, undefined, undefined, undefined];
const filterModes = ["menu", "menu", undefined, undefined, undefined];
const filterSearch = [false, false, undefined, undefined, undefined];

const onFilters = [
  (value: string, record: AssetTableRow): boolean =>
    record.symbol.includes(value),
  (value: string, record: AssetTableRow): boolean =>
    record.name.includes(value),
  undefined,
  undefined,
  undefined,
];
const sorters = [
  undefined,
  undefined,
  (a: { available: number }, b: { available: number }) =>
    a.available - b.available,
  (a: { inOrders: string }, b: { inOrders: string }) =>
    Number(a.inOrders) - Number(b.inOrders),
  undefined,
];

export type AssetColumnType = {
  title: () => JSX.Element;
  dataIndex: string;
  key: string;
  render: ((_text: string, record: AssetTableRow) => JSX.Element) | undefined;
  filters:
    | {
        text: string;
        value: string;
      }[]
    | undefined;
  filterMode: string | undefined;
  filterSearch: boolean | undefined;
  onFilter: ((value: string, record: AssetTableRow) => boolean) | undefined;
  sorter:
    | ((
        a: {
          available: number;
        },
        b: {
          available: number;
        }
      ) => number)
    | ((
        a: {
          inOrders: string;
        },
        b: {
          inOrders: string;
        }
      ) => number)
    | undefined;
};

export const createAssetsColumns: (
  actionType?: "send_receive" | "receive_select" | "send_select",
  showActions?: boolean
) => AssetColumnType[] = (actionType = "send_receive", showActions = true) => {
  if (showActions === false && headings.length > 4) {
    headings.splice(-1);
  }
  return headings.map((heading, index) => {
    return {
      title: (): JSX.Element => <TableHeading heading={heading} />,
      dataIndex: keys[index],
      key: keys[index],
      render: renders(actionType)[index],
      filters: filters[index],
      filterMode: filterModes[index],
      filterSearch: filterSearch[index],
      onFilter: onFilters[index],
      sorter: sorters[index],
    };
  });
};
