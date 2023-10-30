import { RadioChangeEvent } from "antd";
import counterpart from "counterpart";
import * as moment from "moment";
import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";

import { defaultToken } from "../../../../../../../api/params";
import {
  TransactionMessageActionType,
  useAccount,
  useAsset,
  useFees,
  useOrderTransactionBuilder,
  useTransactionBuilder,
  useTransactionMessage,
} from "../../../../../../../common/hooks";
import {
  useMarketContext,
  useUserContext,
} from "../../../../../../../common/providers";
import { Asset, OrderForm, SignerKey } from "../../../../../../../common/types";
import { Form } from "../../../../../../../ui/src";

import {
  ExecutionType,
  TimePolicy,
  UseOrderFormResult,
} from "./useOrderForm.types";

type Args = {
  isBuyForm: boolean;
  precisions: {
    price: number;
    amount: number;
    total: number;
  };
};
export function useOrderForm({
  isBuyForm,
  precisions,
}: Args): UseOrderFormResult {
  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const { buildCreateLimitOrderTransaction } = useOrderTransactionBuilder();
  const { buildTrx } = useTransactionBuilder();
  const { assets, id, localStorageAccount } = useUserContext();
  const { formAccountBalancesByName } = useAccount();
  const { limitByPrecision } = useAsset();
  const router = useRouter();
  const { pair } = router.query;
  const {
    buyOrderForm,
    sellOrderForm,
    selectedPair,
    lastTradeHistory,
    asks,
    bids,
  } = useMarketContext();
  const { calculateCreateLimitOrderFee } = useFees();

  const [timePolicy, setTimePolicy] = useState<TimePolicy>(
    TimePolicy.Good_Til_Canceled
  );
  const [priceRadioValue, setPriceRadioValue] = useState<string>();
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [executionValue, setExecutionValue] =
    useState<ExecutionType>("allow-taker");
  const [expirationCustomTime, setExpirationCustomTime] =
    useState<moment.Moment | null>(null);

  const orderForm = useMemo(() => {
    return isBuyForm ? buyOrderForm : sellOrderForm;
  }, [isBuyForm, buyOrderForm, sellOrderForm]);
  const transactionModalPrice: string = Form.useWatch("price", orderForm);
  const transactionModalAmount: string = Form.useWatch("amount", orderForm);
  const transactionModalTotal: string = Form.useWatch("total", orderForm);

  const balance = useMemo(() => {
    const baseSymbol = (pair as string).split("_")[1];
    const quoteSymbol = (pair as string).split("_")[0];
    if (assets && assets.length > 0) {
      const userBaseAsset = assets.find((asset) => asset.symbol === baseSymbol);
      const userQuoteAsset = assets.find(
        (asset) => asset.symbol === quoteSymbol
      );
      const baseAmount = userBaseAsset ? (userBaseAsset.amount as number) : 0;
      const quoteAmount = userQuoteAsset
        ? (userQuoteAsset.amount as number)
        : 0;
      return isBuyForm
        ? `${baseAmount} ${baseSymbol}`
        : `${quoteAmount} ${quoteSymbol}`;
    } else {
      return `0 ${isBuyForm ? baseSymbol : quoteSymbol}`;
    }
  }, [assets, pair, isBuyForm]);

  const fees = useMemo(() => {
    if (selectedPair) {
      const createLimitOrderFee = calculateCreateLimitOrderFee(
        selectedPair.base,
        selectedPair.quote
      );
      if (createLimitOrderFee !== undefined) {
        const feeAmount = createLimitOrderFee.fee;
        const marketFeePercent = isBuyForm
          ? createLimitOrderFee.buyMarketFeePercent
          : createLimitOrderFee.sellMarketFeePercent;
        return { feeAmount, marketFeePercent };
      } else {
        return { feeAmount: 0, marketFeePercent: 0 };
      }
    } else {
      return { feeAmount: 0, marketFeePercent: 0 };
    }
  }, [selectedPair, calculateCreateLimitOrderFee, isBuyForm]);

  const handleFieldPrecision = useCallback(
    (fieldValue: string, fieldName: string, precision: number) => {
      const precisedValue = limitByPrecision(fieldValue, precision);

      const fieldsValueObject: {
        [fieldName: string]: string;
      } = {};
      fieldsValueObject[`${fieldName}`] = precisedValue;

      orderForm.setFieldsValue(fieldsValueObject);
    },
    [orderForm, limitByPrecision]
  );
  const handleFormPrecision = useCallback(
    (changedValues: { price?: string; amount?: string; total?: string }) => {
      if (changedValues.price) {
        handleFieldPrecision(changedValues.price, "price", precisions.price);
      }
      if (changedValues.amount) {
        handleFieldPrecision(changedValues.amount, "amount", precisions.amount);
      }
      if (changedValues.total) {
        handleFieldPrecision(changedValues.total, "total", precisions.total);
      }
    },
    [handleFieldPrecision, precisions]
  );
  const handleRelationsBetweenInputs = useCallback(
    (
      changedValues: { price?: string; amount?: string },
      allValues: { price?: string; amount?: string }
    ) => {
      let baseRoundTo = 5;
      if (selectedPair) {
        baseRoundTo = selectedPair.base.precision;
      }
      if (
        changedValues.price !== undefined ||
        changedValues.amount !== undefined
      ) {
        if (
          allValues.price &&
          Number(allValues.price) > 0 &&
          allValues.amount &&
          Number(allValues.amount) > 0
        ) {
          orderForm.setFieldsValue({
            total: limitByPrecision(
              Number(allValues.price) * Number(allValues.amount),
              baseRoundTo
            ),
          });
        } else {
          orderForm.setFieldsValue({
            total: undefined,
          });
        }
      }
    },
    [orderForm, selectedPair]
  );
  const specifySliderValue = useCallback(() => {
    const allValues = orderForm.getFieldsValue();
    if (isBuyForm) {
      const userBaseBalance =
        assets && assets.length
          ? assets.find((asset) => asset.symbol === selectedPair?.base.symbol)
              ?.amount
          : 0;
      if (allValues.total) {
        const sliderValue = userBaseBalance
          ? Math.floor((Number(allValues.total) / userBaseBalance) * 100)
          : 0;
        setSliderValue(sliderValue);
      } else {
        setSliderValue(0);
      }
    } else {
      const userQuoteBalance =
        assets && assets.length
          ? assets.find((asset) => asset.symbol === selectedPair?.quote.symbol)
              ?.amount
          : 0;
      if (allValues.amount) {
        const sliderValue = userQuoteBalance
          ? Math.floor((Number(allValues.amount) / userQuoteBalance) * 100)
          : 0;
        setSliderValue(sliderValue);
      } else {
        setSliderValue(0);
      }
    }
  }, [orderForm, isBuyForm, assets, selectedPair, setSliderValue]);

  const handleValuesChange = useCallback(
    (
      changedValues: { price?: string; amount?: string },
      allValues: { price?: string; amount?: string }
    ) => {
      handleFormPrecision(changedValues);
      handleRelationsBetweenInputs(changedValues, allValues);
      specifySliderValue();
    },
    [handleFormPrecision, handleRelationsBetweenInputs, specifySliderValue]
  );

  const handlePriceRadioGroupChange = useCallback(
    ({ target: { value } }: RadioChangeEvent) => {
      setPriceRadioValue(value);
      const currentPrice = lastTradeHistory
        ? lastTradeHistory.price
        : undefined;
      let price: string | undefined = undefined;
      const orders = isBuyForm ? asks : bids;
      switch (value) {
        case "mid":
          price = currentPrice;
          break;
        case "book":
          price = orders && orders.length ? orders[0].price : undefined;
          break;
        case "1":
          price = currentPrice
            ? String(Number(currentPrice) * 0.99)
            : undefined;
          break;
        case "5":
          price = currentPrice
            ? String(Number(currentPrice) * 0.95)
            : undefined;
          break;
        case "10":
          price = currentPrice ? String(Number(currentPrice) * 0.9) : undefined;
          break;
      }
      orderForm.setFieldsValue({
        price: price,
      });
      const allValues = orderForm.getFieldsValue();
      handleValuesChange({ price: price }, allValues);
    },
    [
      setPriceRadioValue,
      lastTradeHistory,
      isBuyForm,
      asks,
      bids,
      orderForm,
      handleValuesChange,
    ]
  );
  const clearPriceRadioGroup = useCallback(() => {
    setPriceRadioValue(undefined);
  }, [setPriceRadioValue]);

  const handleSliderChange = useCallback(
    (value: number) => {
      if (isBuyForm) {
        const userBaseBalance =
          assets && assets.length
            ? assets.find((asset) => asset.symbol === selectedPair?.base.symbol)
                ?.amount
            : 0;
        const total = userBaseBalance
          ? String(userBaseBalance * (value / 100))
          : "0";
        const formPrice: string = orderForm.getFieldValue("price");
        const askPrice = asks && asks.length ? asks[0].price : undefined;
        const price = formPrice && formPrice !== "0" ? formPrice : askPrice;
        const amount = price ? String(Number(total) / Number(price)) : "0";
        orderForm.setFieldsValue({
          amount: amount,
          price: price,
          total: total,
        });
        const allValues = orderForm.getFieldsValue();
        handleValuesChange(
          {
            amount: amount,
            price: price,
          },
          allValues
        );
      } else {
        const userQuoteBalance =
          assets && assets.length
            ? assets.find(
                (asset) => asset.symbol === selectedPair?.quote.symbol
              )?.amount
            : 0;
        const amount = userQuoteBalance
          ? String(userQuoteBalance * (value / 100))
          : "0";
        orderForm.setFieldsValue({
          amount: amount,
        });
        const allValues = orderForm.getFieldsValue();
        handleValuesChange({ amount: amount }, allValues);
      }
    },
    [
      setSliderValue,
      isBuyForm,
      assets,
      selectedPair,
      asks,
      orderForm,
      handleValuesChange,
    ]
  );

  const timePolicyOptions = [
    {
      label: counterpart.translate(
        "pages.market.tabs.controls.good_til_canceled"
      ),
      value: TimePolicy.Good_Til_Canceled,
    },
    {
      label: counterpart.translate("pages.market.tabs.controls.good_til_time"),
      value: TimePolicy.Good_Til_Time,
    },
    {
      label: counterpart.translate("pages.market.tabs.controls.fill_or_kill"),
      value: TimePolicy.Fill_Or_Kill,
    },
    {
      label: counterpart.translate(
        "pages.market.tabs.controls.immediate_or_cancel"
      ),
      value: TimePolicy.Immediate_Or_Cancel,
    },
  ];
  const handleTimePolicyChange = useCallback(
    (value: any) => {
      setTimePolicy(value);
      setExpirationCustomTime(null);
    },
    [setTimePolicy, setExpirationCustomTime]
  );
  const handleExpirationCustomChange = useCallback(
    (value: moment.Moment | null, _dateString: string) => {
      setExpirationCustomTime(value);
    },
    [setExpirationCustomTime]
  );

  const handleExecutionChange = useCallback(
    ({ target: { value } }: RadioChangeEvent) => {
      setExecutionValue(value);
    },
    [setExecutionValue]
  );

  const validatePrice = (_: unknown, value: number) => {
    if (Number(value) <= 0) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.price_should_greater`))
      );
    }
    return Promise.resolve();
  };
  const validateAmount = (_: unknown, value: number) => {
    if (Number(value) <= 0) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.amount_should_greater`))
      );
    }
    const userQuoteAsset = assets.find(
      (asset) => asset.symbol === selectedPair?.quote.symbol
    );
    if (!isBuyForm) {
      if (!userQuoteAsset) {
        return Promise.reject(
          new Error(counterpart.translate(`field.errors.balance_not_enough`))
        );
      }
      if (selectedPair?.quote.symbol === defaultToken) {
        if (
          Number(value) + fees.feeAmount >
          (userQuoteAsset?.amount as number)
        ) {
          return Promise.reject(
            new Error(counterpart.translate(`field.errors.balance_not_enough`))
          );
        }
      } else {
        if (Number(value) > (userQuoteAsset?.amount as number)) {
          return Promise.reject(
            new Error(counterpart.translate(`field.errors.balance_not_enough`))
          );
        }
      }
    }
    return Promise.resolve();
  };
  const validateTotalForBuyOrders = (value: number) => {
    let errorMessage = "";
    const userBaseAsset = assets.find(
      (asset) => asset.symbol === selectedPair?.base.symbol
    );
    if (!userBaseAsset) {
      errorMessage = counterpart.translate(`field.errors.balance_not_enough`);
    }
    if (selectedPair?.base.symbol === defaultToken) {
      if (Number(value) + fees.feeAmount > (userBaseAsset?.amount as number)) {
        errorMessage = counterpart.translate(`field.errors.balance_not_enough`);
      }
    } else {
      if (Number(value) > (userBaseAsset?.amount as number)) {
        errorMessage = counterpart.translate(`field.errors.balance_not_enough`);
      }
    }
    if (
      userBaseAsset === undefined ||
      Number(value) > (userBaseAsset?.amount as number)
    ) {
      errorMessage = counterpart.translate(`field.errors.balance_not_enough`);
    }
    return errorMessage;
  };
  const validateTotal = (_: unknown, value: number) => {
    if (Number(value) <= 0) {
      return Promise.reject(
        new Error(counterpart.translate(`field.errors.total_should_greater`))
      );
    }
    const userDefaultAsset = assets.find(
      (asset) => asset.symbol === defaultToken
    );
    if (
      userDefaultAsset === undefined ||
      fees.feeAmount > (userDefaultAsset?.amount as number)
    ) {
      return Promise.reject(
        new Error(
          counterpart.translate(`field.errors.balance_not_enough_to_pay`)
        )
      );
    }

    if (isBuyForm) {
      const errorMessage = validateTotalForBuyOrders(value);
      if (errorMessage !== "") {
        return Promise.reject(new Error(errorMessage));
      }
    }
    return Promise.resolve();
  };
  const formValidation = {
    price: [
      {
        required: true,
        message: counterpart.translate(`field.errors.field_is_required`),
      },
      { validator: validatePrice },
    ],
    amount: [
      {
        required: true,
        message: counterpart.translate(`field.errors.field_is_required`),
      },
      { validator: validateAmount },
    ],
    total: [
      {
        required: true,
        message: counterpart.translate(`field.errors.field_is_required`),
      },
      { validator: validateTotal },
    ],
  };

  const createLimitOrderTimePolicy = useCallback(
    (timePolicy: TimePolicy, expirationCustomTime: moment.Moment | null) => {
      let expiration = "";
      let fillOrKill = false;
      switch (timePolicy) {
        case TimePolicy.Fill_Or_Kill:
          expiration = new Date(
            new Date().getTime() + 1000 * 60 * 60 * 24 * 365
          ).toISOString();
          fillOrKill = true;
          break;
        case TimePolicy.Good_Til_Canceled:
          expiration = new Date(
            new Date().getTime() + 1000 * 60 * 60 * 24 * 365
          ).toISOString();
          break;
        case TimePolicy.Immediate_Or_Cancel:
          expiration = new Date(new Date().getTime() + 3000).toISOString();
          break;
        case TimePolicy.Good_Til_Time:
          expiration = (expirationCustomTime as moment.Moment)
            .toDate()
            .toISOString();
      }
      return { expiration, fillOrKill };
    },
    []
  );
  const checkPostOnlyPossibility = useCallback(
    (values: OrderForm) => {
      const price = values.price;
      if (isBuyForm) {
        return !asks || !asks.length ? true : price < asks[0].price;
      } else {
        return !bids || !bids.length ? true : price > bids[0].price;
      }
    },
    [isBuyForm, asks, bids]
  );
  const handleCreateLimitOrder = useCallback(
    async (signerKey: SignerKey) => {
      dispatchTransactionMessage({
        type: TransactionMessageActionType.CLEAR,
      });
      const values = orderForm.getFieldsValue();
      if (timePolicy === TimePolicy.Good_Til_Time && !expirationCustomTime) {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.ERROR,
          message: counterpart.translate(
            "field.errors.missing_custom_expiration_time"
          ),
        });
        return;
      }
      const { expiration, fillOrKill } = createLimitOrderTimePolicy(
        timePolicy,
        expirationCustomTime
      );
      if (executionValue === "post-only") {
        const isPossible = checkPostOnlyPossibility(values);
        if (!isPossible) {
          dispatchTransactionMessage({
            type: TransactionMessageActionType.ERROR,
            message: counterpart.translate(
              "field.errors.post_only_limit_order"
            ),
          });
          return;
        }
      }
      const amounts = {
        quantity: values.amount,
        total: values.total,
      };
      const assetPairs = {
        base: selectedPair?.base as Asset,
        quote: selectedPair?.quote as Asset,
      };

      const trx = buildCreateLimitOrderTransaction(
        id,
        amounts,
        assetPairs,
        expiration,
        fillOrKill,
        [],
        isBuyForm
      );
      let trxResult;
      try {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADING,
        });
        trxResult = await buildTrx([trx], [signerKey]);
      } catch (e) {
        console.log(e);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      }
      if (trxResult) {
        formAccountBalancesByName(localStorageAccount);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_SUCCESS,
          message: counterpart.translate(
            `field.success.limit_order_successfully`
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
      dispatchTransactionMessage,
      orderForm,
      buildCreateLimitOrderTransaction,
      id,
      selectedPair,
      isBuyForm,
      buildTrx,
      localStorageAccount,
      formAccountBalancesByName,
      timePolicy,
      executionValue,
      checkPostOnlyPossibility,
      createLimitOrderTimePolicy,
      expirationCustomTime,
    ]
  );

  return {
    balance,
    fees,
    formValidation,
    timePolicyOptions,
    handleValuesChange,
    orderForm,
    handlePriceRadioGroupChange,
    priceRadioValue,
    clearPriceRadioGroup,
    handleSliderChange,
    sliderValue,
    timePolicy,
    handleTimePolicyChange,
    transactionMessageState,
    handleCreateLimitOrder,
    dispatchTransactionMessage,
    executionValue,
    handleExecutionChange,
    expirationCustomTime,
    handleExpirationCustomChange,
    transactionModalPrice,
    transactionModalAmount,
    transactionModalTotal,
  };
}
