import { Dispatch } from "react";

import {
  TransactionMessageAction,
  TransactionMessageState,
} from "../../../hooks";
import { BitcoinSidechainAccounts, SignerKey } from "../../../types";

export type UseGenerateBitcoinAddressResult = {
  sessionBitcoinSidechainAccounts: BitcoinSidechainAccounts | undefined;
  setSessionBitcoinSidechainAccounts: (value: BitcoinSidechainAccounts) => void;
  transactionMessageState: TransactionMessageState;
  dispatchTransactionMessage: Dispatch<TransactionMessageAction>;
  generateBitcoinAddresses: (signerKey: SignerKey) => Promise<void>;
};
