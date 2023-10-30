import counterpart from "counterpart";
import { useCallback } from "react";

import { utils } from "../../../../api/utils";
import { Form } from "../../../../ui/src";
import {
  TransactionMessageActionType,
  useSidechainTransactionBuilder,
  useSonNetwork,
  useTransactionBuilder,
  useTransactionMessage,
} from "../../../hooks";
import { useUserContext } from "../../../providers";
import {
  Sidechain,
  SidechainAccount,
  SignerKey,
  Transaction,
} from "../../../types";

import {
  EthereumAddressForm,
  UseAddOrUpdateEthereumDepositAddressResult,
} from "./useAddOrUpdateEthereumDepositAddress.types";

export function useAddOrUpdateEthereumDepositAddress(
  getSidechainAccounts: (accountId: string) => Promise<void>,
  ethereumSidechainAccount?: {
    account: SidechainAccount;
    hasDepositAddress: boolean;
  }
): UseAddOrUpdateEthereumDepositAddressResult {
  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const { buildTrx } = useTransactionBuilder();
  const { id } = useUserContext();
  const { isSidechainSonNetworkOk } = useSonNetwork();
  const {
    buildAddingEthereumSidechainTransaction,
    buildDeletingEthereumSidechainTransaction,
  } = useSidechainTransactionBuilder();

  const [ethereumAddressForm] = Form.useForm<EthereumAddressForm>();

  const addOrUpdateEthereumDepositAddress = useCallback(
    async (signerKey: SignerKey) => {
      dispatchTransactionMessage({
        type: TransactionMessageActionType.CLEAR,
      });
      dispatchTransactionMessage({
        type: TransactionMessageActionType.LOADING,
      });
      const { address } = ethereumAddressForm.getFieldsValue();
      // check son network
      try {
        const isSonNetworkOk = await isSidechainSonNetworkOk(
          Sidechain.ETHEREUM
        );

        if (!isSonNetworkOk) {
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_ERROR,
            message: counterpart.translate(
              `field.errors.sons_not_available_try_again`
            ),
          });
          return;
        }
      } catch (e) {
        console.log(e);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(
            `field.errors.sons_not_available_try_again`
          ),
        });
        return;
      }
      const transactions: Transaction[] = [];
      if (
        ethereumSidechainAccount &&
        ethereumSidechainAccount.hasDepositAddress
      ) {
        const withdrawAddress =
          ethereumSidechainAccount.account.withdraw_address;
        const deleteTrx = buildDeletingEthereumSidechainTransaction(
          id,
          ethereumSidechainAccount.account.id,
          id
        );
        transactions.push(deleteTrx);
        const addTrx = buildAddingEthereumSidechainTransaction(
          id,
          id,
          address,
          withdrawAddress
        );
        transactions.push(addTrx);
      } else {
        const trx = buildAddingEthereumSidechainTransaction(
          id,
          id,
          address,
          address
        );
        transactions.push(trx);
      }

      let trxResult;

      try {
        trxResult = await buildTrx([...transactions], [signerKey]);
      } catch (error) {
        console.log(error);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      }
      if (trxResult) {
        setTimeout(async () => {
          await getSidechainAccounts(id);
        }, 3000);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_SUCCESS,
          message: counterpart.translate(
            `field.success.successfully_generate_eth_addresses`
          ),
        });
      } else {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      }
    },
    [
      buildDeletingEthereumSidechainTransaction,
      buildAddingEthereumSidechainTransaction,
      buildTrx,
      getSidechainAccounts,
      dispatchTransactionMessage,
      id,
      isSidechainSonNetworkOk,
      ethereumAddressForm,
      ethereumSidechainAccount,
    ]
  );

  const validateEthereumAddress = async (_: unknown, value: string) => {
    const error = utils.validateEthereumAddress(value);
    if (error) return Promise.reject(new Error(error));
    return Promise.resolve();
  };

  const formValidation = {
    address: [
      {
        required: true,
        message: counterpart.translate(`field.errors.withdraw_add_required`),
      },
      { validator: validateEthereumAddress },
    ],
  };

  return {
    ethereumAddressForm,
    formValidation,
    transactionMessageState,
    dispatchTransactionMessage,
    addOrUpdateEthereumDepositAddress,
  };
}
