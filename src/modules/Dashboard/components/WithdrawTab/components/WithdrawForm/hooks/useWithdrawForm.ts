//done
import counterpart from "counterpart";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  BITCOIN_ASSET_SYMBOL,
  BTC_DEFAULT_WITHDRAWAL_FEE,
  BTC_MIN_WITHDRAWAL,
  defaultToken,
  ETH_DEFAULT_WITHDRAWAL_FEE,
  ETH_MIN_WITHDRAWAL,
  ETHEREUM_ASSET_SYMBOL,
  SON_ACCOUNT_NAME,
} from "../../../../../../../api/params";
import { utils } from "../../../../../../../api/utils";
import {
  TransactionMessageActionType,
  useAccount,
  useAsset,
  useFees,
  useSidechainApi,
  useSidechainTransactionBuilder,
  useSonNetwork,
  useTransactionBuilder,
  useTransactionMessage,
  useTransferTransactionBuilder,
} from "../../../../../../../common/hooks";
import {
  useAssetsContext,
  useUserContext,
} from "../../../../../../../common/providers";
import {
  Account,
  Sidechain,
  SignerKey,
  Transaction,
} from "../../../../../../../common/types";
import { Form } from "../../../../../../../ui/src";

import { UseWithdrawFormResult, WithdrawForm } from "./useWithdrawForm.types";

