import { FormInstance, Rule } from "antd/lib/form";
import { Dispatch } from "react";

import {
  TransactionMessageAction,
  TransactionMessageState,
} from "../../../../../common/hooks";
import { Asset, SignerKey } from "../../../../../common/types";

export type UseSwapResult = {
  swapForm: FormInstance<SwapForm>;
  formValidation: FormValidation;
  handleSellAssetChange: (value: unknown) => void;
  handleBuyAssetChange: (value: unknown) => void;
  selectedAssetsSymbols: SwapAssetPair;
  localStorageAccount: string;
  transactionMessageState: TransactionMessageState;
  dispatchTransactionMessage: Dispatch<TransactionMessageAction>;
  allAssets: Asset[];
  swapOrderFee: number;
  price?: string;
  loadingSwapData: boolean;
  loadingAssets: boolean;
  handleValuesChange: (changedValues: {
    sellAmount?: string;
    buyAmount?: string;
  }) => Promise<void>;
  handleSwapAssets: () => void;
  buyAssetBalance: number;
  sellAssetBalance: number;
  handleSwapSubmit: (signerKey: SignerKey) => Promise<void>;
  sellAmountErrors: string[];
  buyAmountErrors: string[];
  lastChangedField: SwapInputType;
  buyAssetMarketFee: string;
};

export type SwapInputType = "sellAsset" | "buyAsset";

export type FormValidation = {
  sellAmount: Rule[];
  buyAmount: Rule[];
};

export type SwapForm = {
  sellAmount: string;
  buyAmount: string;
};

export type SwapAssetPair = {
  sellAssetSymbol: string;
  buyAssetSymbol: string;
};
