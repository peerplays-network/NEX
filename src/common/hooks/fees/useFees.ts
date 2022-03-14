import { ChainTypes, TransactionHelper } from "peerplaysjs-lib";
import { useCallback, useEffect, useState } from "react";

import { useAccount, useAsset } from "..";
import { usePeerplaysApiContext } from "../../components/PeerplaysApiProvider";
import { useUserContext } from "../../components/UserProvider";
import { Account } from "../../types";

import { ChainOperations, FeeParameter, UseFeesResult } from "./useFees.types";

export function useFees(): UseFeesResult {
  const [feeParameters, setFeeParameters] = useState<FeeParameter[]>([]);
  const [account, _setAccount] = useState<Account>();
  const { dbApi } = usePeerplaysApiContext();
  const { getAccountByName } = useAccount();
  const { localStorageAccount } = useUserContext();
  const defaultNonce = TransactionHelper.unique_nonce_uint64();
  const { defaultAsset, setPrecision } = useAsset();

  const setAccount = useCallback(async () => {
    const acc = await getAccountByName(localStorageAccount);
    if (acc) {
      _setAccount(acc);
    }
  }, [getAccountByName, localStorageAccount, _setAccount]);

  const getFeesFromGlobal = useCallback(async () => {
    try {
      const globalProperties = await dbApi("get_global_properties");
      const feeParameters = globalProperties.parameters.current_fees
        .parameters as FeeParameter[];
      setFeeParameters(feeParameters);
    } catch (e) {
      console.log(e);
    }
  }, [dbApi, setFeeParameters]);

  const findOperationFee = useCallback(
    (operationType: string): FeeParameter | undefined => {
      const allOperationsTypes = Object.keys(ChainTypes.operations);
      if (!allOperationsTypes.find((type) => type === operationType)) {
        return undefined;
      }
      const operations = ChainTypes.operations as ChainOperations;
      const operationNumber = operations[operationType];
      const selectedFeeParameter = feeParameters.find(
        (feeParameter) => feeParameter[0] === operationNumber
      );
      return selectedFeeParameter;
    },
    [feeParameters]
  );

  const calculteTransferFee = useCallback(
    (memo: string) => {
      if (account && feeParameters.length && defaultAsset) {
        const transferFeeParameter = findOperationFee(
          "transfer"
        ) as FeeParameter;
        const transferFee = transferFeeParameter[1];
        let feeAmount = transferFee.fee as number;

        if (memo && memo.length > 0) {
          const rawAdditional = transferFee.price_per_kbyte as number;
          const memoLength = JSON.stringify(account.options.memo_key).length;
          const helperLength = JSON.stringify(defaultNonce).length;
          const result =
            ((memoLength + helperLength + memo.length) / 1024) * rawAdditional;

          feeAmount = feeAmount + result;
        }

        return setPrecision(true, feeAmount, defaultAsset.precision);
      }
    },
    [feeParameters, findOperationFee, account]
  );
  useEffect(() => {
    getFeesFromGlobal();
    setAccount();
  }, [localStorageAccount, dbApi]);

  return {
    calculteTransferFee,
  };
}