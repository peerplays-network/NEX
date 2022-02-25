import { Form } from "antd";
import { Aes, TransactionHelper } from "peerplaysjs-lib";
import { useEffect, useState } from "react";

import {
  useAccount,
  useAsset,
  useFees,
  useTransactionBuilder,
} from "../../../../../../../common/hooks";
import { ITransactionFee } from "../../../../../../../common/hooks/fees/useFees.type";
import { IAccountData } from "../../../../../../../common/types";
import { useUser } from "../../../../../../../context";

import { ITransferForm } from "./useTransferForm.type";

export function useTransferForm(): ITransferForm {
  const [feeData, setFeeData] = useState<ITransactionFee>();
  const [toAccount, setToAccount] = useState<IAccountData>();
  const [fromAccount, setFromAccount] = useState<IAccountData>();
  const { getAccountByName, formPrivateKey } = useAccount();
  const { trxBuilder } = useTransactionBuilder();
  const { accountData } = useUser();
  const { getFees, feeCalculator } = useFees();
  const [transferForm] = Form.useForm();
  const { setPrecision } = useAsset();

  useEffect(() => {
    getFeeData();
  }, []);

  const getFeeData = async () => {
    const rawFeeData = (await getFees()).filter(
      (item) => item.name === "TRANSFER"
    )[0];
    setFeeData({
      amount: rawFeeData.fee,
      asset_id: "1.3.0",
    });
  };

  const sendTransfer = async (password: string) => {
    const values = transferForm.getFieldsValue();
    const asset = accountData?.assets.filter(
      (asset) => asset.symbol === values.coin
    )[0];
    let memoFromPublic, memoToPublic;
    if (values.memo) {
      memoFromPublic = fromAccount?.options.memo_key;
      memoToPublic = toAccount?.options.memo_key;
    }
    let memoFromPrivkey;
    const activeKey = await formPrivateKey(password, "active");
    if (values.memo) {
      if (
        fromAccount?.options.memo_key === fromAccount?.active.key_auths[0][0]
      ) {
        memoFromPrivkey = formPrivateKey(password, "active");
      } else {
        memoFromPrivkey = formPrivateKey(password, "memo");
      }
      if (!memoFromPrivkey) {
        throw new Error("Missing private memo key for sender: " + fromAccount);
      }
    }
    let memoObject;

    if (values.memo && memoFromPublic && memoToPublic) {
      if (
        !/111111111111111111111/.test(memoFromPublic) &&
        !/111111111111111111111/.test(memoToPublic)
      ) {
        const nonce = TransactionHelper.unique_nonce_uint64();
        const message = Aes.encrypt_with_checksum(
          memoFromPrivkey,
          memoToPublic,
          nonce,
          values.memo
        );
        memoObject = {
          from: memoFromPublic,
          to: memoToPublic,
          nonce,
          message,
        };
      } else {
        memoObject = {
          from: memoFromPublic,
          to: memoToPublic,
          nonce: 0,
          message: Buffer.isBuffer(values.memo)
            ? values.memo
            : Buffer.concat([
                Buffer.alloc(4),
                Buffer.from(values.memo.toString("utf-8"), "utf-8"),
              ]),
        };
      }
    }

    const amount = {
      amount: values.quantity,
      asset_id: asset?.id,
    };

    const trx = {
      type: "transfer",
      params: {
        fee: feeData,
        from: fromAccount?.id,
        to: toAccount?.id,
        amount,
        memo: memoObject,
      },
    };
    let trxResult;
    try {
      trxResult = await trxBuilder([trx], [activeKey]);
    } catch (e) {
      console.log(e);
    }
    if (trxResult) console.log(trxResult);
  };

  const validateFrom = async (_: unknown, value: string) => {
    if (value !== accountData?.name)
      return Promise.reject(new Error("Not your Account"));
    setFromAccount(await getAccountByName(value));
    // transferForm.validateFields().then(() => {
    //   setValidForm(true);
    // });
    return Promise.resolve();
  };

  const validateTo = async (_: unknown, value: string) => {
    const acc = await getAccountByName(value);
    if (value === accountData?.name)
      return Promise.reject(new Error("Can not send to yourself"));
    if (acc === undefined) return Promise.reject(new Error("User not found"));
    setToAccount(acc);
    // transferForm.validateFields().then(() => {
    //   setValidForm(true);
    // });
    return Promise.resolve();
  };

  const validateQuantity = async (_: unknown, value: number) => {
    const coin = transferForm.getFieldValue("coin");
    const accountAsset = accountData?.assets.filter(
      (asset) => asset.symbol === coin
    );
    const accountBalance = accountAsset
      ? setPrecision(true, accountAsset[0].amount, accountAsset[0].precision)
      : undefined;
    if (
      accountBalance !== undefined &&
      accountBalance > value + feeData.amount
    ) {
      // transferForm.validateFields().then(() => {
      //   setValidForm(true);
      // });
      return Promise.resolve();
    }

    return Promise.reject(
      new Error(
        `Must be less then ${accountAsset ? accountAsset[0].amount : ""}`
      )
    );
  };

  const validateMemo = (_: unknown, value: string) => {
    const coin = transferForm.getFieldValue("coin");
    const updatedFee = feeCalculator.transfer(value);
    const sendAmount = transferForm.getFieldValue("quantity");
    const accountAsset = accountData?.assets.filter(
      (asset) => asset.symbol === coin
    );
    const accountBalance = accountAsset
      ? setPrecision(true, accountAsset[0].amount, accountAsset[0].precision)
      : undefined;
    setFeeData({ amount: updatedFee, asset_id: "1.3.0" });
    if (
      accountBalance !== undefined &&
      accountBalance > updatedFee + sendAmount
    ) {
      // transferForm.validateFields().then(() => {
      //   setValidForm(true);
      // });
      return Promise.resolve();
    }
    return Promise.reject(new Error(`Insufficient Funds`));
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
    quantity: [
      { required: true, message: "Quantity is required" },
      { validator: validateQuantity },
    ],
    coin: [{ required: true, message: "Coin is required" }],
    memo: [{ validator: validateMemo }],
  };

  return {
    feeData,
    transferForm,
    sendTransfer,
    formValdation,
  };
}
