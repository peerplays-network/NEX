import counterpart from "counterpart";
import Link from "next/link";
import { useCallback } from "react";

import {
  ActivityAndNotificationColumns,
  renderPaginationItem,
  UserLinkExtractor,
} from "../../..";
import { useNotificationsContext } from "../../../../providers";
import { ActivityRow } from "../../../../types";
import { ActivityAndNotificationTag } from "../ActivityAndNotificationTag";

import * as Styled from "./ActivityAndNotificationList.styled";

type Props = {
  activitiesAndNotificationsRows: ActivityRow[];
  loading: boolean;
  isNotificationTab: boolean;
};

export const ActivityAndNotificationList = ({
  activitiesAndNotificationsRows,
  loading,
  isNotificationTab,
}: Props): JSX.Element => {
  const { markTheNotificationAsReadOrUnread } = useNotificationsContext();
  const columns = ActivityAndNotificationColumns(
    isNotificationTab,
    markTheNotificationAsReadOrUnread
  );
  const renderListItem = useCallback(
    (item: unknown, _index: number) => {
      const activityAndNotificationRow = item as ActivityRow;
      function handleReadUnreadClick() {
        markTheNotificationAsReadOrUnread(
          activityAndNotificationRow.id,
          !activityAndNotificationRow.status
        );
      }
      return (
        <Styled.ActivityListItem key={activityAndNotificationRow.key}>
          <Styled.ActivityItemContent>
            <div className="activity-info">
              <span className="activity-info-title">{columns[0].title()}</span>
              <span className="activity-info-value">
                {activityAndNotificationRow.time}
              </span>
            </div>
            <div className="activity-info">
              <span className="activity-info-title">{columns[2].title()}</span>
              <span className="activity-info-value">
                <UserLinkExtractor
                  infoString={activityAndNotificationRow.info}
                />
              </span>
            </div>
            <div className="activity-info">
              <span className="activity-info-title">{columns[3].title()}</span>
              <span className="activity-info-value">
                {activityAndNotificationRow.id}
              </span>
            </div>
            <div className="activity-info">
              <span className="activity-info-title">{columns[4].title()}</span>
              <span className="activity-info-value">
                <Link
                  href={`blockchain/${activityAndNotificationRow.block_num}/${activityAndNotificationRow.transaction_id}`}
                >
                  {activityAndNotificationRow.transaction_id}
                </Link>
              </span>
            </div>
            <div className="activity-info">
              <span className="activity-info-title">{columns[5].title()}</span>
              <span className="activity-info-value">
                {activityAndNotificationRow.fee}
              </span>
            </div>
            <div className="activity-info">
              <span className="activity-info-title">{columns[1].title()}</span>
              <span className="activity-info-value">
                <ActivityAndNotificationTag
                  type={activityAndNotificationRow.type}
                />
              </span>
            </div>
            {isNotificationTab ? (
              <div className="activity-info">
                <span className="activity-info-title">
                  {columns[5].title()}
                </span>
                <span className="activity-info-value">
                  {activityAndNotificationRow.status ? (
                    <Styled.NotificationTableStatusButton
                      onClick={handleReadUnreadClick}
                    >
                      {counterpart.translate(
                        `pages.profile.notification.unread`
                      )}
                    </Styled.NotificationTableStatusButton>
                  ) : (
                    counterpart.translate(`pages.profile.notification.read`)
                  )}
                </span>
              </div>
            ) : (
              ""
            )}
          </Styled.ActivityItemContent>
        </Styled.ActivityListItem>
      );
    },
    [markTheNotificationAsReadOrUnread, columns, isNotificationTab]
  );

  return (
    <Styled.StyledList
      itemLayout="vertical"
      dataSource={activitiesAndNotificationsRows}
      loading={loading}
      pagination={{
        hideOnSinglePage: true,
        defaultPageSize: 2,
        defaultCurrent: 1,
        showLessItems: true,
        showSizeChanger: false,
        size: "small",
        itemRender: renderPaginationItem(),
      }}
      renderItem={renderListItem}
    />
  );
};
