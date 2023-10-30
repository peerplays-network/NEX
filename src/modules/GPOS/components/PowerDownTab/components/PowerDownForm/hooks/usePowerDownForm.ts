import counterpart from "counterpart";
import { useCallback, useEffect, useState } from "react";

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
  PowerDownForm,
  UsePowerDownFormArgs,
  UsePowerDownFormResult,
} from "./usePowerDownForm.types";

export function usePowerDownForm({
  gposBalances,
  //loading,
  calculateGposBalances,
}: UsePowerDownFormArgs): UsePowerDownFormResult {
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [newBalance, setNewBalance] = useState<string>("0");
  const [newAvailableBalance, setNewAvailableBalance] = useState<string>("0");

  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const [powerDownForm] = Form.useForm<PowerDownForm>();
  const withdrawAmount: string =
    Form.useWatch("withdrawAmount", powerDownForm) || "0";
  const { localStorageAccount, id, assets } = useUserContext();
  const { buildVestingWithdrawTransaction } = useGPOSTransactionBuilder();
  const { buildTrx } = useTransactionBuilder();
  const { formAccountBalancesByName, getVestingBalances } = useAccount();
  const { calculateGposWithdrawFee } = useFees();
  const { sm } = useViewportContext();
  const { limitByPrecision } = useAsset();
  const { defaultAsset } = useAssetsContext();

  const handleWithdraw = useCallback(
    async (signerKey: SignerKey) => {
      dispatchTransactionMessage({
        type: TransactionMessageActionType.CLEAR,
      });
      const values = powerDownForm.getFieldsValue();
      try {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADING,
        });
        const vestingBalances = await getVestingBalances(id);
        const gposVestingBalances = vestingBalances
          ? vestingBalances.filter((balance) => balance.balance_type == "gpos")
          : [];

        const trx = buildVestingWithdrawTransaction(
          defaultAsset as Asset,
          values.withdrawAmount,
          gposVestingBalances,
          id
        );

        const trxResult = await buildTrx([trx], [signerKey]);
        if (trxResult) {
          formAccountBalancesByName(localStorageAccount);
          await calculateGposBalances();
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_SUCCESS,
            message: counterpart.translate(
              `field.success.successfully_withdrawn`,
              {
                withdrawAmount: values.withdrawAmount,
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
      powerDownForm,
      dispatchTransactionMessage,
      id,
      gposBalances,
      buildVestingWithdrawTransaction,
      buildTrx,
      formAccountBalancesByName,
      calculateGposBalances,
      getVestingBalances,
    ]
  );

  const adjustWithdraw = useCallback(
    (direction: string) => {
      const minusDirection =
        Number(withdrawAmount) >= 1
          ? limitByPrecision(
              Number(withdrawAmount) - 1,
              defaultAsset?.precision
            )
          : "0";
      powerDownForm.setFieldsValue({
        withdrawAmount:
          direction === "+"
            ? limitByPrecision(
                Number(withdrawAmount) + 1,
                defaultAsset?.precision
              )
            : minusDirection,
      });
      powerDownForm.validateFields();
    },
    [powerDownForm, withdrawAmount]
  );

  const validateWithdrawAmount = async (_: unknown, value: string) => {
    const accountAsset = assets.find(
      (asset) => asset.symbol === gposBalances?.symbol
    );
    if (Number(value) <= 0) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.amount_should_greater`))
      );
    }
    if (Number(value) > (gposBalances?.availableBalance as number)) {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.available_balance_cannot_greater`)
        )
      );
    }
    if (!accountAsset) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.balance_not_enough`))
      );
    } else {
      if (feeAmount > (accountAsset?.amount as number))
        return Promise.reject(
          new Error(
            counterpart.translate(`field.errors.balance_not_enough_to_pay`)
          )
        );
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (gposBalances) {
      if (!sm) {
        powerDownForm.setFieldsValue({
          openingBalance:
            gposBalances.openingBalance + " " + gposBalances.symbol,
          availableBalance:
            gposBalances.availableBalance + " " + gposBalances.symbol,
          newBalance: gposBalances.openingBalance + " " + gposBalances.symbol,
        });
      } else {
        powerDownForm.setFieldsValue({
          openingBalance: gposBalances.symbol,
          availableBalance: gposBalances.symbol,
          newBalance: gposBalances.symbol,
        });
      }
    }
  }, [gposBalances, powerDownForm, sm]);

  useEffect(() => {
    const gposWithdrawFee = calculateGposWithdrawFee();
    if (gposWithdrawFee) {
      setFeeAmount(gposWithdrawFee);
    }
  }, [calculateGposWithdrawFee, setFeeAmount]);

  useEffect(() => {
    if (gposBalances) {
      powerDownForm.setFieldsValue({
        withdrawAmount: limitByPrecision(
          withdrawAmount,
          defaultAsset?.precision
        ),
      });
      const newBalance = limitByPrecision(
        gposBalances.openingBalance - Number(withdrawAmount),
        defaultAsset?.precision
      );

      const newAvailableBalance = limitByPrecision(
        gposBalances.availableBalance - Number(withdrawAmount),
        defaultAsset?.precision
      );

      if (Number(newAvailableBalance) >= 0) {
        setNewBalance(newBalance);
        setNewAvailableBalance(newAvailableBalance);
        if (!sm) {
          powerDownForm.setFieldsValue({
            availableBalance: newAvailableBalance + " " + gposBalances.symbol,
            newBalance: newBalance + " " + gposBalances.symbol,
          });
        } else {
          powerDownForm.setFieldsValue({
            availableBalance: gposBalances.symbol,
            newBalance: gposBalances.symbol,
          });
        }
      }
    }
  }, [
    withdrawAmount,
    gposBalances,
    powerDownForm,
    sm,
    setNewBalance,
    setNewAvailableBalance,
  ]);

  const formValidation = {
    withdrawAmount: [
      {
        required: true,
        message: counterpart.translate(`field.errors.withdraw_amount_required`),
      },
      { validator: validateWithdrawAmount },
    ],
  };

  return {
    powerDownForm,
    formValidation,
    adjustWithdraw,
    transactionMessageState,
    dispatchTransactionMessage,
    handleWithdraw,
    feeAmount,
    withdrawAmount,
    newBalance,
    newAvailableBalance,
  };
}
