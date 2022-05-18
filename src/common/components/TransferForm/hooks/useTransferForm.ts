import { useEffect, useState } from "react";

import { defaultToken } from "../../../../api/params/networkparams";
import { Form } from "../../../../ui/src";
import {
  roundNum,
  useAccount,
  useFees,
  useSonNetwork,
  useTransactionBuilder,
  useTransferTransactionBuilder,
} from "../../../hooks";
import { useUserContext } from "../../../providers";
import { Account } from "../../../types";

import { UseTransferFormResult } from "./useTransferForm.types";

export function useTransferForm(): UseTransferFormResult {
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);
  const [transactionErrorMessage, setTransactionErrorMessage] =
    useState<string>("");
  const [transactionSuccessMessage, setTransactionSuccessMessage] =
    useState<string>("");
  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [toAccount, setToAccount] = useState<Account>();
  const [fromAccount, setFromAccount] = useState<Account>();
  const { getAccountByName, getPrivateKey, formAccountBalancesByName } =
    useAccount();
  const { localStorageAccount, assets } = useUserContext();
  const { buildTrx } = useTransactionBuilder();
  const { calculateTransferFee } = useFees();
  const { buildTransferTransaction } = useTransferTransactionBuilder();
  const { sonAccount, getSonNetworkStatus } = useSonNetwork();
  const [transferForm] = Form.useForm();

  useEffect(() => {
    const transferFee = calculateTransferFee(
      transferForm.getFieldValue("memo")
    );
    if (transferFee) {
      setFeeAmount(transferFee);
    }
    transferForm.setFieldsValue({ from: localStorageAccount });
  }, [localStorageAccount, calculateTransferFee, assets]);

  const handleValuesChange = (changedValues: any) => {
    if (changedValues.amount) {
      if (changedValues.amount < 0) {
        transferForm.setFieldsValue({ amount: 0 });
      } else {
        const selectedAsset = transferForm.getFieldValue("asset");
        const selectedAccountAsset = assets.find(
          (asset) => asset.symbol === selectedAsset
        );

        if (selectedAccountAsset && changedValues.amount > 0) {
          transferForm.setFieldsValue({
            amount: roundNum(
              changedValues.amount,
              selectedAccountAsset.precision
            ),
          });
        }
      }
    }
  };

  const transfer = async (password: string) => {
    setSubmittingPassword(true);
    const values = transferForm.getFieldsValue();
    const from = (
      fromAccount ? fromAccount : await getAccountByName(values.from)
    ) as Account;
    const to = (
      toAccount ? toAccount : await getAccountByName(values.to)
    ) as Account;
    const activeKey = getPrivateKey(password, "active");
    const asset = assets.filter((asset) => asset.symbol === values.asset)[0];
    const trx = buildTransferTransaction(
      from,
      to,
      values.memo,
      asset,
      password,
      values.amount
    );
    let trxResult;
    try {
      setLoadingTransaction(true);
      trxResult = await buildTrx([trx], [activeKey]);
    } catch (e) {
      console.log(e);
      setSubmittingPassword(false);
      setLoadingTransaction(false);
    }
    if (trxResult) {
      formAccountBalancesByName(localStorageAccount);
      setTransactionErrorMessage("");
      setTransactionSuccessMessage(
        `Successfully Transfered ${values.amount} ${values.asset} to ${values.to}`
      );
      setLoadingTransaction(false);
      setSubmittingPassword(false);
    } else {
      setTransactionSuccessMessage("");
      setTransactionErrorMessage("Server error, please try again later.");
      setLoadingTransaction(false);
      setSubmittingPassword(false);
    }
  };

  const validateFrom = async (_: unknown, value: string) => {
    if (value !== localStorageAccount)
      return Promise.reject(new Error("Not your Account"));
    setFromAccount(await getAccountByName(value));
    return Promise.resolve();
  };

  const validateTo = async (_: unknown, value: string) => {
    const acc = await getAccountByName(value);
    if (value === localStorageAccount) {
      return Promise.reject(new Error("Can not send to yourself"));
    }
    if (!acc) {
      return Promise.reject(new Error("User not found"));
    }
    if (
      sonAccount &&
      (acc.id === sonAccount.id || acc.name === sonAccount.name)
    ) {
      const sonNetworkStatus = await getSonNetworkStatus();
      if (!sonNetworkStatus.isSonNetworkOk) {
        return Promise.reject(new Error("SONs network is not available now"));
      }
    }
    setToAccount(acc);
    return Promise.resolve();
  };

  const validateAmount = async (_: unknown, value: number) => {
    const selectedAsset = transferForm.getFieldValue("asset");
    const isDefaultAsset = selectedAsset === defaultToken;
    const selectedAccountAsset = assets.find(
      (asset) => asset.symbol === selectedAsset
    );
    if (Number(value) <= 0) {
      return Promise.reject(new Error("Amount should be greater than 0"));
    }
    if (!selectedAccountAsset) {
      return Promise.reject(new Error("Balance is not enough"));
    }

    if (isDefaultAsset) {
      const total = Number(value) + feeAmount;
      if ((selectedAccountAsset.amount as number) < total) {
        return Promise.reject(new Error("Balance is not enough"));
      }
      return Promise.resolve();
    } else {
      const accountDefaultAsset = assets.find(
        (asset) => asset.symbol === defaultToken
      );
      if ((selectedAccountAsset.amount as number) < value) {
        return Promise.reject(new Error("Balance is not enough"));
      }
      if (!accountDefaultAsset) {
        return Promise.reject(
          new Error("Balance is not enough to pay the fee")
        );
      }
      if ((accountDefaultAsset.amount as number) < feeAmount) {
        return Promise.reject(
          new Error("Balance is not enough to pay the fee")
        );
      }
      return Promise.resolve();
    }
  };

  const validateMemo = async (_: unknown, value: string) => {
    const updatedFee = calculateTransferFee(value);
    if (updatedFee) {
      setFeeAmount(updatedFee);
    }
    return Promise.resolve();
  };

  const formValdation = {
    from: [
      { required: true, message: "From is required" },
      { validator: validateFrom },
    ],
    to: [
      { required: true, message: "To is required" },
      { validator: validateTo },
    ],
    amount: [
      { required: true, message: "Amount is required" },
      { validator: validateAmount },
    ],
    asset: [{ required: true, message: "Asset is required" }],
    memo: [{ validator: validateMemo }],
  };

  return {
    feeAmount,
    transferForm,
    formValdation,
    loadingTransaction,
    transactionErrorMessage,
    transactionSuccessMessage,
    submittingPassword,
    transfer,
    handleValuesChange,
    setTransactionErrorMessage,
    setTransactionSuccessMessage,
  };
}
