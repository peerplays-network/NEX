import { Dispatch } from "react";

import {
  TransactionMessageAction,
  TransactionMessageState,
} from "../../../../../../../common/hooks";
import { Asset, SignerKey } from "../../../../../../../common/types";
import {
  BaseOptionType,
  DefaultOptionType,
  FormInstance,
  Rule,
} from "../../../../../../../ui/src";

export type UseSendFormResult = {
  assets: Asset[];
  onAssetChange:
    | ((
        value: unknown,
        option:
          | DefaultOptionType
          | BaseOptionType
          | (DefaultOptionType | BaseOptionType)[]
      ) => void)
    | undefined;
  assetBlockchains: string[];
  sendForm: FormInstance<SendForm>;
  selectedAssetSymbol: string | undefined;
  userAsset: Asset | undefined;
  handleValuesChange: (changedValues: any) => Promise<void>;
  onBlockchainChange: (value: unknown) => void;
  selectedBlockchain: string | undefined;
  formValidation: FormValidation;
  feeAmount: number;
  transactionMessageState: TransactionMessageState;
  dispatchTransactionMessage: Dispatch<TransactionMessageAction>;
  send: (signerKey: SignerKey) => Promise<void>;
  amount: string;
  localStorageAccount: string;
  toAccount: string;
  selectedAssetPrecision: number;
  btcTransferFee: number;
  ethTransferFee: number;
  afterTransactionModalClose?: () => void;
};
export type SendForm = {
  asset: string;
  to: string;
  amount: string;
  blockchain: string;
  memo?: string;
};

export type FormValidation = {
  asset: Rule[];
  to: Rule[];
  amount: Rule[];
  blockchain: Rule[];
};
