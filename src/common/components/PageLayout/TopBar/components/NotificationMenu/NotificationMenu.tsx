import counterpart from "counterpart";
import Link from "next/link";
import { useCallback } from "react";

import { renderPaginationItem, UserLinkExtractor } from "../../../..";
import { Checkbox, List, Switch, Tooltip } from "../../../../../../ui/src";
import { useFormDate } from "../../../../../hooks";
import { useNotificationsContext } from "../../../../../providers";
import { Notification } from "../../../../../types";

import * as Styled from "./NotificationMenu.styled";
import { useNotificationMenu } from "./hooks";

export const NotificationMenu = (): JSX.Element => {
  const {
    notifications,
    markAllNotificationsRead,
    hasUnreadMessages,
    loadingNotifications,
    markTheNotificationAsReadOrUnread,
  } = useNotificationsContext();
  const { showUnreadOnly, setShowUnreadOnly, groupedNotificationsByDate } =
    useNotificationMenu({
      notifications,
      loadingNotifications,
    });
  const { formLocalDate } = useFormDate();

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const markAllReadLink = hasUnreadMessages ? (
    <span
      className={"mark-all"}
      onClick={() => {
        markAllNotificationsRead();
      }}
    >
      {counterpart.translate(`links.mark_all_read`)}
    </span>
  ) : (
    ""
  );

  const hasGroupedNotificationsByDate =
    groupedNotificationsByDate &&
    Object.keys(groupedNotificationsByDate).length > 0;

  const renderTimeLabel = (time: string) => {
    const renderYesterdayOrOlder =
      yesterday.toDateString() === new Date(formLocalDate(time)).toDateString()
        ? counterpart.translate(`field.labels.yesterday`)
        : formLocalDate(time);
    const renderTodayOrOlder =
      today.toDateString() === new Date(formLocalDate(time)).toDateString()
        ? counterpart.translate(`field.labels.today`)
        : renderYesterdayOrOlder;
    return (
      <Styled.TimeSpecification>{renderTodayOrOlder}</Styled.TimeSpecification>
    );
  };

  const renderListItem = useCallback(
    (item: Notification) => (
      <Styled.ActivityListItem key={item.activity.key}>
        <Styled.ActivitysItemContent>
          <div className="activity-info">
            <Tooltip
              placement="top"
              title={`${
                item.unread
                  ? counterpart.translate(`tooltips.mark_read`)
                  : counterpart.translate(`tooltips.mark_unread`)
              }`}
            >
              <Checkbox
                checked={!item.unread}
                onChange={(e) => {
                  markTheNotificationAsReadOrUnread(
                    item.activity.id,
                    !e.target.checked
                  );
                }}
              ></Checkbox>
              <span className="activity-info-value">
                <UserLinkExtractor infoString={item.activity.info} />
              </span>
            </Tooltip>
          </div>
        </Styled.ActivitysItemContent>
      </Styled.ActivityListItem>
    ),
    [markTheNotificationAsReadOrUnread]
  );

  return (
    <Styled.NotificationMenuCard
      onClick={(e) => {
        e.stopPropagation();
      }}
      bordered={false}
    >
      <Styled.ControlsContainer hasUnread={hasUnreadMessages}>
        {markAllReadLink}

        <div className={"unread-switch"}>
          <Switch
            size="small"
            onChange={() => setShowUnreadOnly(!showUnreadOnly)}
            defaultChecked={showUnreadOnly}
          />
          <span>{counterpart.translate(`buttons.show_only_unread`)}</span>
        </div>
      </Styled.ControlsContainer>
      <Styled.ListsContainer
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {hasGroupedNotificationsByDate && !loadingNotifications ? (
          <>
            {Object.keys(groupedNotificationsByDate).map((time) => {
              const dataSource = groupedNotificationsByDate[time];

              return (
                <div key={time}>
                  {renderTimeLabel(time)}
                  <List
                    loading={loadingNotifications}
                    pagination={
                      loadingNotifications
                        ? false
                        : {
                            hideOnSinglePage: true,
                            defaultPageSize: 2,
                            defaultCurrent: 1,
                            showLessItems: true,
                            showSizeChanger: false,
                            size: "small",
                            itemRender: renderPaginationItem(),
                          }
                    }
                    itemLayout="vertical"
                    dataSource={dataSource}
                    renderItem={renderListItem}
                  />
                </div>
              );
            })}
          </>
        ) : (
          <List
            loading={loadingNotifications}
            itemLayout="vertical"
            dataSource={[]}
          />
        )}
      </Styled.ListsContainer>

      <Styled.AllActivityContainer>
        <Link href={`/profile?tab=activities`}>
          {counterpart.translate(`links.see_all_account_activity`)}
        </Link>
      </Styled.AllActivityContainer>
    </Styled.NotificationMenuCard>
  );
};
