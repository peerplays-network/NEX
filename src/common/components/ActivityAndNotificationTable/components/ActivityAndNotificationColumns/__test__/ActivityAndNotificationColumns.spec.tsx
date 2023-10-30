import { ActivityRow } from "../../../../../types";
import {
  ActivityAndNotificationColumns,
  ActivityAndNotificationType,
} from "../ActivityAndNotificationColumns";

describe("ActivityAndNotificationColumns", () => {
  let activity1: ActivityRow;
  let activity2: ActivityRow;
  let activityColumns: ActivityAndNotificationType[];
  let notificationColumns: ActivityAndNotificationType[];

  beforeEach(() => {
    activity1 = {
      fee: "20 TEST",
      id: "1.11.2996873",
      info: "[userlink = supertest1], send 1 TEST to , [userlink = newdemo1]",
      key: "1.11.2996873",
      status: true,
      time: "2022-12-03T12:11:54",
      type: "transfer",
      block_num: 1,
      trx_in_block: 0,
      transaction_id: "",
    };
    activity2 = {
      fee: "20 TEST",
      id: "1.11.2996874",
      info: "[userlink = supertest1], send 1 TEST to , [userlink = newdemo1]",
      key: "1.11.2996875",
      status: false,
      time: "2022-12-01T11:11:53",
      type: "account_update",
      block_num: 1,
      trx_in_block: 0,
      transaction_id: "",
    };
    activityColumns = ActivityAndNotificationColumns(false, () => null);
    notificationColumns = ActivityAndNotificationColumns(true, () => null);
  });

  it("should return the correct columns for the notification tab", () => {
    expect(notificationColumns).toHaveLength(7);
  });

  it("should return the correct columns for the activity tab", () => {
    expect(activityColumns).toHaveLength(6);
  });

  it("should return the correct onFilter function for the type column", () => {
    const typeColumn = notificationColumns[1];
    expect(typeColumn).toHaveProperty("onFilter", expect.any(Function));

    const filterFn = typeColumn.onFilter as (
      value: string,
      record: ActivityRow
    ) => boolean;
    expect(filterFn("transfer", activity1)).toBe(true);
    expect(filterFn("transfer", activity2)).toBe(false);
    expect(filterFn("account_update", activity1)).toBe(false);

    const typeColumn2 = activityColumns[1];
    expect(typeColumn2).toHaveProperty("onFilter", expect.any(Function));

    const filterFn2 = typeColumn2.onFilter as (
      value: string,
      record: ActivityRow
    ) => boolean;
    expect(filterFn2("transfer", activity1)).toBe(true);
    expect(filterFn2("transfer", activity2)).toBe(false);
    expect(filterFn2("account_update", activity1)).toBe(false);
  });

  it("should return the correct sorter function for the time column", () => {
    const timeColumn = notificationColumns[0];
    expect(timeColumn).toHaveProperty("sorter", expect.any(Function));

    const sorterFn = timeColumn.sorter as (
      a: { time: string },
      b: { time: string }
    ) => number;
    expect(sorterFn(activity1, activity1)).toBe(0);

    const timeColumn2 = activityColumns[0];
    expect(timeColumn2).toHaveProperty("sorter", expect.any(Function));

    const sorterFn2 = timeColumn2.sorter as (
      a: { time: string },
      b: { time: string }
    ) => number;
    expect(sorterFn2(activity1, activity1)).toBe(0);
  });
});
