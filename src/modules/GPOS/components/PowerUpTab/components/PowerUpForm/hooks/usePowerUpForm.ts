import counterpart from "counterpart";
import { useCallback, useEffect, useState } from "react";

import { defaultToken } from "../../../../../../../api/params";
import {
  TransactionMessageActionType,
  useAccount,
  useAsset,
  useFees,
  useGPOSTransactionBuilder,
  useTransactionBuilder,
  useTransactionMessage,
} from "../../../../../../../common/hooks";
import {
  useAssetsContext,
  useUserContext,
  useViewportContext,
} from "../../../../../../../common/providers";
import { Asset, SignerKey } from "../../../../../../../common/types";
import { Form } from "../../../../../../../ui/src";

import {
  PowerUpForm,
  UsePowerUpFormArgs,
  UsePowerUpFormResult,
} from "./usePowerUpForm.types";

export function usePowerUpForm({
  gposBalances,
  //loading,
  calculateGposBalances,
}: UsePowerUpFormArgs): UsePowerUpFormResult {
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [newBalance, setNewBalance] = useState<string>("0");
  const [userAvailableBalance, _setUserAvailableBalance] = useState<number>(0);

  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const [powerUpForm] = Form.useForm<PowerUpForm>();
  const depositAmount: string =
    Form.useWatch("depositAmount", powerUpForm) || "0";
  const { id, assets, localStorageAccount } = useUserContext();
  const { buildVestingBalanceCreateTransaction } = useGPOSTransactionBuilder();
  const { buildTrx } = useTransactionBuilder();
  const { formAccountBalancesByName } = useAccount();
  const { calculateGposVestingFee } = useFees();
  const { sm } = useViewportContext();
  const { limitByPrecision } = useAsset();
  const { defaultAsset } = useAssetsContext();

  const adjustDeposit = useCallback(
    (direction: string) => {
      const minusDirection =
        Number(depositAmount) >= 1
          ? limitByPrecision(Number(depositAmount) - 1, defaultAsset?.precision)
          : "0";
      powerUpForm.setFieldsValue({
        depositAmount:
          direction === "+"
            ? limitByPrecision(
                Number(depositAmount) + 1,
                defaultAsset?.precision
              )
            : minusDirection,
      });
      powerUpForm.validateFields();
    },
    [powerUpForm, depositAmount, defaultAsset, limitByPrecision]
  );

  const handleVesting = useCallback(
    async (signerKey: SignerKey) => {
      const values = powerUpForm.getFieldsValue();
      const depositAmount = values.depositAmount;
      const trx = buildVestingBalanceCreateTransaction(
        defaultAsset as Asset,
        depositAmount,
        id
      );

      dispatchTransactionMessage({
        type: TransactionMessageActionType.CLEAR,
      });

      try {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADING,
        });
        const trxResult = await buildTrx([trx], [signerKey]);
        if (trxResult) {
          formAccountBalancesByName(localStorageAccount);
          await calculateGposBalances();
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_SUCCESS,
            message: counterpart.translate(
              `field.success.successfully_deposited`,
              {
                depositAmount: values.depositAmount,
                symbol: gposBalances?.symbol,
              }
            ),
          });
        } else {
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_ERROR,
            message: counterpart.translate(`field.errors.transaction_unable`),
          });
        }
      } catch (e) {
        console.log(e);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      }
    },
    [
      powerUpForm,
      gposBalances,
      buildVestingBalanceCreateTransaction,
      id,
      buildTrx,
      formAccountBalancesByName,
      localStorageAccount,
      calculateGposBalances,
      dispatchTransactionMessage,
    ]
  );

  const setUserAvailableBalance = useCallback(() => {
    if (assets && assets.length > 0) {
      const userDefaultAsset = assets.find(
        (asset) => asset.symbol === defaultToken
      );
      const userAvailableBalance = userDefaultAsset
        ? (userDefaultAsset.amount as number)
        : 0;
      _setUserAvailableBalance(userAvailableBalance);
    }
  }, [assets, defaultToken, _setUserAvailableBalance]);

  const validateDepositAmount = async (_: unknown, value: string) => {
    const accountAsset = assets.find(
      (asset) => asset.symbol === gposBalances?.symbol
    );
    const total = Number(value) + feeAmount;
    if (Number(value) <= 0) {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.deposit_amount_should_greater`)
        )
      );
    }
    if (!accountAsset) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.balance_not_enough`))
      );
    } else {
      if (total > (accountAsset.amount as number)) {
        return Promise.reject(
          new Error(counterpart.translate(`field.errors.balance_not_enough`))
        );
      }
    }
    return Promise.resolve();
  };

  const formValidation = {
    depositAmount: [
      {
        required: true,
        message: counterpart.translate(`field.errors.deposit_amount_required`),
      },
      { validator: validateDepositAmount },
    ],
  };

  useEffect(() => {
    if (gposBalances) {
      if (!sm) {
        powerUpForm.setFieldsValue({
          openingBalance:
            gposBalances.openingBalance + " " + gposBalances.symbol,
          newBalance: gposBalances.openingBalance + " " + gposBalances.symbol,
        });
      } else {
        powerUpForm.setFieldsValue({
          openingBalance: gposBalances.symbol,
          newBalance: gposBalances.symbol,
        });
      }
    }
  }, [gposBalances, powerUpForm, sm]);

  useEffect(() => {
    const gposVestingFee = calculateGposVestingFee();
    if (gposVestingFee) setFeeAmount(gposVestingFee);
  }, [calculateGposVestingFee, setFeeAmount]);

  useEffect(() => {
    if (gposBalances) {
      powerUpForm.setFieldsValue({
        depositAmount: limitByPrecision(depositAmount, defaultAsset?.precision),
      });
      const newBalance = limitByPrecision(
        gposBalances?.openingBalance + Number(depositAmount),
        defaultAsset?.precision
      );
      if (userAvailableBalance >= 0) {
        setNewBalance(newBalance);
        setUserAvailableBalance();

        if (!sm) {
          powerUpForm.setFieldsValue({
            newBalance: newBalance + " " + gposBalances?.symbol,
            availableBalance: userAvailableBalance + " " + gposBalances.symbol,
          });
        } else {
          powerUpForm.setFieldsValue({
            newBalance: gposBalances?.symbol,
            availableBalance: gposBalances.symbol,
          });
        }
      }
    }
  }, [
    depositAmount,
    gposBalances,
    powerUpForm,
    sm,
    setNewBalance,
    setUserAvailableBalance,
    userAvailableBalance,
  ]);

  return {
    powerUpForm,
    formValidation,
    adjustDeposit,
    transactionMessageState,
    dispatchTransactionMessage,
    handleVesting,
    feeAmount,
    depositAmount,
    newBalance,
    userAvailableBalance,
  };
}
