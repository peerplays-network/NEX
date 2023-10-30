import { useCallback } from "react";

import { useAssetsContext } from "../../providers";
import { Sidechain, Transaction } from "../../types";

import { UseSidechainTransactionBuilderResult } from "./useSidechainTransactionBuilder.types";

export function useSidechainTransactionBuilder(): UseSidechainTransactionBuilderResult {
  const { defaultAsset } = useAssetsContext();

  const buildAddingBitcoinSidechainTransaction = useCallback(
    (
      payer: string,
      sidechain_address_account: string,
      deposit_public_key: string,
      withdraw_public_key: string,
      withdraw_address: string
    ) => {
      const trx: Transaction = {
        type: "sidechain_address_add",
        params: {
          fee: {
            amount: 0,
            asset_id: defaultAsset?.id,
          },
          payer,
          sidechain_address_account,
          sidechain: Sidechain.BITCOIN,
          deposit_public_key,
          deposit_address: "",
          deposit_address_data: "",
          withdraw_public_key,
          withdraw_address,
        },
      };
      return trx;
    },
    [defaultAsset]
  );
  const buildDeletingBitcoinSidechainTransaction = useCallback(
    (
      payer: string,
      sidechain_address_id: string,
      sidechain_address_account: string
    ) => {
      const trx: Transaction = {
        type: "sidechain_address_delete",
        params: {
          fee: {
            amount: 0,
            asset_id: defaultAsset?.id,
          },
          payer,
          sidechain_address_id,
          sidechain_address_account,
          sidechain: Sidechain.BITCOIN,
        },
      };
      return trx;
    },
    [defaultAsset]
  );

  const buildAddingEthereumSidechainTransaction = useCallback(
    (
      payer: string,
      sidechain_address_account: string,
      deposit_address: string,
      withdraw_address: string
    ) => {
      const trx: Transaction = {
        type: "sidechain_address_add",
        params: {
          fee: {
            amount: 0,
            asset_id: defaultAsset?.id,
          },
          payer,
          sidechain_address_account,
          sidechain: Sidechain.ETHEREUM,
          deposit_public_key: deposit_address,
          deposit_address: deposit_address,
          deposit_address_data: "",
          withdraw_public_key: withdraw_address,
          withdraw_address: withdraw_address,
        },
      };
      return trx;
    },
    [defaultAsset]
  );
  const buildDeletingEthereumSidechainTransaction = useCallback(
    (
      payer: string,
      sidechain_address_id: string,
      sidechain_address_account: string
    ) => {
      const trx: Transaction = {
        type: "sidechain_address_delete",
        params: {
          fee: {
            amount: 0,
            asset_id: defaultAsset?.id,
          },
          payer,
          sidechain_address_id,
          sidechain_address_account,
          sidechain: Sidechain.ETHEREUM,
        },
      };
      return trx;
    },
    [defaultAsset]
  );

  return {
    buildAddingBitcoinSidechainTransaction,
    buildDeletingBitcoinSidechainTransaction,
    buildAddingEthereumSidechainTransaction,
    buildDeletingEthereumSidechainTransaction,
  };
}