export function useWithdrawForm(): UseWithdrawFormResult {
  const { limitByPrecision } = useAsset();
  const { sidechainAssets } = useAssetsContext();
  const { isSidechainSonNetworkOk, sonAccount } = useSonNetwork();
  const { sidechainAccounts, loadingSidechainAccounts, getSidechainAccounts } =
    useUserContext();
  const { getAccountByName, formAccountBalancesByName } = useAccount();
  const { account, localStorageAccount, assets, id } = useUserContext();
  const { buildTrx, getTrxFee } = useTransactionBuilder();
  const { calculateTransferFee } = useFees();
  const { buildTransferTransaction } = useTransferTransactionBuilder();
  const {
    buildAddingBitcoinSidechainTransaction,
    buildDeletingBitcoinSidechainTransaction,
    buildAddingEthereumSidechainTransaction,
    buildDeletingEthereumSidechainTransaction,
  } = useSidechainTransactionBuilder();
  const [withdrawForm] = Form.useForm<WithdrawForm>();
  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const { estimateWithdrawalFeeBySidechain } = useSidechainApi();
  const { setPrecision } = useAsset();

  const [withdrawFee, setWithdrawFee] = useState<number>(0);
  const [selectedAssetSymbol, setSelectedAssetSymbol] =
    useState<string>(BITCOIN_ASSET_SYMBOL);
  const [amount, setAmount] = useState<string>("0");
  const [isSonNetworkOk, setIsSonNetworkOk] = useState<boolean>();
  const [btcTransferFee, setBtcTransferFee] = useState<number>(
    BTC_DEFAULT_WITHDRAWAL_FEE
  );
  const [ethTransferFee, setEthTransferFee] = useState<number>(
    ETH_DEFAULT_WITHDRAWAL_FEE
  );

  const selectedAsset = useMemo(() => {
    if (sidechainAssets && sidechainAssets.length > 0) {
      const selectedSidechainAsset = sidechainAssets.find(
        (asset) => asset?.symbol === selectedAssetSymbol
      );
      return selectedSidechainAsset;
    } else {
      return undefined;
    }
  }, [sidechainAssets, selectedAssetSymbol]);
  const userBalance = useMemo(() => {
    if (assets && assets.length > 0) {
      const userAsset = assets.find(
        (asset) => asset.symbol === selectedAssetSymbol
      );
      return userAsset ? (userAsset.amount as number) : 0;
    } else {
      return 0;
    }
  }, [assets, selectedAssetSymbol]);
  const selectedAssetPrecision = useMemo(() => {
    if (selectedAsset) {
      return selectedAsset.precision;
    } else {
      return 8;
    }
  }, [selectedAsset]);
  const bitcoinSidechainAccount = useMemo(() => {
    return sidechainAccounts[Sidechain.BITCOIN];
  }, [sidechainAccounts]);
  const ethereumSidechainAccount = useMemo(() => {
    return sidechainAccounts[Sidechain.ETHEREUM];
  }, [sidechainAccounts]);

  const handleValuesChange = useCallback(
    (changedValues: { amount?: string }) => {
      if (changedValues.amount) {
        const amount = limitByPrecision(
          changedValues.amount,
          selectedAssetPrecision
        );
        withdrawForm.setFieldsValue({
          amount: amount,
        });
      }
    },
    [limitByPrecision, selectedAssetPrecision, withdrawForm]
  );

  const handleAssetChange = useCallback(
    (value: unknown) => {
      const withdrawFormValues: { [segment: string]: string | undefined } = {
        amount: "0",
      };
      if (String(value) === BITCOIN_ASSET_SYMBOL) {
        withdrawFormValues["withdrawAddress"] =
          bitcoinSidechainAccount?.account.withdraw_address;
        withdrawFormValues["withdrawPublicKey"] =
          bitcoinSidechainAccount?.account.withdraw_public_key;
      } else if (String(value) === ETHEREUM_ASSET_SYMBOL) {
        withdrawFormValues["withdrawAddress"] =
          ethereumSidechainAccount?.account.withdraw_address;
      } else {
        withdrawFormValues["withdrawAddress"] = "";
      }
      setSelectedAssetSymbol(String(value));
      withdrawForm.setFieldsValue(withdrawFormValues);
    },
    [
      BITCOIN_ASSET_SYMBOL,
      bitcoinSidechainAccount,
      ETHEREUM_ASSET_SYMBOL,
      ethereumSidechainAccount,
      setSelectedAssetSymbol,
      withdrawForm,
    ]
  );

  const buildWithdrawFormTransaction = useCallback(async () => {
    const values = withdrawForm.getFieldsValue();
    try {
      const from = (
        account ? account : await getAccountByName(localStorageAccount)
      ) as Account;
      const to = sonAccount
        ? sonAccount
        : ((await getAccountByName(SON_ACCOUNT_NAME)) as Account);

      let memo = "";
      if (
        selectedAssetSymbol !== BITCOIN_ASSET_SYMBOL &&
        selectedAssetSymbol !== ETHEREUM_ASSET_SYMBOL
      ) {
        memo = values.withdrawAddress;
      }
      if (selectedAsset) {
        const trx = buildTransferTransaction(
          from,
          to,
          selectedAsset,
          values.amount,
          memo
        );
        return trx;
      }
    } catch (e) {
      console.log(e);
    }
  }, [
    withdrawForm,
    account,
    sonAccount,
    localStorageAccount,
    assets,
    selectedAssetSymbol,
    buildTransferTransaction,
    getAccountByName,
    SON_ACCOUNT_NAME,
    BITCOIN_ASSET_SYMBOL,
    selectedAsset,
    ETHEREUM_ASSET_SYMBOL,
  ]);

  const setWithdrawFeeWithMemo = useCallback(async () => {
    try {
      const trx = await buildWithdrawFormTransaction();
      if (trx !== undefined) {
        const fee = await getTrxFee([trx]);
        fee ? setWithdrawFee(fee) : setWithdrawFee(0);
      } else {
        setWithdrawFee(0);
      }
    } catch (e) {
      console.log(e);
      setWithdrawFee(0);
    }
  }, [buildWithdrawFormTransaction, getTrxFee, setWithdrawFee]);

  /**
   * @returns Promise<errorMessage>
   */
  const handleUpdateEthereumAddresses = useCallback(
    async (signerKey: SignerKey, withdrawAddress: string) => {
      const transactions: Transaction[] = [];
      if (
        ethereumSidechainAccount &&
        ethereumSidechainAccount.hasDepositAddress
      ) {
        const deleteTrx = buildDeletingEthereumSidechainTransaction(
          id,
          ethereumSidechainAccount.account.id,
          id
        );
        transactions.push(deleteTrx);
        const addTrx = buildAddingEthereumSidechainTransaction(
          id,
          id,
          ethereumSidechainAccount.account.deposit_address,
          withdrawAddress
        );
        transactions.push(addTrx);
      } else {
        const addTrx = buildAddingEthereumSidechainTransaction(
          id,
          id,
          withdrawAddress,
          withdrawAddress
        );
        transactions.push(addTrx);
      }

      try {
        const updateSidechainsTrxResult = await buildTrx(
          [...transactions],
          [signerKey]
        );
        if (!updateSidechainsTrxResult) {
          return counterpart.translate(`field.errors.transaction_unable`);
        }
        await getSidechainAccounts(id);
      } catch (e) {
        console.log(e);
        return counterpart.translate(`field.errors.transaction_unable`);
      }
    },
    [
      buildDeletingEthereumSidechainTransaction,
      id,
      ethereumSidechainAccount,
      buildAddingEthereumSidechainTransaction,
      buildTrx,
      getSidechainAccounts,
    ]
  );

  /**
   * @returns Promise<errorMessage>
   */
  const handleUpdateBitcoinAddresses = useCallback(
    async (
      signerKey: SignerKey,
      withdrawPublicKey: string,
      withdrawAddress: string
    ) => {
      const transactions: Transaction[] = [];
      const deleteTrx = buildDeletingBitcoinSidechainTransaction(
        id,
        bitcoinSidechainAccount?.account.id as string,
        id
      );
      transactions.push(deleteTrx);
      const addTrx = buildAddingBitcoinSidechainTransaction(
        id,
        id,
        bitcoinSidechainAccount?.account.deposit_public_key as string,
        withdrawPublicKey,
        withdrawAddress
      );
      transactions.push(addTrx);

      try {
        const updateSidechainsTrxResult = await buildTrx(
          [...transactions],
          [signerKey]
        );
        if (!updateSidechainsTrxResult) {
          return counterpart.translate(`field.errors.transaction_unable`);
        }
        await getSidechainAccounts(id);
      } catch (e) {
        console.log(e);
        return counterpart.translate(`field.errors.transaction_unable`);
      }
    },
    [
      buildDeletingBitcoinSidechainTransaction,
      id,
      bitcoinSidechainAccount,
      buildAddingBitcoinSidechainTransaction,
      buildTrx,
      getSidechainAccounts,
    ]
  );

  const handleWithdraw = async (signerKey: SignerKey) => {
    dispatchTransactionMessage({
      type: TransactionMessageActionType.CLEAR,
    });
    dispatchTransactionMessage({
      type: TransactionMessageActionType.LOADING,
    });
    const values = withdrawForm.getFieldsValue();

    const btcSidechainAddressesChanged =
      values.withdrawAddress !==
        bitcoinSidechainAccount?.account.withdraw_address ||
      values.withdrawPublicKey !==
        bitcoinSidechainAccount?.account.withdraw_public_key;
    if (
      selectedAssetSymbol === BITCOIN_ASSET_SYMBOL &&
      btcSidechainAddressesChanged
    ) {
      const errorMessage = await handleUpdateBitcoinAddresses(
        signerKey,
        values.withdrawPublicKey,
        values.withdrawAddress
      );
      if (errorMessage) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
        return;
      }
    }

    const ethSidechainAddressesChanged =
      values.withdrawAddress !==
      ethereumSidechainAccount?.account.withdraw_address;
    if (
      selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL &&
      ethSidechainAddressesChanged
    ) {
      const errorMessage = await handleUpdateEthereumAddresses(
        signerKey,
        values.withdrawAddress
      );
      if (errorMessage) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
        return;
      }
    }

    try {
      const trx = await buildWithdrawFormTransaction();
      const trxResult = await buildTrx([trx], [signerKey]);
      if (!trxResult) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      } else {
        formAccountBalancesByName(localStorageAccount);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_SUCCESS,
          message: counterpart.translate(
            `field.success.successfully_withdrawn`,
            {
              symbol: selectedAssetSymbol,
              withdrawAmount: amount,
            }
          ),
        });
        withdrawForm.setFieldsValue({
          amount: "0",
        });
      }
    } catch (e) {
      console.log(e);
      dispatchTransactionMessage({
        type: TransactionMessageActionType.LOADED_ERROR,
        message: counterpart.translate(`field.errors.transaction_unable`),
      });
    }
  };

  const validateAmount = async (_: unknown, value: string) => {
    const accountAsset = assets.find(
      (asset) => asset.symbol === selectedAssetSymbol
    );
    const accountDefaultAsset = assets.find(
      (asset) => asset.symbol === defaultToken
    );
    setAmount(value);
    if (Number(value) <= 0) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.amount_should_greater`))
      );
    }
    if (
      selectedAssetSymbol === BITCOIN_ASSET_SYMBOL &&
      Number(value) < BTC_MIN_WITHDRAWAL
    ) {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.amount_should_greater_than`, {
            amount: BTC_MIN_WITHDRAWAL,
          })
        )
      );
    }
    if (
      selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL &&
      Number(value) < ETH_MIN_WITHDRAWAL
    ) {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.amount_should_greater_than`, {
            amount: ETH_MIN_WITHDRAWAL,
          })
        )
      );
    }
    if (!accountAsset) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.balance_not_enough`))
      );
    }
    if ((accountAsset.amount as number) < Number(value)) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.balance_not_enough`))
      );
    }
    if (!accountDefaultAsset) {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.balance_not_enough_to_pay`)
        )
      );
    }
    if ((accountDefaultAsset.amount as number) < withdrawFee) {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.balance_not_enough_to_pay`)
        )
      );
    }

    return Promise.resolve();
  };

  const validateFrom = async (_: unknown, value: string) => {
    if (value !== localStorageAccount)
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.not_your_account`))
      );
    return Promise.resolve();
  };

  const validateSonNetwork = () => {
    if (isSonNetworkOk === undefined) {
      return counterpart.translate(`field.errors.checking_sons_status`);
    } else if (!isSonNetworkOk) {
      return counterpart.translate(`field.errors.sons_not_available`);
    }
  };

  const validateWithdrawPublicKey = async (_: unknown, value: string) => {
    const sonErrorMessage = validateSonNetwork();
    if (sonErrorMessage) return Promise.reject(new Error(sonErrorMessage));

    if (!loadingSidechainAccounts) {
      if (selectedAssetSymbol === BITCOIN_ASSET_SYMBOL) {
        const errorMessage = utils.validateBitcoinCompressedPublicKey(value);
        if (errorMessage) return Promise.reject(new Error(errorMessage));
      }
      return Promise.resolve();
    } else {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.loading_sidechain_accounts`)
        )
      );
    }
  };

  const validateBtcWithdrawAddress = (value: string) => {
    const { withdrawPublicKey } = withdrawForm.getFieldsValue();
    if (!loadingSidechainAccounts) {
      return utils.validateBitcoinAddress(value, withdrawPublicKey);
    } else {
      return counterpart.translate(`field.errors.loading_sidechain_accounts`);
    }
  };
  const validateWithdrawAddress = async (_: unknown, value: string) => {
    const sonErrorMessage = validateSonNetwork();
    if (sonErrorMessage) return Promise.reject(new Error(sonErrorMessage));

    if (selectedAssetSymbol === BITCOIN_ASSET_SYMBOL) {
      const error = validateBtcWithdrawAddress(value);
      if (error) return Promise.reject(new Error(error));
      return Promise.resolve();
    } else if (selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL) {
      const error = utils.validateEthereumAddress(value);
      if (error) return Promise.reject(new Error(error));
      return Promise.resolve();
    } else {
      const { isValid, error } = utils.validateHiveAccount(value);
      if (!isValid) {
        return Promise.reject(new Error(error));
      }
      await setWithdrawFeeWithMemo();
      return Promise.resolve();
    }
  };

  const formValidation = {
    from: [
      {
        required: true,
        message: counterpart.translate(`field.errors.from_required`),
      },
      { validator: validateFrom },
    ],
    amount: [
      {
        required: true,
        message: counterpart.translate(`field.errors.amount_required`),
      },
      { validator: validateAmount },
    ],
    withdrawAddress: [
      {
        required: true,
        message: counterpart.translate(`field.errors.withdraw_add_required`),
      },
      { validator: validateWithdrawAddress },
    ],
    withdrawPublicKey: [
      {
        required: true,
        message: counterpart.translate(
          `field.errors.withdraw_pub_key_required`
        ),
      },
      { validator: validateWithdrawPublicKey },
    ],
  };

  useEffect(() => {
    let ignore = false;
    async function checkSonNetwork() {
      setIsSonNetworkOk(undefined);
      const sidechain = utils.getSidechainFromAssetSymbol(
        selectedAssetSymbol.toUpperCase()
      );
      const isSonNetworkOk = await isSidechainSonNetworkOk(sidechain);
      if (!ignore) {
        setIsSonNetworkOk(isSonNetworkOk);
      }
    }
    checkSonNetwork();
    return () => {
      ignore = true;
    };
  }, [isSidechainSonNetworkOk, selectedAssetSymbol]);

  useEffect(() => {
    const withdrawFee = calculateTransferFee("");
    if (withdrawFee) {
      setWithdrawFee(withdrawFee);
    }
  }, [calculateTransferFee]);

  let didInit = false;
  useEffect(() => {
    if (
      selectedAssetSymbol === BITCOIN_ASSET_SYMBOL &&
      !loadingSidechainAccounts &&
      !didInit
    ) {
      didInit = true;
      withdrawForm.resetFields();
    }
  }, [loadingSidechainAccounts]);

  useEffect(() => {
    let ignore = false;
    async function setSidechainWithdrawalFee() {
      const sidechain = utils.getSidechainFromAssetSymbol(
        selectedAssetSymbol.toUpperCase()
      );
      const sidechainWithdrawalFee = await estimateWithdrawalFeeBySidechain(
        sidechain
      );
      if (!ignore && sidechainWithdrawalFee) {
        if (sidechain === Sidechain.ETHEREUM) {
          setEthTransferFee(
            setPrecision(
              false,
              sidechainWithdrawalFee.amount,
              selectedAssetPrecision
            )
          );
        } else if (sidechain === Sidechain.BITCOIN) {
          setBtcTransferFee(
            setPrecision(
              false,
              sidechainWithdrawalFee.amount,
              selectedAssetPrecision
            )
          );
        }
      }
    }
    setSidechainWithdrawalFee();
    const feeEstimationInterval = setInterval(
      () => setSidechainWithdrawalFee(),
      12000
    );
    return () => {
      ignore = true;
      clearInterval(feeEstimationInterval);
    };
  }, [estimateWithdrawalFeeBySidechain, selectedAssetSymbol]);

  return {
    withdrawForm,
    formValidation,
    handleValuesChange,
    selectedAssetSymbol,
    handleAssetChange,
    transactionMessageState,
    dispatchTransactionMessage,
    handleWithdraw,
    amount,
    userBalance,
    withdrawFee,
    btcTransferFee,
    selectedAssetPrecision,
    bitcoinSidechainAccount,
    getSidechainAccounts,
    loadingSidechainAccounts,
    ethereumSidechainAccount,
    ethTransferFee,
  };
}
