import { Dispatch } from "react";

import { FormInstance, Rule } from "../../../../ui/src";
import {
  TransactionMessageAction,
  TransactionMessageState,
} from "../../../hooks";
import { SignerKey } from "../../../types";

export type UseAddOrUpdateEthereumDepositAddressResult = {
  formValidation: FormValidation;
  ethereumAddressForm: FormInstance<EthereumAddressForm>;
  transactionMessageState: TransactionMessageState;
  dispatchTransactionMessage: Dispatch<TransactionMessageAction>;
  addOrUpdateEthereumDepositAddress: (signerKey: SignerKey) => Promise<void>;
};

export type FormValidation = {
  address: Rule[];
};

export type EthereumAddressForm = {
  address: string;
};
