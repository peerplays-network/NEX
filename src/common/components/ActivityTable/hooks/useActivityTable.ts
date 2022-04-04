import { ChainTypes } from "peerplaysjs-lib";
import { useCallback, useEffect, useState } from "react";

import { breakpoints } from "../../../../ui/src/breakpoints";
import { useAccount, useAccountHistory, useAsset } from "../../../hooks";
import { Amount, BlockHeader, Fee, History } from "../../../types";
import { usePeerplaysApiContext } from "../../PeerplaysApiProvider";
import { useUserContext } from "../../UserProvider";
import { useViewportContext } from "../../ViewportProvider";

import { ActivityRow, UseActivityTable } from "./useActivityTable.types";

export function useActivityTable(): UseActivityTable {
  const [activitiesTable, _setActivitiesTable] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { dbApi } = usePeerplaysApiContext();
  const { id } = useUserContext();
  const { width } = useViewportContext();
  const { formAssetBalanceById, getDefaultAsset, getAssetById, setPrecision } =
    useAsset();
  const { getUserNameById } = useAccount();
  const { getAccountHistoryById } = useAccountHistory();

  const formDate = useCallback(
    (
      date: string | number | Date,
      pattern = ["day", "month", "date", "year"]
    ): string => {
      const newDate = String(new Date(date)).split(" ");
      const dateObj: {
        [segment: string]: string;
      } = {
        day: newDate[0] + ",",
        date: newDate[2],
        month: newDate[1],
        year: newDate[3],
        time: newDate[4],
      };
      if (width > breakpoints.sm) return String(date).replace("T", " ");
      return (
        pattern.map((el: string) => dateObj[el]).join(" ") +
        " | " +
        dateObj.time
      );
    },
    [width]
  );

  const formActivityDescription: {
    [activityType: string]: (operation: any, result?: any) => Promise<string>;
  } = {
    account_create: async ({
      registrar,
      name,
    }: {
      registrar: string;
      name: string;
    }) => {
      const registrarName = await getUserNameById(registrar);
      const userName = await getUserNameById(name);
      return `${registrarName} registered the account ${userName}`;
    },
    account_upgrade: async ({
      account_to_upgrade,
    }: {
      account_to_upgrade: string;
    }) => {
      const user = await getUserNameById(account_to_upgrade);
      return `${user} upgraded account to lifetime member`;
    },
    worker_create: async ({ owner }: { owner: string }) => {
      const user = await getUserNameById(owner);
      return `${user} created a worker proposal with daily pay of ${getDefaultAsset()}`;
    },
    account_update: async ({ account }: { account: string }) => {
      const user = await getUserNameById(account);
      return `${user} updated account data`;
    },
    transfer: async ({
      from,
      to,
      amount,
    }: {
      from: string;
      to: string;
      amount: Amount;
    }) => {
      const asset = await formAssetBalanceById(amount.asset_id, amount.amount);
      const sender = await getUserNameById(from);
      const receiver = await getUserNameById(to);
      return `${sender} send ${asset.amount} ${asset.symbol} to ${receiver}`;
    },
    limit_order_cancel: async ({
      fee_paying_account,
      order,
    }: {
      fee_paying_account: string;
      order: string;
    }) => {
      const id = order.split(".")[2];
      const user = await getUserNameById(fee_paying_account);
      return `${user} cancelled order #${id}`;
    },
    limit_order_create: async (
      {
        seller,
        min_to_receive,
        amount_to_sell,
      }: {
        seller: string;
        min_to_receive: Amount;
        amount_to_sell: Amount;
      },
      id: string
    ) => {
      const buyAsset = await formAssetBalanceById(
        min_to_receive.asset_id,
        min_to_receive.amount
      );
      const sellAsset = await formAssetBalanceById(
        amount_to_sell.asset_id,
        amount_to_sell.amount
      );
      const creator = await getUserNameById(seller);
      const orderId = id.split(".")[2];
      const buyAmount = `${buyAsset.amount} ${buyAsset.symbol}`;
      const sellAmount = `${sellAsset.amount} ${sellAsset.symbol}`;
      return `${creator} placed order #${orderId} to buy ${buyAmount} for ${sellAmount}`;
    },
    fill_order: async ({
      receives,
      pays,
      order_id,
      account_id,
    }: {
      receives: Amount;
      pays: Amount;
      order_id: string;
      account_id: string;
    }) => {
      const buyAsset = await formAssetBalanceById(
        receives.asset_id,
        receives.amount
      );
      const sellAsset = await formAssetBalanceById(pays.asset_id, pays.amount);
      const id = order_id.split(".")[2];
      const user = await getUserNameById(account_id);
      const paysAmount = `${buyAsset.amount} ${buyAsset.symbol}`;
      const receivesAmmount = `${sellAsset.amount} ${sellAsset.symbol}`;
      return `%${user} bought ${paysAmount} for ${receivesAmmount} for order #${id}`;
    },
    asset_fund_fee_pool: async ({
      from_account,
      asset_id,
      amount,
    }: {
      from_account: string;
      asset_id: string;
      amount: number;
    }) => {
      const asset = await formAssetBalanceById(asset_id, amount);
      const from = await getUserNameById(from_account);
      return `${from} funded ${asset.symbol} fee pool with ${asset.amount}`;
    },
    account_whitelist: async ({
      account_to_list,
      authorizing_account,
      new_listing,
    }: {
      account_to_list: string;
      authorizing_account: string;
      new_listing: number;
    }) => {
      const statuses: {
        readonly [status: number]: string;
      } = {
        0: "unlisted",
        1: "whitelisted",
        2: "blacklisted",
      };
      const issuerName = await getUserNameById(account_to_list);
      const listed = await getUserNameById(authorizing_account);
      return `${issuerName} ${statuses[new_listing]} the account ${listed}`;
    },
    asset_create: async ({
      symbol,
      issuer,
    }: {
      symbol: string;
      issuer: string;
    }) => {
      const issuerName = await getUserNameById(issuer);
      return `${issuerName} created the asset ${symbol}`;
    },
    asset_issue: async ({
      asset_to_issue,
      issue_to_account,
      issuer,
    }: {
      asset_to_issue: Amount;
      issue_to_account: string;
      issuer: string;
    }) => {
      const asset = await formAssetBalanceById(
        asset_to_issue.asset_id,
        asset_to_issue.amount
      );
      const issuerName = await getUserNameById(issuer);
      const receiver = await getUserNameById(issue_to_account);
      return `${issuerName} issued ${asset.amount} ${asset.symbol} to ${receiver}`;
    },
    asset_update: async ({
      issuer,
      asset_to_update,
    }: {
      issuer: string;
      asset_to_update: string;
    }) => {
      const issuerName = await getUserNameById(issuer);
      const asset = await getAssetById(asset_to_update);
      return `${issuerName} updated asset ${asset.symbol}`;
    },
    asset_claim_pool: async ({
      amount_to_claim,
      asset_id,
      issuer,
    }: {
      amount_to_claim: Amount;
      asset_id: string;
      issuer: string;
    }) => {
      const claimedAsset = await formAssetBalanceById(
        amount_to_claim.asset_id,
        amount_to_claim.amount
      );
      const issuerName = await getUserNameById(issuer);
      const asset = await getAssetById(asset_id);
      return `${issuerName} claimed ${claimedAsset.amount} ${claimedAsset.symbol} from ${asset.symbol} fee pool`;
    },
    asset_update_issuer: async ({
      new_issuer,
      asset_to_update,
      issuer,
    }: {
      new_issuer: string;
      asset_to_update: string;
      issuer: string;
    }) => {
      const issuerName = await getUserNameById(issuer);
      const asset = await getAssetById(asset_to_update);
      const newOwner = await getUserNameById(new_issuer);
      return `${issuerName} transferred rights for ${asset.symbol} to ${newOwner}`;
    },
    asset_update_feed_producers: async ({
      asset_to_update,
      issuer,
    }: {
      asset_to_update: string;
      issuer: string;
    }) => {
      const issuerName = await getUserNameById(issuer);
      const asset = await getAssetById(asset_to_update);
      return `${issuerName} updated the feed producers for the asset ${asset.symbol}`;
    },
  };

  const formActivityRow = useCallback(
    async (activity: History): Promise<ActivityRow> => {
      const fee = activity.op[1].fee as Fee;
      const blockHeader: BlockHeader = await dbApi("get_block_header", [
        activity.block_num,
      ]);
      const time = formDate(blockHeader.timestamp);
      const feeAsset = await getAssetById(fee.asset_id);
      const operationsNames = Object.keys(ChainTypes.operations);
      const operationType = operationsNames[activity.op[0]].toLowerCase();

      const activityDescription: string = await formActivityDescription[
        operationType
      ](activity.op[1], activity.result[1]);

      return {
        key: activity.id,
        time,
        type: operationType,
        info: activityDescription,
        id: activity.id,
        fee: `${setPrecision(false, fee.amount, feeAsset.precision)} ${
          feeAsset.symbol
        }`,
      } as ActivityRow;
    },
    [dbApi]
  );

  const setActivitiesTable = useCallback(async () => {
    try {
      setLoading(true);
      let history = await getAccountHistoryById(id);
      // this should change based on designer decision
      history = history.filter(
        (el: { op: number[] }) =>
          (el.op[0] >= 0 && el.op[0] <= 8) ||
          el.op[0] === 34 ||
          el.op[0] === 10 ||
          el.op[0] === 11 ||
          el.op[0] === 13 ||
          el.op[0] === 14 ||
          el.op[0] === 16
      );

      const activityRows = await Promise.all(history.map(formActivityRow));
      _setActivitiesTable(activityRows);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }, [
    formActivityRow,
    setLoading,
    id,
    getAccountHistoryById,
    _setActivitiesTable,
  ]);

  useEffect(() => {
    setActivitiesTable();
  }, [id]);

  return { activitiesTable, loading };
}