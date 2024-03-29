import { useCallback } from "react";

import { useAssetsContext } from "../../providers";
import { Account, Asset, Transaction } from "../../types";

import { UseTransferTransactionBuilderResult } from "./useTransferTransactionBuilder.types";

export function useTransferTransactionBuilder(): UseTransferTransactionBuilderResult {
  const { defaultAsset } = useAssetsContext();

  const buildTransferTransaction = useCallback(
    (
      from: Account,
      to: Account,
      asset: Asset,
      amount: string,
      memo?: string
    ): Transaction => {
      let memoFromPublic, memoToPublic;
      if (memo) {
        memoFromPublic = from.options.memo_key;
        memoToPublic = to.options.memo_key;
      }

      let memoObject;
      if (memo && memoFromPublic && memoToPublic) {
        memoObject = {
          from: memoFromPublic,
          to: memoToPublic,
          nonce: 0,
          message: Buffer.isBuffer(memo)
            ? memo
            : Buffer.concat([Buffer.alloc(4), Buffer.from(memo, "utf-8")]),
        };
      }

      const assetAmount = {
        amount: Math.round(Number(amount) * 10 ** asset.precision),
        asset_id: asset.id,
      };

      const trx = {
        type: "transfer",
        params: {
          fee: {
            amount: 0,
            asset_id: defaultAsset?.id,
          },
          from: from.id,
          to: to.id,
          amount: assetAmount,
          memo: memoObject,
        },
      };
      return trx;
    },
    [defaultAsset]
  );
  return { buildTransferTransaction };
}
