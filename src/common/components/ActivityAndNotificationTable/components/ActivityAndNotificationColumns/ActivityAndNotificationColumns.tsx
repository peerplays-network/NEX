import counterpart from "counterpart";
import Link from "next/link";

import { Tooltip } from "../../../../../ui/src";
import { ActivityRow } from "../../../../types";
import { TableHeading } from "../../../TableHeading";
import { UserLinkExtractor } from "../../../UserLinkExtractor";
import * as Styled from "../../ActivityAndNotificationTable.styled";
import { ActivityAndNotificationTag } from "../ActivityAndNotificationTag";

export type ActivityAndNotificationType = {
  title: () => JSX.Element;
  dataIndex: string;
  key: string;
  render:
    | ((value: string) => JSX.Element)
    | ((status: boolean, record: ActivityRow) => JSX.Element)
    | ((value: string, record: ActivityRow) => JSX.Element)
    | undefined;
  filters:
    | {
        text: string;
        value: string;
      }[]
    | undefined;
  filterMode: string | undefined;
  filterSearch: boolean | undefined;
  onFilter: ((value: string, record: ActivityRow) => boolean) | undefined;
  sorter:
    | ((
        a: {
          time: string;
        },
        b: {
          time: string;
        }
      ) => number)
    | undefined;
};

export const ActivityAndNotificationColumns = (
  isNotificationTab: boolean,
  markTheNotificationAsReadOrUnread: (id: string, unread: boolean) => void
): ActivityAndNotificationType[] => {
  const headings = isNotificationTab
    ? ["time", "type", "info", "id", "transaction_hash", "fee", "status"]
    : ["time", "type", "info", "id", "transaction_hash", "fee"];

  const keys = isNotificationTab
    ? ["time", "type", "info", "id", "transaction_id", "fee", "status"]
    : ["time", "type", "info", "id", "transaction_id", "fee"];

  const renders = isNotificationTab
    ? [
        //time
        undefined,
        //type
        (type: string): JSX.Element => (
          <ActivityAndNotificationTag type={type} />
        ),
        //info
        (value: string): JSX.Element => (
          <UserLinkExtractor infoString={value} />
        ),
        //id
        undefined,
        //transaction_id
        (value: string, record: ActivityRow): JSX.Element => (
          <Tooltip placement="top" title={record.transaction_id}>
            <Link
              href={`/blockchain/${record.block_num}/${record.transaction_id}`}
            >
              {value}
            </Link>
          </Tooltip>
        ),
        //fee
        undefined,
        //status
        (status: boolean, record: ActivityRow): JSX.Element => {
          function handleClick() {
            markTheNotificationAsReadOrUnread(record.id, !status);
          }
          return (
            <>
              {status ? (
                <Styled.NotificationTableStatusButton onClick={handleClick}>
                  {counterpart.translate(`pages.profile.notification.unread`)}
                </Styled.NotificationTableStatusButton>
              ) : (
                counterpart.translate(`pages.profile.notification.read`)
              )}
            </>
          );
        },
      ]
    : [
        //time
        undefined,
        //type
        (type: string): JSX.Element => (
          <ActivityAndNotificationTag type={type} />
        ),
        //info
        (value: string): JSX.Element => (
          <UserLinkExtractor infoString={value} />
        ),
        //id
        undefined,
        //transaction_id
        (value: string, record: ActivityRow): JSX.Element => (
          <Tooltip placement="top" title={record.transaction_id}>
            <Link
              href={`/blockchain/${record.block_num}/${record.transaction_id}`}
            >
              {value}
            </Link>
          </Tooltip>
        ),
        //fee
        undefined,
      ];

  const filters = isNotificationTab
    ? [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    : [undefined, undefined, undefined, undefined, undefined, undefined];

  const filterModes = isNotificationTab
    ? [undefined, "menu", undefined, undefined, undefined, undefined, undefined]
    : [undefined, "menu", undefined, undefined, undefined, undefined];

  const filterSearch = isNotificationTab
    ? [undefined, false, undefined, undefined, undefined, undefined, undefined]
    : [undefined, false, undefined, undefined, undefined, undefined];

  const onFilters = isNotificationTab
    ? [
        undefined,
        (value: string, record: ActivityRow): boolean =>
          record.type.includes(value),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    : [
        undefined,
        (value: string, record: ActivityRow): boolean =>
          record.type.includes(value),
        undefined,
        undefined,
        undefined,
        undefined,
      ];

  const sorters = isNotificationTab
    ? [
        (a: { time: string }, b: { time: string }) =>
          new Date(a.time).getTime() - new Date(b.time).getTime(),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ]
    : [
        (a: { time: string }, b: { time: string }) =>
          new Date(a.time).getTime() - new Date(b.time).getTime(),
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ];

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
      ellipsis: heading === "transaction_hash" ? true : false,
    };
  });
};
