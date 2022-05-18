import { useCallback, useEffect, useState } from "react";

import { defaultToken } from "../../../../../api/params";
import { isArrayEqual, utils } from "../../../../../api/utils";
import {
  useAccount,
  useFormKeys,
  useTransactionBuilder,
  useUpdateAccountTransactionBuilder,
} from "../../../../../common/hooks";
import { useUserContext } from "../../../../../common/providers";
import {
  AccountOptions,
  FullAccount,
  GeneratedKey,
  Permissions,
  Transaction,
} from "../../../../../common/types";
import { CheckboxValueType, Form } from "../../../../../ui/src";

import {
  FormValidation,
  ModifiedPermissions,
  UseKeyManagementTabResult,
} from "./useKeyManagementTab.types";

export function useKeyManagementTab(): UseKeyManagementTabResult {
  // These states should go to upper hook
  const [fullAccount, setFullAccount] = useState<FullAccount | undefined>();
  const [serverUserActivePermissions, setServerUserActivePermissions] =
    useState<ModifiedPermissions>();
  const [localUserActivePermissions, setLocalUserActivePermissions] =
    useState<ModifiedPermissions>();
  const [serverUserOwnerPermissions, setServerUserOwnerPermissions] =
    useState<ModifiedPermissions>();
  const [localUserOwnerPermissions, setLocalUserOwnerPermissions] =
    useState<ModifiedPermissions>();
  const [serverUserMemoKey, setServerUserMemoKey] = useState<string>("");
  const [localUserMemoKey, setLocalUserMemoKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKey[]>([]);
  const [transactionConfirmed, setTransactionConfirmed] =
    useState<boolean>(false);
  const [isPublishable, setIsPublishable] = useState<boolean>(false);
  const [updateAccountFee, setUpdateAccountFee] = useState<number>(0);
  const [pendingTransaction, setPendingTransaction] = useState<Transaction>();
  const [transactionErrorMessage, setTransactionErrorMessage] =
    useState<string>("");
  const [transactionSuccessMessage, setTransactionSuccessMessage] =
    useState<string>("");
  const [loadingTransaction, setLoadingTransaction] = useState<boolean>(false);

  const [selectedKeys, setSelectedKeys] = useState<CheckboxValueType[]>([]);
  const [memoWarning, setMemoWarning] = useState<string>("");
  const [keyManagementForm] = Form.useForm();

  const { getFullAccount, formAccountBalancesByName, getPrivateKey } =
    useAccount();
  const { localStorageAccount, id, assets } = useUserContext();
  const { buildUpdateAccountTransaction } =
    useUpdateAccountTransactionBuilder();
  const { getTrxFee, buildTrx } = useTransactionBuilder();

  // should go to upper hook
  const handleAddItem = useCallback(
    (
      permissionsType: "active" | "owner",
      itemValue: string,
      weight: number,
      authType: "account" | "address" | "key"
    ) => {
      if (
        localUserActivePermissions !== undefined &&
        localUserOwnerPermissions !== undefined
      ) {
        const isActivePermissions = permissionsType === "active";

        const newLocalPermissions = isActivePermissions
          ? ({
              threshold: localUserActivePermissions.threshold,
              accounts: [...localUserActivePermissions.accounts],
              keys: [...localUserActivePermissions.keys],
              addresses: [...localUserActivePermissions.addresses],
              weights: { ...localUserActivePermissions.weights },
            } as ModifiedPermissions)
          : ({
              threshold: localUserOwnerPermissions.threshold,
              accounts: [...localUserOwnerPermissions.accounts],
              keys: [...localUserOwnerPermissions.keys],
              addresses: [...localUserOwnerPermissions.addresses],
              weights: { ...localUserOwnerPermissions.weights },
            } as ModifiedPermissions);

        authType === "account"
          ? newLocalPermissions.accounts.push(itemValue)
          : authType === "key"
          ? newLocalPermissions.keys.push(itemValue)
          : newLocalPermissions.addresses.push(itemValue);

        newLocalPermissions.weights[itemValue] = weight;

        isActivePermissions
          ? setLocalUserActivePermissions(newLocalPermissions)
          : setLocalUserOwnerPermissions(newLocalPermissions);
      }
    },
    [
      localUserActivePermissions,
      localUserOwnerPermissions,
      setLocalUserActivePermissions,
      setLocalUserOwnerPermissions,
    ]
  );

  // should go to upper hook
  const handleRemoveItem = useCallback(
    (
      permissionsType: "active" | "owner",
      itemValue: string,
      authType: "account" | "address" | "key"
    ) => {
      if (
        localUserActivePermissions !== undefined &&
        localUserOwnerPermissions !== undefined
      ) {
        const isActivePermissions = permissionsType === "active";

        const newLocalPermissions = isActivePermissions
          ? ({
              threshold: localUserActivePermissions.threshold,
              accounts: [...localUserActivePermissions.accounts],
              keys: [...localUserActivePermissions.keys],
              addresses: [...localUserActivePermissions.addresses],
              weights: { ...localUserActivePermissions.weights },
            } as ModifiedPermissions)
          : ({
              threshold: localUserOwnerPermissions.threshold,
              accounts: [...localUserOwnerPermissions.accounts],
              keys: [...localUserOwnerPermissions.keys],
              addresses: [...localUserOwnerPermissions.addresses],
              weights: { ...localUserOwnerPermissions.weights },
            } as ModifiedPermissions);

        authType === "account"
          ? (newLocalPermissions.accounts = newLocalPermissions.accounts.filter(
              (account) => account !== itemValue
            ))
          : authType === "key"
          ? (newLocalPermissions.keys = newLocalPermissions.keys.filter(
              (key) => key !== itemValue
            ))
          : (newLocalPermissions.addresses =
              newLocalPermissions.addresses.filter(
                (address) => address !== itemValue
              ));
        isActivePermissions
          ? setLocalUserActivePermissions(newLocalPermissions)
          : setLocalUserOwnerPermissions(newLocalPermissions);
      }
    },
    [
      localUserActivePermissions,
      localUserOwnerPermissions,
      setLocalUserActivePermissions,
      setLocalUserOwnerPermissions,
    ]
  );

  // should go to upper hook
  const resetChanges = useCallback(() => {
    if (
      serverUserActivePermissions !== undefined &&
      serverUserOwnerPermissions !== undefined
    ) {
      setLocalUserActivePermissions({
        threshold: serverUserActivePermissions.threshold,
        accounts: [...serverUserActivePermissions.accounts],
        keys: [...serverUserActivePermissions.keys],
        addresses: [...serverUserActivePermissions.addresses],
        weights: { ...serverUserActivePermissions.weights },
      } as ModifiedPermissions);
      setLocalUserOwnerPermissions({
        threshold: serverUserOwnerPermissions.threshold,
        accounts: [...serverUserOwnerPermissions.accounts],
        keys: [...serverUserOwnerPermissions.keys],
        addresses: [...serverUserOwnerPermissions.addresses],
        weights: { ...serverUserOwnerPermissions.weights },
      } as ModifiedPermissions);
      setLocalUserMemoKey(serverUserMemoKey);
      setIsPublishable(false);
    }
  }, [
    serverUserActivePermissions,
    serverUserOwnerPermissions,
    serverUserMemoKey,
    setLocalUserActivePermissions,
    setLocalUserOwnerPermissions,
    setLocalUserMemoKey,
    setIsPublishable,
  ]);

  // should go to upper hook
  const checkPermissionsChanged = useCallback(
    (permissionsType: "active" | "owner" | "memo") => {
      if (permissionsType === "memo") {
        return serverUserMemoKey !== localUserMemoKey;
      }
      const serverUserPermissions =
        permissionsType === "active"
          ? { ...serverUserActivePermissions }
          : { ...serverUserOwnerPermissions };
      const localUserPermissions =
        permissionsType === "active"
          ? { ...localUserActivePermissions }
          : { ...localUserOwnerPermissions };

      let didChange = false;
      if (
        serverUserPermissions?.threshold !== localUserPermissions?.threshold
      ) {
        didChange = true;
        return didChange;
      }

      const permissionsObjectKeys = ["accounts", "keys", "addresses"];
      permissionsObjectKeys.forEach((key) => {
        if (
          !isArrayEqual(
            serverUserPermissions[key] as string[],
            localUserPermissions[key] as string[]
          )
        ) {
          didChange = true;
          return didChange;
        }
      });
      return didChange;
    },
    [
      serverUserMemoKey,
      localUserMemoKey,
      serverUserActivePermissions,
      serverUserOwnerPermissions,
      localUserActivePermissions,
      localUserOwnerPermissions,
    ]
  );

  // should go to upper hook
  const checkIsPublishable = useCallback(() => {
    if (
      serverUserActivePermissions &&
      serverUserOwnerPermissions &&
      localUserActivePermissions &&
      localUserOwnerPermissions &&
      serverUserMemoKey &&
      localUserMemoKey
    ) {
      let isMemoChanged = false;
      let isActiveChanged = false;
      let isOwnerChanged = false;
      isMemoChanged = checkPermissionsChanged("memo");
      isActiveChanged = checkPermissionsChanged("active");
      isOwnerChanged = checkPermissionsChanged("owner");

      setIsPublishable(isMemoChanged || isActiveChanged || isOwnerChanged);
    }
  }, [
    serverUserActivePermissions,
    serverUserOwnerPermissions,
    localUserActivePermissions,
    localUserOwnerPermissions,
    serverUserMemoKey,
    localUserMemoKey,
    checkPermissionsChanged,
    setIsPublishable,
  ]);

  // should go to upper hook
  const permissionsFromImmutableObj = useCallback(
    (permissions: Permissions): ModifiedPermissions => {
      const threshold = permissions.weight_threshold;
      const account_auths = permissions.account_auths;
      const key_auths = permissions.key_auths;
      const address_auths = permissions.address_auths;

      const accounts = account_auths.map((account_auth) => account_auth[0]);
      const keys = key_auths.map((key_auth) => key_auth[0]);
      const addresses = address_auths.map((address_auth) => address_auth[0]);

      let weights = account_auths.reduce((previousValue, currentValue) => {
        previousValue[currentValue[0]] = currentValue[1];
        return previousValue;
      }, {} as { [key: string]: number });

      weights = key_auths.reduce((previousValue, currentValue) => {
        previousValue[currentValue[0]] = currentValue[1];
        return previousValue;
      }, weights);
      weights = address_auths.reduce((previousValue, currentValue) => {
        previousValue[currentValue[0]] = currentValue[1];
        return previousValue;
      }, weights);
      return { threshold, accounts, keys, addresses, weights };
    },
    []
  );

  // should go to upper hook
  const permissionsToJson = useCallback(
    (
      threshold: number,
      accounts: string[],
      keys: string[],
      addresses: string[],
      weights: {
        [key: string]: number;
      }
    ): Permissions => {
      const permissions: Permissions = {
        account_auths: [],
        address_auths: [],
        key_auths: [],
        weight_threshold: 0,
      };
      permissions.weight_threshold = threshold;
      permissions.account_auths = accounts
        .sort(utils.sortID)
        .map((a) => [a, weights[a]]);
      permissions.key_auths = keys
        .sort(utils.sortID)
        .map((a) => [a, weights[a]]);
      permissions.address_auths = addresses
        .sort(utils.sortID)
        .map((a) => [a, weights[a]]);

      return permissions;
    },
    []
  );

  // should go to upper hook
  const getAccountWithPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const fullAccount = await getFullAccount(localStorageAccount, false);
      setFullAccount(fullAccount);
      if (fullAccount !== undefined) {
        const userActivePermissions = permissionsFromImmutableObj(
          fullAccount.account.active
        );
        const userOwnerPermissions = permissionsFromImmutableObj(
          fullAccount.account.owner
        );
        setServerUserActivePermissions(userActivePermissions);
        setLocalUserActivePermissions({
          threshold: userActivePermissions.threshold,
          accounts: [...userActivePermissions.accounts],
          keys: [...userActivePermissions.keys],
          addresses: [...userActivePermissions.addresses],
          weights: { ...userActivePermissions.weights },
        } as ModifiedPermissions);
        setServerUserOwnerPermissions(userOwnerPermissions);
        setLocalUserOwnerPermissions({
          threshold: userOwnerPermissions.threshold,
          accounts: [...userOwnerPermissions.accounts],
          keys: [...userOwnerPermissions.keys],
          addresses: [...userOwnerPermissions.addresses],
          weights: { ...userOwnerPermissions.weights },
        } as ModifiedPermissions);
        setServerUserMemoKey(fullAccount.account.options.memo_key);
        setLocalUserMemoKey(fullAccount.account.options.memo_key);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [
    setFullAccount,
    getFullAccount,
    localStorageAccount,
    permissionsFromImmutableObj,
    setServerUserActivePermissions,
    setLocalUserActivePermissions,
    setServerUserOwnerPermissions,
    setLocalUserOwnerPermissions,
    setServerUserMemoKey,
    setLocalUserMemoKey,
    setLoading,
  ]);

  // should go to upper hook
  const getUpdateAccountTrx = useCallback(() => {
    if (
      fullAccount !== undefined &&
      id &&
      localUserActivePermissions !== undefined &&
      localUserOwnerPermissions !== undefined &&
      serverUserActivePermissions !== undefined
    ) {
      const updateObject: any = {};
      if (checkPermissionsChanged("owner")) {
        updateObject.owner = permissionsToJson(
          localUserOwnerPermissions.threshold,
          localUserOwnerPermissions.accounts,
          localUserOwnerPermissions.keys,
          localUserOwnerPermissions.addresses,
          localUserOwnerPermissions.weights
        );
        if (!checkPermissionsChanged("active")) {
          updateObject.active = permissionsToJson(
            serverUserActivePermissions.threshold,
            serverUserActivePermissions.accounts,
            serverUserActivePermissions.keys,
            serverUserActivePermissions.addresses,
            serverUserActivePermissions.weights
          );
        }
      }

      if (checkPermissionsChanged("active")) {
        updateObject.active = permissionsToJson(
          localUserActivePermissions.threshold,
          localUserActivePermissions.accounts,
          localUserActivePermissions.keys,
          localUserActivePermissions.addresses,
          localUserActivePermissions.weights
        );
      }

      if (checkPermissionsChanged("memo")) {
        updateObject.new_options = {
          extensions: [...fullAccount.account.options.extensions],
          memo_key: fullAccount.account.options.memo_key,
          num_committee: fullAccount.account.options.num_committee,
          num_witness: fullAccount.account.options.num_witness,
          num_son: fullAccount.account.options.num_son,
          votes: [...fullAccount.account.options.votes],
          voting_account: fullAccount.account.options.voting_account,
        } as AccountOptions;
        updateObject.new_options.memo_key = localUserMemoKey;
      }
      const trx = buildUpdateAccountTransaction(updateObject, id);
      return trx;
    }
  }, [
    id,
    fullAccount,
    checkPermissionsChanged,
    localUserActivePermissions,
    localUserOwnerPermissions,
    serverUserActivePermissions,
    permissionsToJson,
    buildUpdateAccountTransaction,
  ]);

  // should go to upper hook
  const getUpdateAccountFee = useCallback(async () => {
    const trx = getUpdateAccountTrx();
    setPendingTransaction(trx);
    if (trx !== undefined) {
      const fee = await getTrxFee([trx]);
      setUpdateAccountFee(fee);
    }
  }, [
    getUpdateAccountTrx,
    getTrxFee,
    setUpdateAccountFee,
    setPendingTransaction,
  ]);

  const handleSaveChanges = useCallback(
    async (password: string) => {
      const userDefaultAsset = assets.find(
        (asset) => asset.symbol === defaultToken
      );
      if (
        userDefaultAsset === undefined ||
        (userDefaultAsset.amount as number) < updateAccountFee
      ) {
        setTransactionErrorMessage("Insufficient balance to pay the fee.");
        return;
      } else {
        setTransactionErrorMessage("");
        const activePrivateKey = getPrivateKey(password, "active");
        const ownerPrivateKey = getPrivateKey(password, "owner");

        let trxResult;
        try {
          setLoadingTransaction(true);
          trxResult = !selectedKeys.includes("owner")
            ? await buildTrx([pendingTransaction], [activePrivateKey])
            : await buildTrx([pendingTransaction], [ownerPrivateKey]);
        } catch (error) {
          console.log(error);
          setTransactionErrorMessage("Unable to process the transaction!");
          setLoadingTransaction(false);
        }
        if (trxResult) {
          formAccountBalancesByName(localStorageAccount);
          setTransactionErrorMessage("");
          setTransactionSuccessMessage(
            "You have successfully saved your changes"
          );
          await getAccountWithPermissions();
          setIsPublishable(false);
          setLoadingTransaction(false);
          setTransactionConfirmed(true);
        } else {
          setTransactionErrorMessage("Unable to process the transaction!");
          setLoadingTransaction(false);
        }
      }
    },
    [
      assets,
      updateAccountFee,
      setTransactionErrorMessage,
      getPrivateKey,
      setLoadingTransaction,
      buildTrx,
      pendingTransaction,
      getAccountWithPermissions,
      setIsPublishable,
      localStorageAccount,
      formAccountBalancesByName,
      setTransactionConfirmed,
    ]
  );

  // this is remove function in bts in cloud tab, now I'm using it differently. It should change in general form
  const removePasswordKeys = useCallback(() => {
    if (
      localUserOwnerPermissions &&
      localUserActivePermissions &&
      serverUserActivePermissions &&
      serverUserOwnerPermissions
    ) {
      if (selectedKeys.includes("active")) {
        if (
          !isArrayEqual(
            serverUserActivePermissions.keys,
            localUserActivePermissions.keys
          )
        ) {
          handleRemoveItem(
            "active",
            generatedKeys.find((key) => key.label === "active")?.key as string,
            "key"
          );
        }
      }

      if (selectedKeys.includes("owner")) {
        if (
          !isArrayEqual(
            serverUserOwnerPermissions.keys,
            localUserOwnerPermissions.keys
          )
        ) {
          handleRemoveItem(
            "owner",
            generatedKeys.find((key) => key.label === "owner")?.key as string,
            "key"
          );
        }
      }
      if (selectedKeys.includes("memo")) {
        if (serverUserMemoKey !== localUserMemoKey) {
          setLocalUserMemoKey(serverUserMemoKey);
        }
      }
      if (!transactionConfirmed) {
        setGeneratedKeys([]);
      }
    }
  }, [
    localUserOwnerPermissions,
    localUserActivePermissions,
    localUserMemoKey,
    serverUserActivePermissions,
    serverUserOwnerPermissions,
    serverUserMemoKey,
    useFormKeys,
    localStorageAccount,
    keyManagementForm,
    selectedKeys,
    selectedKeys.length,
    isArrayEqual,
    handleRemoveItem,
    setLocalUserMemoKey,
    setGeneratedKeys,
    generatedKeys,
    transactionConfirmed,
  ]);

  // this is use function in bts in cloud tab, now I'm using it differently. It should change in general form
  const handleSetPassword = useCallback(() => {
    if (localUserOwnerPermissions && localUserActivePermissions) {
      keyManagementForm.validateFields().then(() => {
        const keys = useFormKeys(
          localStorageAccount,
          keyManagementForm.getFieldValue("password")
        );
        const generatedKeys: GeneratedKey[] = [];
        if (selectedKeys.includes("active")) {
          handleAddItem(
            "active",
            keys.active as string,
            localUserActivePermissions.threshold,
            "key"
          );
          generatedKeys.push({
            label: "active",
            key: keys.active as string,
          });
        }

        if (selectedKeys.includes("owner")) {
          handleAddItem(
            "owner",
            keys.owner as string,
            localUserOwnerPermissions.threshold,
            "key"
          );
          generatedKeys.push({
            label: "owner",
            key: keys.owner as string,
          });
        }
        if (selectedKeys.includes("memo")) {
          setLocalUserMemoKey(keys.memo as string);
          generatedKeys.push({
            label: "memo",
            key: keys.memo as string,
          });
        }
        setGeneratedKeys(generatedKeys);
      });
    }
  }, [
    localStorageAccount,
    keyManagementForm,
    useFormKeys,
    selectedKeys,
    selectedKeys.length,
    handleAddItem,
    localUserOwnerPermissions,
    localUserActivePermissions,
    setLocalUserMemoKey,
    setGeneratedKeys,
  ]);

  const handleValuesChange = useCallback(() => {
    if (transactionConfirmed) {
      setTransactionConfirmed(false);
    }
  }, [transactionConfirmed, setTransactionConfirmed]);

  const handleCheckboxChange = useCallback(
    (checkedValues: CheckboxValueType[]) => {
      setSelectedKeys(checkedValues);
      if (checkedValues.includes("memo")) {
        setMemoWarning(
          "WARNING: If you replace the memo key you will be unable to read old memos when logging in with your password"
        );
      } else {
        setMemoWarning("");
      }
    },
    [setMemoWarning, setSelectedKeys]
  );

  const validateSelectKeys = (_: unknown) => {
    if (selectedKeys.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please at least select one role"));
  };

  const checkPasswordMatch = (_: unknown, value: string) => {
    if (
      serverUserOwnerPermissions === undefined ||
      serverUserActivePermissions == undefined
    ) {
      return Promise.reject(new Error("Please wait for loading user keys"));
    }
    if (value !== keyManagementForm.getFieldValue("password"))
      return Promise.reject(new Error("Password do not match"));
    const keys = useFormKeys(localStorageAccount, value);
    if (
      selectedKeys.includes("active") &&
      serverUserActivePermissions.keys.includes(keys.active as string)
    ) {
      return Promise.reject(
        new Error("These keys are already in used for active permissions")
      );
    }
    if (
      selectedKeys.includes("owner") &&
      serverUserOwnerPermissions.keys.includes(keys.owner as string)
    ) {
      return Promise.reject(
        new Error("These keys are already in used for owner permissions")
      );
    }
    if (
      selectedKeys.includes("memo") &&
      serverUserMemoKey === (keys.memo as string)
    ) {
      return Promise.reject(
        new Error("These keys are already in used for memo permissions")
      );
    }

    return Promise.resolve();
  };

  const formValidation: FormValidation = {
    password: [
      { required: true, message: "Password is required" },
      {
        min: 12,
        message: "Password should be at least 12 characters long",
      },
    ],
    passwordCheck: [
      { required: true, message: "This field is required" },
      { validator: checkPasswordMatch },
    ],
    roles: [{ validator: validateSelectKeys }],
  };

  useEffect(() => {
    getAccountWithPermissions();
  }, [getAccountWithPermissions]);

  useEffect(() => {
    getUpdateAccountFee();
    checkIsPublishable();
  }, [
    fullAccount,
    localUserActivePermissions,
    localUserOwnerPermissions,
    localUserMemoKey,
  ]);

  return {
    formValidation,
    keyManagementForm,
    generatedKeys,
    handleCheckboxChange,
    memoWarning,
    updateAccountFee,
    selectedKeys,
    handleValuesChange,
    serverUserActivePermissions,
    localUserActivePermissions,
    serverUserOwnerPermissions,
    localUserOwnerPermissions,
    serverUserMemoKey,
    localUserMemoKey,
    loading,
    transactionConfirmed,
    isPublishable,
    transactionErrorMessage,
    transactionSuccessMessage,
    setTransactionErrorMessage,
    setTransactionSuccessMessage,
    loadingTransaction,
    handleAddItem,
    handleRemoveItem,
    resetChanges,
    handleSaveChanges,
    handleSetPassword,
    removePasswordKeys,
  };
}