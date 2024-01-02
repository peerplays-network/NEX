import counterpart from "counterpart";
import { cloneDeep } from "lodash";
import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { DEFAULT_PROXY_ID, defaultToken } from "../../../../../api/params";
import {
  TransactionMessageActionType,
  useAccount,
  useTransactionBuilder,
  useTransactionMessage,
  useUpdateAccountTransactionBuilder,
} from "../../../../../common/hooks";
import { useUserContext } from "../../../../../common/providers";
import {
  Account,
  Proxy,
  SignerKey,
  Transaction,
} from "../../../../../common/types";

import { UseProxyTab } from "./useProxyTab.types";

type Args = {
  serverProxy: Proxy;
  totalGpos: number;
  getUserVotes: () => Promise<void>;
};

export function useProxyTab({
  serverProxy,
  totalGpos,
  getUserVotes,
}: Args): UseProxyTab {
  const [localProxy, setLocalProxy] = useState<Proxy>({ ...serverProxy });
  const [searchError, setSearchError] = useState<boolean>(false);
  const [updateAccountFee, setUpdateAccountFee] = useState<number>(0);
  const [pendingTransaction, setPendingTransaction] = useState<Transaction>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchedAccount, setSearchedAccount] = useState<Account | undefined>();
  const [isPublishable, setIsPublishable] = useState<boolean>(false);
  const [isSameAccount, setIsSameAccount] = useState<boolean>(false);
  const [accountAlreadyAdded, setAccountAlreadyAdded] =
    useState<boolean>(false);

  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const { id, assets, name, localStorageAccount } = useUserContext();
  const { getAccountByName, getFullAccount, formAccountBalancesByName } =
    useAccount();
  const { buildUpdateAccountTransaction } =
    useUpdateAccountTransactionBuilder();
  const { getTrxFee, buildTrx } = useTransactionBuilder();

  const searchChange = useCallback(
    async (inputEvent: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(inputEvent.target.value);
      const account = await getAccountByName(inputEvent.target.value);
      if (account) {
        if (account.name === localStorageAccount) {
          setIsSameAccount(true);
          setSearchError(true);
          setAccountAlreadyAdded(false);
        } else if (account.name === localProxy.name) {
          setAccountAlreadyAdded(true);
          setIsSameAccount(false);
          setSearchError(true);
        } else {
          setSearchedAccount(account);
          setIsSameAccount(false);
          setSearchError(false);
        }
      } else {
        setIsSameAccount(false);
        setAccountAlreadyAdded(false);
        setSearchError(true);
      }
    },
    [
      getAccountByName,
      setSearchedAccount,
      setSearchError,
      setSearchValue,
      setIsSameAccount,
      setAccountAlreadyAdded,
      localProxy,
    ]
  );

  const getUpdateAccountTrx = useCallback(async () => {
    const fullAccount = await getFullAccount(localStorageAccount, false);
    if (fullAccount !== undefined && id) {
      const new_options = cloneDeep(fullAccount.account.options);
      new_options.voting_account =
        localProxy && localProxy.id ? localProxy.id : DEFAULT_PROXY_ID;
      const trx = buildUpdateAccountTransaction(
        {
          new_options,
          extensions: { update_last_voting_time: true },
        },
        id
      );
      setPendingTransaction(trx);
      return trx;
    }
  }, [
    getFullAccount,
    localStorageAccount,
    id,
    localProxy,
    localProxy.id,
    localProxy.name,
    buildUpdateAccountTransaction,
    setPendingTransaction,
  ]);

  const checkIsPublishable = useCallback(
    (serverProxy: Proxy, localProxy: Proxy) => {
      if (serverProxy.id === localProxy.id) {
        setIsPublishable(false);
      } else {
        setIsPublishable(true);
      }
    },
    [setIsPublishable]
  );

  const getUpdateAccountFee = useCallback(async () => {
    const trx = await getUpdateAccountTrx();
    if (trx !== undefined) {
      const fee = await getTrxFee([trx]);
      if (fee !== undefined) {
        setUpdateAccountFee(fee);
      }
    }
  }, [getUpdateAccountTrx, getTrxFee, setUpdateAccountFee]);

  const handlePublishChanges = useCallback(
    async (signerKey: SignerKey) => {
      const userDefaultAsset = assets.find(
        (asset) => asset.symbol === defaultToken
      );
      if (
        userDefaultAsset === undefined ||
        (userDefaultAsset.amount as number) < updateAccountFee
      ) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.ERROR,
          message: counterpart.translate(
            `field.errors.balance_not_enough_to_pay`
          ),
        });
        return;
      }
      if (totalGpos <= 0) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.ERROR,
          message: counterpart.translate(`field.errors.need_to_vest_gpos`),
        });
      } else {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.CLEAR,
        });
        let trxResult;
        try {
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADING,
          });
          trxResult = await buildTrx([pendingTransaction], [signerKey]);
        } catch (error) {
          console.log(error);
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_ERROR,
            message: counterpart.translate(`field.errors.transaction_unable`),
          });
        }
        if (trxResult) {
          formAccountBalancesByName(localStorageAccount);
          getUserVotes();
          setIsPublishable(false);
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_SUCCESS,
            message: counterpart.translate(`field.success.published_proxy`),
          });
        } else {
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_ERROR,
            message: counterpart.translate(`field.errors.transaction_unable`),
          });
        }
      }
    },
    [
      assets,
      defaultToken,
      updateAccountFee,
      dispatchTransactionMessage,
      totalGpos,
      buildTrx,
      pendingTransaction,
      formAccountBalancesByName,
      getUserVotes,
      localProxy,
      localProxy.id,
      localProxy.name,
    ]
  );

  const addProxy = useCallback(
    (account: Account) => {
      if (account) {
        const localProxy: Proxy = { name: account.name, id: account.id };
        setLocalProxy(localProxy);
        setSearchedAccount(undefined);
        setSearchError(false);
        setSearchValue("");
        checkIsPublishable(serverProxy, localProxy);
      } else {
        setSearchError(true);
      }
    },
    [setSearchError, setLocalProxy, serverProxy, serverProxy.id, setSearchValue]
  );

  const removeProxy = useCallback(() => {
    const localProxy: Proxy = {
      name: "",
      id: DEFAULT_PROXY_ID,
    };
    setLocalProxy(localProxy);
    checkIsPublishable(serverProxy, localProxy);
  }, [setLocalProxy, DEFAULT_PROXY_ID, serverProxy, serverProxy.id]);

  const resetChanges = useCallback(() => {
    setLocalProxy({ ...serverProxy });
    setIsPublishable(false);
  }, [setLocalProxy, serverProxy, serverProxy.id, setIsPublishable]);

  useEffect(() => {
    getUpdateAccountFee();
  }, [getUpdateAccountFee]);

  useEffect(() => {
    setLocalProxy({ ...serverProxy });
  }, [serverProxy, serverProxy.id, serverProxy.name]);

  return {
    name,
    searchError,
    searchedAccount,
    updateAccountFee,
    transactionMessageState,
    dispatchTransactionMessage,
    addProxy,
    removeProxy,
    searchChange,
    handlePublishChanges,
    localProxy,
    isPublishable,
    resetChanges,
    searchValue,
    isSameAccount,
    accountAlreadyAdded,
  };
}
