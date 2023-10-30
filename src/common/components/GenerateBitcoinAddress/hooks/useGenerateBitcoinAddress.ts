import * as bitcoin from "bitcoinjs-lib";
import counterpart from "counterpart";
import ECPairFactory from "ecpair";
import { useCallback } from "react";
import * as ecc from "tiny-secp256k1";

import { testnetCheck } from "../../../../api/params";
import {
  TransactionMessageActionType,
  useSidechainTransactionBuilder,
  useSonNetwork,
  useTransactionBuilder,
  useTransactionMessage,
} from "../../../hooks";
import { useUserContext } from "../../../providers";
import { BitcoinAccount, Sidechain, SignerKey } from "../../../types";

import { UseGenerateBitcoinAddressResult } from "./useGenerateBitcoinAddress.types";

const NETWORK = testnetCheck ? bitcoin.networks.regtest : undefined;

export function useGenerateBitcoinAddress(
  getSidechainAccounts: (accountId: string) => Promise<void>
): UseGenerateBitcoinAddressResult {
  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const { buildTrx } = useTransactionBuilder();
  const {
    id,
    sessionBitcoinSidechainAccounts,
    setSessionBitcoinSidechainAccounts,
  } = useUserContext();
  const { isSidechainSonNetworkOk } = useSonNetwork();
  const { buildAddingBitcoinSidechainTransaction } =
    useSidechainTransactionBuilder();

  const toHex = useCallback((buffer: Buffer) => {
    return Array.from(buffer)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }, []);

  const generateNewAddress = (): BitcoinAccount => {
    const ECPair = ECPairFactory(ecc);
    const keyPair = ECPair.makeRandom({ network: NETWORK });
    const address = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: NETWORK,
    });
    return {
      address: address.address as string,
      pubKey: toHex(address.pubkey as Buffer),
      privateKey: keyPair.toWIF(),
    };
  };

  const generateBitcoinAddresses = useCallback(
    async (signerKey: SignerKey) => {
      dispatchTransactionMessage({
        type: TransactionMessageActionType.CLEAR,
      });
      dispatchTransactionMessage({
        type: TransactionMessageActionType.LOADING,
      });

      try {
        const isSonOk = await isSidechainSonNetworkOk(Sidechain.BITCOIN);

        if (!isSonOk) {
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
      const deposit = generateNewAddress();
      const withdraw = generateNewAddress();

      setSessionBitcoinSidechainAccounts({ deposit, withdraw });

      const trx = buildAddingBitcoinSidechainTransaction(
        id,
        id,
        deposit.pubKey,
        withdraw.pubKey,
        withdraw.address
      );

      let trxResult;

      try {
        trxResult = await buildTrx([trx], [signerKey]);
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
            `field.success.successfully_generate_btc_addresses`
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
      buildAddingBitcoinSidechainTransaction,
      buildTrx,
      getSidechainAccounts,
      setSessionBitcoinSidechainAccounts,
      dispatchTransactionMessage,
      id,
      isSidechainSonNetworkOk,
    ]
  );

  return {
    sessionBitcoinSidechainAccounts,
    setSessionBitcoinSidechainAccounts,
    transactionMessageState,
    dispatchTransactionMessage,
    generateBitcoinAddresses,
  };
}
