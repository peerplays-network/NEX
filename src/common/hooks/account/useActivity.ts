import counterpart from "counterpart";
import { ChainTypes } from "peerplaysjs-lib";
import { useCallback } from "react";

import { useAccountHistory, useAsset, useBlockchain } from "..";
import { defaultToken } from "../../../api/params";
import { useAssetsContext, useUserContext } from "../../providers";
import { ActivityRow, Amount, Asset, Fee, History } from "../../types";

import { useAccount } from "./useAccount";
import { UseActivityResult } from "./useActivity.types";

export function useActivity(): UseActivityResult {
  const { getUserNameById, getAccountByName } = useAccount();
  const { formAssetBalanceById, getAssetById, setPrecision } = useAsset();
  const { defaultAsset } = useAssetsContext();
  const { getAccountHistoryById } = useAccountHistory();
  const { id } = useUserContext();
  const { getBlockHeader, getBlock2 } = useBlockchain();

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
      const [registrarName, userName] = await Promise.all([
        getUserNameById(registrar),
        getUserNameById(name),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.account_create.description`,
        {
          registrarName: `[userlink = ${registrarName}]`,
          userName: `[userlink=${userName}]`,
        }
      );
    },
    vesting_balance_create: async ({
      creator,
      amount,
    }: {
      creator: string;
      amount: Amount;
    }) => {
      const [asset, creatorName] = await Promise.all([
        formAssetBalanceById(amount.asset_id, amount.amount),
        getUserNameById(creator),
      ]);

      return counterpart.translate(
        `transaction.trxTypes.vesting_balance_create.description`,
        {
          creator: `[userlink = ${creatorName}]`,
          amount: asset?.amount,
          symbol: asset?.symbol,
        }
      );
    },
    vesting_balance_withdraw: async ({
      owner,
      amount,
    }: {
      owner: string;
      amount: Amount;
    }) => {
      const [asset, ownerName] = await Promise.all([
        formAssetBalanceById(amount.asset_id, amount.amount),
        getUserNameById(owner),
      ]);

      return counterpart.translate(
        `transaction.trxTypes.vesting_balance_withdraw.description`,
        {
          owner: `[userlink = ${ownerName}]`,
          amount: asset?.amount,
          symbol: asset?.symbol,
        }
      );
    },
    account_upgrade: async ({
      account_to_upgrade,
    }: {
      account_to_upgrade: string;
    }) => {
      const user = await getUserNameById(account_to_upgrade);
      return counterpart.translate(
        `transaction.trxTypes.account_upgrade.description`,
        { user: `[userlink = ${user}]` }
      );
    },
    worker_create: async ({ owner }: { owner: string }) => {
      const user = await getUserNameById(owner);
      return counterpart.translate(
        `transaction.trxTypes.worker_create.description`,
        { user: `[userlink = ${user}]`, defaultToken: defaultToken }
      );
    },
    account_update: async ({ account }: { account: string }) => {
      const user = await getUserNameById(account);
      return counterpart.translate(
        `transaction.trxTypes.account_update.description`,
        { user: `[userlink = ${user}]` }
      );
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
      const [asset, sender, receiver] = await Promise.all([
        formAssetBalanceById(amount.asset_id, amount.amount),
        getUserNameById(from),
        getUserNameById(to),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.transfer.description`,
        {
          sender: `[userlink = ${sender}]`,
          amount: asset?.amount,
          symbol: asset?.symbol,
          receiver: `[userlink = ${receiver}]`,
        }
      );
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
      return counterpart.translate(
        `transaction.trxTypes.limit_order_cancel.description`,
        { user: `[userlink = ${user}]`, id: id }
      );
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
      const [buyAsset, sellAsset, creator] = await Promise.all([
        formAssetBalanceById(min_to_receive.asset_id, min_to_receive.amount),
        formAssetBalanceById(amount_to_sell.asset_id, amount_to_sell.amount),
        getUserNameById(seller),
      ]);
      const orderId = id.split(".")[2];
      const buyAmount = `${buyAsset?.amount} ${buyAsset?.symbol}`;
      const sellAmount = `${sellAsset?.amount} ${sellAsset?.symbol}`;
      return counterpart.translate(
        `transaction.trxTypes.limit_order_create.description`,
        {
          creator: `[userlink = ${creator}]`,
          orderId: orderId,
          buyAmount: buyAmount,
          sellAmount: sellAmount,
        }
      );
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
      const [buyAsset, sellAsset, user] = await Promise.all([
        formAssetBalanceById(receives.asset_id, receives.amount),
        formAssetBalanceById(pays.asset_id, pays.amount),
        getUserNameById(account_id),
      ]);
      const id = order_id.split(".")[2];
      const paysAmount = `${buyAsset?.amount} ${buyAsset?.symbol}`;
      const receivesAmmount = `${sellAsset?.amount} ${sellAsset?.symbol}`;
      return counterpart.translate(
        `transaction.trxTypes.fill_order.description`,
        {
          user: `[userlink = ${user}]`,
          paysAmount: paysAmount,
          receivesAmmount: receivesAmmount,
          id: id,
        }
      );
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
      const [asset, feePoolAsset, from] = await Promise.all([
        formAssetBalanceById((defaultAsset as Asset).id, amount),
        getAssetById(asset_id),
        getUserNameById(from_account),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.asset_fund_fee_pool.description`,
        {
          from: `[userlink = ${from}]`,
          symbol: feePoolAsset?.symbol,
          amount: asset?.amount,
          defaultToken,
        }
      );
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

      const [issuerName, listed] = await Promise.all([
        getUserNameById(account_to_list),
        getUserNameById(authorizing_account),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.account_whitelist.description`,
        {
          issuer: `[userlink = ${issuerName}]`,
          status: statuses[new_listing],
          listed: `[userlink=${listed}]`,
        }
      );
    },
    asset_create: async ({
      symbol,
      issuer,
    }: {
      symbol: string;
      issuer: string;
    }) => {
      const issuerName = await getUserNameById(issuer);
      return counterpart.translate(
        `transaction.trxTypes.asset_create.description`,
        { issuer: `[userlink = ${issuerName}]`, symbol: symbol }
      );
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
      const [asset, issuerName, receiver] = await Promise.all([
        formAssetBalanceById(asset_to_issue.asset_id, asset_to_issue.amount),
        getUserNameById(issuer),
        getUserNameById(issue_to_account),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.asset_issue.description`,
        {
          issuer: `[userlink = ${issuerName}]`,
          assetAmount: asset?.amount,
          symbol: asset?.symbol,
          receiver: `[userlink = ${receiver}]`,
        }
      );
    },
    asset_update: async ({
      issuer,
      asset_to_update,
    }: {
      issuer: string;
      asset_to_update: string;
    }) => {
      const [issuerName, asset] = await Promise.all([
        getUserNameById(issuer),
        getAssetById(asset_to_update),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.asset_update.description`,
        { issuer: `[userlink = ${issuerName}]`, symbol: asset?.symbol }
      );
    },
    // unnecessary
    asset_claim_pool: async ({
      amount_to_claim,
      asset_id,
      issuer,
    }: {
      amount_to_claim: Amount;
      asset_id: string;
      issuer: string;
    }) => {
      const [claimedAsset, issuerName, asset] = await Promise.all([
        formAssetBalanceById(amount_to_claim.asset_id, amount_to_claim.amount),
        getUserNameById(issuer),
        getAssetById(asset_id),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.asset_claim_pool.description`,
        {
          issuer: `[userlink = ${issuerName}]`,
          claimed: claimedAsset?.amount,
          claimedSymbol: claimedAsset?.symbol,
          asset: asset?.symbol,
        }
      );
    },
    // unnecessary
    asset_update_issuer: async ({
      new_issuer,
      asset_to_update,
      issuer,
    }: {
      new_issuer: string;
      asset_to_update: string;
      issuer: string;
    }) => {
      const [issuerName, asset, newOwner] = await Promise.all([
        getUserNameById(issuer),
        getAssetById(asset_to_update),
        getUserNameById(new_issuer),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.asset_update_issuer.description`,
        {
          issuer: `[userlink = ${issuerName}]`,
          asset: asset?.symbol,
          newOwner: `[userlink=${newOwner}]`,
        }
      );
    },
    asset_update_feed_producers: async ({
      asset_to_update,
      issuer,
    }: {
      asset_to_update: string;
      issuer: string;
    }) => {
      const [issuerName, asset] = await Promise.all([
        getUserNameById(issuer),
        getAssetById(asset_to_update),
      ]);
      return counterpart.translate(
        `transaction.trxTypes.asset_update_feed_producers.description`,
        { issuer: `[userlink = ${issuerName}]`, asset: asset?.symbol }
      );
    },
  };

  const formActivityRow = useCallback(
    async (activity: History): Promise<ActivityRow> => {
      const fee = activity.op[1].fee as Fee;
      const block_num = activity.block_num;
      const trx_in_block = activity.trx_in_block;
      const blockHeader = await getBlockHeader(block_num);
      const rawBlock = await getBlock2(block_num);
      const transaction_id = rawBlock
        ? rawBlock.transaction_ids[trx_in_block]
        : "";
      const time = blockHeader ? blockHeader.timestamp : "";
      const feeAsset = await getAssetById(fee.asset_id);
      const operationsNames = Object.keys(ChainTypes.operations);
      const operationType = operationsNames[activity.op[0]].toLowerCase();

      const activityDescription = await formActivityDescription[operationType](
        activity.op[1],
        activity.result[1]
      );

      return {
        key: activity.id,
        time,
        type: operationType,
        info: activityDescription,
        id: activity.id,
        block_num: block_num,
        trx_in_block: trx_in_block,
        transaction_id: transaction_id,
        fee: `${setPrecision(false, fee.amount, feeAsset?.precision)} ${
          feeAsset?.symbol
        }`,
      } as ActivityRow;
    },
    [getBlockHeader, defaultAsset, getAssetById, formActivityDescription]
  );

  const getActivitiesRows = useCallback(
    async (userName: string, isWalletActivityTable = false) => {
      let history: History[];
      if (userName) {
        const user = await getAccountByName(userName);
        if (user !== undefined) {
          history = await getAccountHistoryById(user?.id);
        } else {
          history = [];
        }
      } else {
        history = await getAccountHistoryById(id);
      }

      if (isWalletActivityTable) {
        history = history.filter((el: { op: number[] }) => el.op[0] === 0);
      } else {
        history = history.filter(
          (el: { op: number[] }) =>
            (el.op[0] >= 0 && el.op[0] <= 8) ||
            el.op[0] === 32 ||
            el.op[0] === 33 ||
            el.op[0] === 34 ||
            el.op[0] === 10 ||
            el.op[0] === 11 ||
            el.op[0] === 13 ||
            el.op[0] === 14 ||
            el.op[0] === 16
        );
      }

      const activityRows = await Promise.all(history.map(formActivityRow));
      return activityRows;
    },
    [formActivityRow, id, getAccountHistoryById, getAccountByName]
  );

  return {
    getActivitiesRows,
  };
}
