import { useCallback } from "react";

import { usePeerplaysApiContext } from "../../providers";
import { Amount, Sidechain } from "../../types";

import { UseSidechainApiResult } from "./useSidechainApi.types";

export function useSidechainApi(): UseSidechainApiResult {
  const { sidechainApi } = usePeerplaysApiContext();

  const estimateWithdrawalFeeBySidechain = useCallback(
    async (sidechain: Sidechain) => {
      try {
        const withdrawalFee = await sidechainApi(
          "estimate_withdrawal_transaction_fee",
          [sidechain]
        );
        return withdrawalFee as Amount;
      } catch (e) {
        console.log(e);
      }
    },
    [sidechainApi]
  );
  return {
    estimateWithdrawalFeeBySidechain,
  };
}
