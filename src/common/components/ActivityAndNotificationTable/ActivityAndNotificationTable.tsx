import { SearchTableInput } from "ant-table-extensions";
import { ColumnsType } from "antd/lib/table";
import counterpart from "counterpart";
import { useRef } from "react";

import { renderPaginationItem, TableDownloader } from "..";
import { SearchOutlined } from "../../../ui/src";
import { useNotificationsContext, useViewportContext } from "../../providers";

import * as Styled from "./ActivityAndNotificationTable.styled";
import { ActivityAndNotificationList } from "./components";
import { useActivityAndNotificationTable } from "./hooks";

type Props = {
  userName?: string;
  isWalletActivityTable?: boolean;
  className?: string;
  showHeader?: boolean;
  isNotificationTab?: boolean;
};

export const ActivityAndNotificationTable = ({
  userName,
  isWalletActivityTable = false,
  className,
  showHeader = false,
  isNotificationTab = false,
}: Props): JSX.Element => {
  const { notifications, markTheNotificationAsReadOrUnread } =
    useNotificationsContext();
  const {
    activitiesAndNotificationsRows,
    loading,
    activityAndNotificationColumns,
    searchDataSource,
    setSearchDataSource,
  } = useActivityAndNotificationTable({
    userName,
    isWalletActivityTable,
    isNotificationTab,
    notifications,
    markTheNotificationAsReadOrUnread,
  });
  const { md } = useViewportContext();
  const componentRef = useRef<HTMLDivElement>(null);

  return (
    <Styled.ActivityAndNotificationTableWrapper>
      {showHeader ? (
        <Styled.ActivityAndNotificationTableHeaderBar>
          <Styled.ActivityAndNotificationTableHeader>
            {counterpart.translate(
              `pages.profile.${
                isNotificationTab
                  ? `notification.my_notification`
                  : `activity.my_activity`
              }`
            )}
          </Styled.ActivityAndNotificationTableHeader>
          <SearchTableInput
            columns={activityAndNotificationColumns as ColumnsType<unknown>}
            dataSource={activitiesAndNotificationsRows}
            setDataSource={setSearchDataSource}
            inputProps={{
              placeholder: counterpart.translate(
                `pages.profile.${
                  isNotificationTab
                    ? `notification.search_notifications`
                    : `activity.search_activities`
                }`
              ),
              suffix: <SearchOutlined />,
            }}
            fuseProps={{
              ignoreLocation: true,
              useExtendedSearch: true,
            }}
          />
          {!isNotificationTab ? (
            <TableDownloader
              componentRef={componentRef}
              data={activitiesAndNotificationsRows}
            ></TableDownloader>
          ) : (
            ""
          )}
        </Styled.ActivityAndNotificationTableHeaderBar>
      ) : (
        ""
      )}
      {md ? (
        <ActivityAndNotificationList
          activitiesAndNotificationsRows={searchDataSource}
          loading={loading}
          isNotificationTab={isNotificationTab}
        />
      ) : (
        <Styled.ActivityAndNotificationTable
          columns={activityAndNotificationColumns as ColumnsType<unknown>}
          dataSource={searchDataSource}
          loading={loading}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 15,
            defaultCurrent: 1,
            showSizeChanger: false,
            showLessItems: true,
            size: "small",
            itemRender: renderPaginationItem(),
          }}
          size="small"
          className={`activity-table ${className ? className : ""}`}
        />
      )}
      <Styled.PrintTable>
        <div ref={componentRef}>
          <Styled.ActivityAndNotificationTable
            dataSource={activitiesAndNotificationsRows}
            columns={activityAndNotificationColumns as ColumnsType<unknown>}
            loading={loading}
            pagination={false}
          />
        </div>
      </Styled.PrintTable>
    </Styled.ActivityAndNotificationTableWrapper>
  );
};
