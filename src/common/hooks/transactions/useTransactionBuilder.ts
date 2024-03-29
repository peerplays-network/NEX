import { TransactionBuilder } from "peerplaysjs-lib";
import { useCallback } from "react";

import { useAsset } from "../../hooks";
import { useAssetsContext } from "../../providers";
import { SignerKey } from "../../types";

import { ITransactionBuilder } from "./useTransactionBuilder.types";

export function useTransactionBuilder(): ITransactionBuilder {
  const { setPrecision } = useAsset();
  const { defaultAsset } = useAssetsContext();

  const buildTrx = useCallback(async (trx: any, keys: SignerKey[]) => {
    const tr = new TransactionBuilder();

    trx.forEach((elem: any) => tr.add_type_operation(elem.type, elem.params));
    await tr.set_required_fees();
    keys.forEach((elem: any) => tr.add_signer(elem));

    return tr.broadcast();
  }, []);

  const getTrxFee = useCallback(
    async (trx: any) => {
      if (defaultAsset !== undefined) {
        try {
          const tr = new TransactionBuilder();
          trx.forEach((elem: any) =>
            tr.add_type_operation(elem.type, elem.params)
          );
          await tr.set_required_fees();
          const feeAmounts: number[] = tr.operations.map((operation: any) => {
            return operation[1].fee.amount;
          });
          let feeAmount = 0;
          feeAmounts.forEach((amount) => {
            feeAmount += amount;
          });
          const fee = setPrecision(true, feeAmount, defaultAsset.precision);
          return fee;
        } catch (e) {
          console.log(e);
        }
      }
    },
    [defaultAsset, setPrecision]
  );

  return { buildTrx, getTrxFee };
}
