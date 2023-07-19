import counterpart from "counterpart";
import { uniq } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { useActivity, useFormDate } from "../../../hooks";
import { useViewportContext } from "../../../providers";
import { ActivityRow } from "../../../types";
import {
  ActivityAndNotificationColumns,
  ActivityAndNotificationType,
} from "../components";

import {
  UseActivityAndNotificationResult,
  UseActivityAndNotificationTableArgs,
} from "./useActivityAndNotificationTable.types";

export function useActivityAndNotificationTable({
  userName,
  isWalletActivityTable = false,
  isNotificationTab,
  notifications,
  markTheNotificationAsReadOrUnread,
}: UseActivityAndNotificationTableArgs): UseActivityAndNotificationResult {
  const [activitiesAndNotificationsRows, _setActivitiesAndNotificationsRows] =
    useState<ActivityRow[]>([]);
  const [activityAndNotificationColumns, setActivityAndNotificationColumns] =
    useState<ActivityAndNotificationType[]>([]);
  const [searchDataSource, setSearchDataSource] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getActivitiesRows } = useActivity();
  const { sm } = useViewportContext();
  const { convertUTCDateToLocalDate } = useFormDate();
  const columns = ActivityAndNotificationColumns(
    isNotificationTab,
    markTheNotificationAsReadOrUnread
  );

  const formDate = useCallback(
    (
      date: string | number | Date,
      pattern = ["day", "month", "date", "year"]
    ): string => {
      const localDate = convertUTCDateToLocalDate(new Date(date));
      const newDate = String(localDate).split(" ");
      const dateObj: {
        [segment: string]: string;
      } = {
        day: newDate[0] + ",",
        date: newDate[2],
        month: newDate[1],
        year: newDate[3],
        time: newDate[4],
      };
      if (sm) {
        return (
          pattern.map((el: string) => dateObj[el]).join(" ") +
          " | " +
          dateObj.time
        );
      }

      return `${dateObj.year}-${
        localDate.getMonth() + 1
      }-${localDate.getDate()} ${dateObj.time}`;
    },
    [sm]
  );

  const setActivitiesAndNotificationsRows = useCallback(async () => {
    try {
      setLoading(true);
      let rowsDataSource, uniqTypes: string[];
      const activityRows = await getActivitiesRows(
        userName as string,
        isWalletActivityTable
      );

      if (isNotificationTab) {
        rowsDataSource = notifications.map(({ activity, unread }) => {
          return {
            ...activity,
            status: unread,
          } as ActivityRow;
        });
      } else {
        rowsDataSource = activityRows.map((activityRow) => {
          return {
            ...activityRow,
            time: formDate(activityRow.time),
          } as ActivityRow;
        });
        const allTypes = rowsDataSource.map((activity) => activity.type);
        uniqTypes = uniq(allTypes);
      }

      const updatedColumns = columns.map((column) => {
        if (column.key === "type") {
          column.filters = uniqTypes.map((type: string) => {
            return {
              text: counterpart.translate(`transaction.trxTypes.${type}.title`),
              value: type,
            };
          });
        }
        return { ...column };
      });

      setActivityAndNotificationColumns(updatedColumns);
      _setActivitiesAndNotificationsRows(rowsDataSource);
      setSearchDataSource(rowsDataSource);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }, [
    setLoading,
    _setActivitiesAndNotificationsRows,
    isWalletActivityTable,
    userName,
    isNotificationTab,
    columns,
  ]);

  useEffect(() => {
    setActivitiesAndNotificationsRows();
  }, [userName, notifications]);

  return {
    activitiesAndNotificationsRows,
    loading,
    activityAndNotificationColumns,
    searchDataSource,
    setSearchDataSource,
  };
}
