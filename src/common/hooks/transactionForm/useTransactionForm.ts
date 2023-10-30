import { Dispatch, useCallback, useState } from "react";

import { useFormKeys } from "..";
import { useUserContext } from "../../providers";
import { KeyType, SignerKey } from "../../types";

import { UseHandleTransactionFormResult } from "./useTransactionForm.types";

import { TransactionMessageAction, TransactionMessageActionType } from ".";

type Args = {
  executeTransaction: (password: SignerKey) => Promise<void>;
  dispatchTransactionMessage: Dispatch<TransactionMessageAction>;
  neededKeyType: KeyType;
};

export function useTransactionForm({
  executeTransaction,
  dispatchTransactionMessage,
  neededKeyType,
}: Args): UseHandleTransactionFormResult {
  const [isPasswordModalVisible, setIsPasswordModalVisible] =
    useState<boolean>(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState<boolean>(false);
  const [inputedPassword, setInputedPassword] = useState<string>("");
  const [inputedKeyType, setInputedKeyType] = useState<KeyType>("");

  const {
    password: savedPassword,
    keyType: savedKeyType,
    savePassword,
    localStorageAccount,
  } = useUserContext();
  const { formSignerKey } = useFormKeys();

  const showTransactionModal = useCallback(() => {
    setIsTransactionModalVisible(true);
  }, [setIsTransactionModalVisible]);

  const hideTransactionModal = useCallback(() => {
    dispatchTransactionMessage({ type: TransactionMessageActionType.CLEAR });
    setIsTransactionModalVisible(false);
  }, [setIsTransactionModalVisible, dispatchTransactionMessage]);

  const hidePasswordModal = useCallback(() => {
    setIsPasswordModalVisible(false);
  }, [setIsPasswordModalVisible]);

  const showPasswordModalIfNeeded = useCallback(() => {
    // There is no saved password or needed key
    if (
      !savedPassword ||
      savedPassword === "" ||
      (savedKeyType !== "password" &&
        savedKeyType !== "owner" &&
        savedKeyType !== neededKeyType)
    ) {
      setIsPasswordModalVisible(true);
      // Needed key exists
    } else {
      setIsPasswordModalVisible(false);
      setIsTransactionModalVisible(true);
    }
  }, [
    setIsPasswordModalVisible,
    savedPassword,
    savedKeyType,
    neededKeyType,
    setIsTransactionModalVisible,
  ]);

  const handleFormFinish = (name: string, info: any) => {
    const { values, forms } = info;
    const { passwordModal, transactionModal } = forms;

    if (name === "passwordModal") {
      passwordModal.validateFields().then(() => {
        savePassword(values.password, values.keyType);
        setInputedPassword(values.password);
        setInputedKeyType(values.keyType);
        setIsPasswordModalVisible(false);
        setIsTransactionModalVisible(true);
      });
    } else if (name === "transactionModal") {
      transactionModal.validateFields().then(() => {
        let key = "";
        let keyType: KeyType = "";
        const passwordModalShown = inputedPassword !== "";

        if (passwordModalShown) {
          key = inputedPassword;
          keyType = inputedKeyType;
        } else {
          key = savedPassword;
          keyType = savedKeyType;
        }
        const signerKey = formSignerKey(
          localStorageAccount,
          key,
          keyType,
          neededKeyType
        );
        executeTransaction(signerKey);
      });
    } else {
      showPasswordModalIfNeeded();
    }
  };

  return {
    isPasswordModalVisible,
    isTransactionModalVisible,
    hidePasswordModal,
    showTransactionModal,
    hideTransactionModal,
    handleFormFinish,
    showPasswordModalIfNeeded,
  };
}
