import { Dispatch } from "react";

import {
  TransactionMessageAction,
  TransactionMessageState,
} from "../../../../../../../common/hooks";
import { SidechainAccount, SignerKey } from "../../../../../../../common/types";
import { FormInstance, Rule } from "../../../../../../../ui/src";

export type UseWithdrawFormResult = {
  formValidation: FormValidation;
  withdrawForm: FormInstance<WithdrawForm>;
  handleValuesChange: (changedValues: { amount?: string }) => void;
  handleAssetChange: (value: unknown) => void;
  selectedAssetSymbol: string;
  transactionMessageState: TransactionMessageState;
  dispatchTransactionMessage: Dispatch<TransactionMessageAction>;
  handleWithdraw: (signerKey: SignerKey) => Promise<void>;
  amount: string;
  userBalance: number;
  withdrawFee: number;
  btcTransferFee: number;
  selectedAssetPrecision: number;
  bitcoinSidechainAccount:
    | {
        account: SidechainAccount;
        hasDepositAddress: boolean;
      }
    | undefined;
  ethereumSidechainAccount:
    | {
        account: SidechainAccount;
        hasDepositAddress: boolean;
      }
    | undefined;
  getSidechainAccounts: (accountId: string) => Promise<void>;
  loadingSidechainAccounts: boolean;
  ethTransferFee: number;
};

export type FormField = {
  field: string;
  fullField: string;
  type: string;
  validator: unknown;
};

export type FormValidation = {
  from: Rule[];
  amount: Rule[];
  withdrawAddress: Rule[];
  withdrawPublicKey: Rule[];
};

export type WithdrawForm = {
  from: string;
  amount: string;
  withdrawAddress: string;
  withdrawPublicKey: string;
};
