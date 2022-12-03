import counterpart from "counterpart";
import { uniq } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { useActivity, useFormDate } from "../../../hooks";
import { useViewportContext } from "../../../providers";
import { ActivityRow } from "../../../types";
import { ActivityColumns, ActivityColumnType } from "../components";

import {
  UseActivityTableArgs,
  UseActivityTableResult,
} from "./useActivityTable.types";

export function useActivityTable({
  userName,
  isWalletActivityTable = false,
  isNotificationTab,
  notifications,
  markTheNotificationAsReadOrUnread,
}: UseActivityTableArgs): UseActivityTableResult {
  const [activitiesRows, _setActivitiesRows] = useState<ActivityRow[]>([]);
  const [activityColumns, setActivityColumns] = useState<ActivityColumnType[]>(
    []
  );
  const [searchDataSource, setSearchDataSource] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { getActivitiesRows } = useActivity();
  const { sm } = useViewportContext();
  const { convertUTCDateToLocalDate } = useFormDate();
  const columns = ActivityColumns(
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

  const setActivitiesRows = useCallback(async () => {
    try {
      setLoading(true);
      const activityRows = await getActivitiesRows(
        userName as string,
        isWalletActivityTable
      );

      const newNotifications = notifications.map((e) => {
        return {
          ...e.activity,
          status: e.unread,
        } as ActivityRow;
      });

      const timeModifiedActivityRows = activityRows.map((activityRow) => {
        return {
          ...activityRow,
          time: formDate(activityRow.time),
        } as ActivityRow;
      });

      const rowsDataSource = isNotificationTab
        ? newNotifications
        : timeModifiedActivityRows;

      const allTypes = timeModifiedActivityRows.map(
        (activity) => activity.type
      );
      const uniqTypes = uniq(allTypes);
      const updatedColumns = columns.map((column) => {
        switch (true) {
          case column.key === "type":
            column.filters = uniqTypes.map((type) => {
              return {
                text: counterpart.translate(
                  `transaction.trxTypes.${type}.title`
                ),
                value: type,
              };
            });
            break;
        }
        return { ...column };
      });
      setActivityColumns(updatedColumns);
      _setActivitiesRows(rowsDataSource);
      setSearchDataSource(rowsDataSource);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }, [
    setLoading,
    _setActivitiesRows,
    isWalletActivityTable,
    userName,
    isNotificationTab,
    columns,
  ]);

  useEffect(() => {
    setActivitiesRows();
  }, [userName, notifications]);

  return {
    activitiesRows,
    loading,
    activityColumns,
    searchDataSource,
    setSearchDataSource,
  };
}
