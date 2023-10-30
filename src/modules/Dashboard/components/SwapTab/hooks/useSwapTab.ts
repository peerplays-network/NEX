import counterpart from "counterpart";
import { sum } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

import { defaultToken } from "../../../../../api/params";
import {
  TransactionMessageActionType,
  useAccount,
  useAsset,
  useFees,
  useOrderBook,
  useOrderTransactionBuilder,
  useTransactionBuilder,
  useTransactionMessage,
  useUpdateExchanges,
} from "../../../../../common/hooks";
import {
  useAssetsContext,
  usePeerplaysApiContext,
  useUserContext,
} from "../../../../../common/providers";
import { Asset, BookedOrder, SignerKey } from "../../../../../common/types";
import { Form } from "../../../../../ui/src";

import {
  SwapAssetPair,
  SwapForm,
  SwapInputType,
  UseSwapResult,
} from "./useSwapTab.types";

export function useSwap(): UseSwapResult {
  const { exchanges, updateSwapPair } = useUpdateExchanges();
  const { transactionMessageState, dispatchTransactionMessage } =
    useTransactionMessage();
  const { localStorageAccount, assets, id } = useUserContext();
  const [selectedAssetsSymbols, setSelectedAssetsSymbols] =
    useState<SwapAssetPair>({
      sellAssetSymbol: exchanges.swapPair?.split("_")[1],
      buyAssetSymbol: exchanges.swapPair?.split("_")[0],
    });
  const previousPair = useRef<string>(exchanges.swapPair);
  const [lastChangedField, setLastChangedField] =
    useState<SwapInputType>("sellAsset");
  const [loadingSwapData, setLoadingSwapData] = useState<boolean>(false);
  const [calculatedPrice, setCalculatedPrice] = useState<string>();
  const [orderPrice, setOrderPrice] = useState<number>(0);
  const [buyLiquidityVolume, setBuyLiquidityVolume] = useState<number>(0);
  const [sellLiquidityVolume, setSellLiquidityVolume] = useState<number>(0);
  const [allAssets, _setAllAssets] = useState<Asset[]>([]);
  const [swapOrderFee, setSwapOrderFee] = useState<number>(0);
  const [loadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sellAssetBalance, setSellAssetBalance] = useState<number>(0);
  const [buyAssetBalance, setBuyAssetBalance] = useState<number>(0);
  const [sellAmountErrors, setSellAmountErrors] = useState<string[]>([
    counterpart.translate(`buttons.enter_amount`),
  ]);
  const [buyAmountErrors, setBuyAmountErrors] = useState<string[]>([]);
  const [sellAsset, setSellAsset] = useState<Asset | undefined>();
  const [buyAsset, setBuyAsset] = useState<Asset | undefined>();
  const [middleTrxCoreAmount, setMiddleTrxCoreAmount] = useState<number>(0);
  const [middleTrxOrderPrice, setMiddleTrxOrderPrice] = useState<number>(0);
  const [buyAssetMarketFee, setBuyAssetMarketFee] = useState<string>("0");

  const [swapForm] = Form.useForm<SwapForm>();
  const { buildTrx } = useTransactionBuilder();
  const { formAccountBalancesByName } = useAccount();
  const { buildSwapTransaction } = useOrderTransactionBuilder();
  const { calculateCreateLimitOrderFee } = useFees();
  const { getAllAssets } = useAsset();
  const { getOrderBook } = useOrderBook();
  const { defaultAsset } = useAssetsContext();
  const { limitByPrecision } = useAsset();
  const { dbApi } = usePeerplaysApiContext();

  const calculateBasePairSellLiquidity = useCallback((asks: BookedOrder[]) => {
    const sellLiquidityVolume = sum(asks.map((ask) => Number(ask.base)));
    return sellLiquidityVolume;
  }, []);

  const calculateBasePairBuyLiquidity = useCallback((asks: BookedOrder[]) => {
    const buyLiquidityVolume = sum(asks.map((ask) => Number(ask.quote)));
    return buyLiquidityVolume;
  }, []);

  const calculateBasePairPriceForSellAmount = useCallback(
    (sellAmount: number, asks: BookedOrder[]) => {
      const initialValue = sellAmount;
      const usedOrders = [] as {
        price: number;
        buyAmount: number;
      }[];

      let i = 0;
      while (sellAmount > 0) {
        usedOrders.push({
          price: Number(asks[i].price),
          buyAmount:
            sellAmount < Number(asks[i].base)
              ? sellAmount / Number(asks[i].price)
              : Number(asks[i].quote),
        });
        sellAmount = sellAmount - Number(asks[i].base);
        i = i + 1;
      }
      const buyAmount = sum(usedOrders.map((order) => order.buyAmount));
      const calculatedPrice = initialValue / buyAmount;
      const orderPrice = usedOrders[usedOrders.length - 1].price;
      return { calculatedPrice, orderPrice };
    },
    []
  );

  const calculateBasePairPriceForBuyAmount = useCallback(
    (buyAmount: number, asks: BookedOrder[]) => {
      const initialValue = buyAmount;
      const usedOrders = [] as { price: number; sellAmount: number }[];
      let i = 0;
      while (buyAmount > 0) {
        usedOrders.push({
          price: Number(asks[i].price),
          sellAmount:
            buyAmount < Number(asks[i].quote)
              ? buyAmount * Number(asks[i].price)
              : Number(asks[i].base),
        });
        buyAmount = buyAmount - Number(asks[i].quote);
        i = i + 1;
      }
      const sellAmount = sum(usedOrders.map((order) => order.sellAmount));
      const calculatedPrice = sellAmount / initialValue;
      const orderPrice = usedOrders[usedOrders.length - 1].price;
      return { calculatedPrice, orderPrice };
    },
    []
  );

  const calculateNonBasePairSellLiquidity = useCallback(
    (sellToCoreAsks: BookedOrder[], coreToBuyAsks: BookedOrder[]) => {
      const availableCoreToBuy = sum(
        sellToCoreAsks.map((ask) => Number(ask.quote))
      );
      const availableCoreToSell = sum(
        coreToBuyAsks.map((ask) => Number(ask.base))
      );

      if (availableCoreToSell > 0) {
        if (availableCoreToSell <= availableCoreToBuy) {
          const limitedAvailableCoreToSell = Number(
            limitByPrecision(availableCoreToSell, defaultAsset?.precision)
          );
          const { calculatedPrice } = calculateBasePairPriceForBuyAmount(
            limitedAvailableCoreToSell,
            sellToCoreAsks
          );
          return calculatedPrice * limitedAvailableCoreToSell;
        } else {
          return calculateBasePairSellLiquidity(sellToCoreAsks);
        }
      } else {
        return 0;
      }
    },
    [
      calculateBasePairPriceForBuyAmount,
      calculateBasePairSellLiquidity,
      limitByPrecision,
      defaultAsset,
    ]
  );
  const calculateNonBasePairPriceForSellAmount = useCallback(
    (
      sellAmount: number,
      sellToCoreAsks: BookedOrder[],
      coreToBuyAsks: BookedOrder[]
    ) => {
      const {
        calculatedPrice: sellToCorePrice,
        orderPrice: sellToCoreOrderPrice,
      } = calculateBasePairPriceForSellAmount(sellAmount, sellToCoreAsks);
      const coreAmount = sellAmount / sellToCorePrice;
      const limitedCoreAmount = Number(
        limitByPrecision(coreAmount, defaultAsset?.precision)
      );
      setMiddleTrxCoreAmount(limitedCoreAmount);
      setMiddleTrxOrderPrice(sellToCoreOrderPrice);

      const {
        calculatedPrice: coreToBuyPrice,
        orderPrice: coreToBuyOrderPrice,
      } = calculateBasePairPriceForSellAmount(limitedCoreAmount, coreToBuyAsks);

      const buyAmount = coreAmount / coreToBuyPrice;
      const calculatedPrice = sellAmount / buyAmount;
      return { calculatedPrice, orderPrice: coreToBuyOrderPrice };
    },
    [calculateBasePairPriceForSellAmount, defaultAsset, limitByPrecision]
  );

  const calculateNonBasePairBuyLiquidity = useCallback(
    (sellToCoreAsks: BookedOrder[], coreToBuyAsks: BookedOrder[]) => {
      const availableCoreToBuy = sum(
        sellToCoreAsks.map((ask) => Number(ask.quote))
      );
      const availableCoreToSell = sum(
        coreToBuyAsks.map((ask) => Number(ask.base))
      );
      if (availableCoreToSell > 0) {
        if (availableCoreToSell <= availableCoreToBuy) {
          return calculateBasePairBuyLiquidity(coreToBuyAsks);
        } else {
          const limitedAvailableCoreToBuy = Number(
            limitByPrecision(availableCoreToBuy, defaultAsset?.precision)
          );
          const { calculatedPrice } = calculateBasePairPriceForSellAmount(
            limitedAvailableCoreToBuy,
            coreToBuyAsks
          );
          return limitedAvailableCoreToBuy / calculatedPrice;
        }
      } else {
        return 0;
      }
    },
    [
      calculateBasePairBuyLiquidity,
      calculateBasePairPriceForSellAmount,
      defaultAsset,
      limitByPrecision,
    ]
  );

  const calculateNonBasePairPriceForBuyAmount = useCallback(
    (
      buyAmount: number,
      sellToCoreAsks: BookedOrder[],
      coreToBuyAsks: BookedOrder[]
    ) => {
      const {
        calculatedPrice: buyToCorePrice,
        orderPrice: buyToCoreOrderPrice,
      } = calculateBasePairPriceForBuyAmount(buyAmount, coreToBuyAsks);
      const coreAmount = buyAmount * buyToCorePrice;
      const limitedCoreAmount = Number(
        limitByPrecision(coreAmount, defaultAsset?.precision)
      );
      setMiddleTrxCoreAmount(limitedCoreAmount);

      const {
        calculatedPrice: coreToSellPrice,
        orderPrice: coreToSellOrderPrice,
      } = calculateBasePairPriceForBuyAmount(limitedCoreAmount, sellToCoreAsks);
      setMiddleTrxOrderPrice(coreToSellOrderPrice);

      const sellAmount = coreToSellPrice * coreAmount;
      const calculatedPrice = sellAmount / buyAmount;
      return { calculatedPrice, orderPrice: buyToCoreOrderPrice };
    },
    [calculateBasePairPriceForBuyAmount, defaultAsset]
  );

  const updateBasePairSwapForm = useCallback(
    async (
      sellAsset: Asset,
      buyAsset: Asset,
      inputedAmount: string,
      inputedAmountType: SwapInputType
    ) => {
      try {
        const { asks } = await getOrderBook({
          base: sellAsset,
          quote: buyAsset,
        });
        const numberedInputedAmount = Number(inputedAmount);
        const buyLiquidityVolume = calculateBasePairBuyLiquidity(asks);
        const sellLiquidityVolume = calculateBasePairSellLiquidity(asks);
        setBuyLiquidityVolume(buyLiquidityVolume);
        setSellLiquidityVolume(sellLiquidityVolume);
        if (inputedAmountType === "sellAsset") {
          // unsuccessful
          if (numberedInputedAmount > sellLiquidityVolume) {
            setCalculatedPrice(undefined);
            swapForm.setFieldsValue({
              buyAmount: "0",
            });
          } else {
            const { calculatedPrice, orderPrice } =
              calculateBasePairPriceForSellAmount(numberedInputedAmount, asks);
            setCalculatedPrice(
              limitByPrecision(calculatedPrice, sellAsset.precision)
            );
            swapForm.setFieldsValue({
              buyAmount: limitByPrecision(
                numberedInputedAmount / calculatedPrice,
                buyAsset.precision
              ),
            });
            setOrderPrice(orderPrice);
          }
          // inputedAmountType = "buyAsset"
        } else {
          //unsuccessful
          if (numberedInputedAmount > buyLiquidityVolume) {
            setCalculatedPrice(undefined);
            swapForm.setFieldsValue({
              sellAmount: "0",
            });
          } else {
            const { calculatedPrice, orderPrice } =
              calculateBasePairPriceForBuyAmount(numberedInputedAmount, asks);
            setCalculatedPrice(
              limitByPrecision(calculatedPrice, sellAsset.precision)
            );
            swapForm.setFieldsValue({
              sellAmount: limitByPrecision(
                numberedInputedAmount * calculatedPrice,
                sellAsset.precision
              ),
            });
            setOrderPrice(orderPrice);
          }
        }
      } catch (e) {
        console.log(e);
        setCalculatedPrice(undefined);
        swapForm.setFieldsValue({
          buyAmount: "0",
          sellAmount: "0",
        });
        setOrderPrice(0);
      }
    },
    [
      getOrderBook,
      calculateBasePairBuyLiquidity,
      calculateBasePairSellLiquidity,
      setBuyLiquidityVolume,
      setSellLiquidityVolume,
      setCalculatedPrice,
      swapForm,
      calculateBasePairPriceForSellAmount,
      calculateBasePairPriceForBuyAmount,
      setOrderPrice,
      limitByPrecision,
    ]
  );

  const updateNonBasePairSwapForm = useCallback(
    async (
      sellAsset: Asset,
      buyAsset: Asset,
      inputedAmount: string,
      inputedAmountType: SwapInputType
    ) => {
      const numberedInputedAmount = Number(inputedAmount);
      try {
        const { asks: sellToCoreAsks } = await getOrderBook({
          base: sellAsset,
          quote: defaultAsset as Asset,
        });
        const { asks: coreToBuyAsks } = await getOrderBook({
          base: defaultAsset as Asset,
          quote: buyAsset,
        });
        const sellLiquidityVolume = calculateNonBasePairSellLiquidity(
          sellToCoreAsks,
          coreToBuyAsks
        );
        setSellLiquidityVolume(sellLiquidityVolume);
        const buyLiquidityVolume = calculateNonBasePairBuyLiquidity(
          sellToCoreAsks,
          coreToBuyAsks
        );
        setBuyLiquidityVolume(buyLiquidityVolume);

        if (inputedAmountType === "sellAsset") {
          // unsuccessful
          if (
            numberedInputedAmount > sellLiquidityVolume ||
            numberedInputedAmount <= 0
          ) {
            setCalculatedPrice(undefined);
            swapForm.setFieldsValue({
              buyAmount: "0",
            });
          } else {
            const { calculatedPrice, orderPrice } =
              calculateNonBasePairPriceForSellAmount(
                numberedInputedAmount,
                sellToCoreAsks,
                coreToBuyAsks
              );
            setCalculatedPrice(
              limitByPrecision(calculatedPrice, sellAsset.precision)
            );
            swapForm.setFieldsValue({
              buyAmount: limitByPrecision(
                numberedInputedAmount / calculatedPrice,
                buyAsset.precision
              ),
            });
            setOrderPrice(orderPrice);
          }
          // inputedAmountType === "buyAsset"
        } else {
          // unsuccessful
          if (
            numberedInputedAmount > buyLiquidityVolume ||
            numberedInputedAmount <= 0
          ) {
            setCalculatedPrice(undefined);
            swapForm.setFieldsValue({
              sellAmount: undefined,
            });
          } else {
            const { calculatedPrice, orderPrice } =
              calculateNonBasePairPriceForBuyAmount(
                numberedInputedAmount,
                sellToCoreAsks,
                coreToBuyAsks
              );
            setCalculatedPrice(
              limitByPrecision(calculatedPrice, sellAsset.precision)
            );
            swapForm.setFieldsValue({
              sellAmount: limitByPrecision(
                numberedInputedAmount * calculatedPrice,
                sellAsset.precision
              ),
            });
            setOrderPrice(orderPrice);
          }
        }
      } catch (e) {
        console.log(e);
        setCalculatedPrice(undefined);
        swapForm.setFieldsValue({
          buyAmount: "0",
          sellAmount: "0",
        });
        setOrderPrice(0);
      }
    },
    [
      getOrderBook,
      defaultAsset,
      calculateNonBasePairSellLiquidity,
      setSellLiquidityVolume,
      calculateNonBasePairBuyLiquidity,
      setBuyLiquidityVolume,
      setCalculatedPrice,
      swapForm,
      calculateNonBasePairPriceForSellAmount,
      setOrderPrice,
      calculateNonBasePairPriceForBuyAmount,
      limitByPrecision,
    ]
  );

  const updateSwapFormData = useCallback(
    async (
      sellAsset: Asset,
      buyAsset: Asset,
      inputedAmount: string,
      inputedAmountType: SwapInputType
    ) => {
      if (
        sellAsset.symbol === defaultToken ||
        buyAsset.symbol === defaultToken
      ) {
        await updateBasePairSwapForm(
          sellAsset,
          buyAsset,
          inputedAmount,
          inputedAmountType
        );
      } else {
        await updateNonBasePairSwapForm(
          sellAsset,
          buyAsset,
          inputedAmount,
          inputedAmountType
        );
      }
    },
    [defaultToken, updateBasePairSwapForm, updateNonBasePairSwapForm]
  );

  const calculateBuyAssetMarketFee = useCallback(() => {
    const { buyAmount } = swapForm.getFieldsValue();
    if (buyAmount && buyAsset) {
      setBuyAssetMarketFee(
        limitByPrecision(
          (Number(buyAmount) * buyAsset.options.market_fee_percent) / 10000,
          buyAsset.precision
        )
      );
    } else {
      setBuyAssetMarketFee("0");
    }
  }, [
    swapForm,
    selectedAssetsSymbols.buyAssetSymbol,
    buyAsset,
    setBuyAssetMarketFee,
  ]);

  const handleValuesChange = useCallback(
    async (changedValues: { sellAmount?: string; buyAmount?: string }) => {
      if (sellAsset && buyAsset) {
        setLoadingSwapData(true);

        if (changedValues.sellAmount !== undefined) {
          setLastChangedField("sellAsset");
          const sellAmount = limitByPrecision(
            changedValues.sellAmount,
            sellAsset.precision - 3 > 0
              ? sellAsset.precision - 3
              : sellAsset.precision - 2
          );
          swapForm.setFieldsValue({
            sellAmount: sellAmount,
          });
          if (Number(sellAmount) > 0) {
            await updateSwapFormData(
              sellAsset,
              buyAsset,
              sellAmount,
              "sellAsset"
            );
          }
        } else if (changedValues.buyAmount !== undefined) {
          setLastChangedField("buyAsset");
          const buyAmount = limitByPrecision(
            changedValues.buyAmount,
            buyAsset.precision - 3 > 0
              ? buyAsset.precision - 3
              : buyAsset.precision - 2
          );
          swapForm.setFieldsValue({
            buyAmount: buyAmount,
          });
          if (Number(buyAmount) > 0) {
            await updateSwapFormData(
              sellAsset,
              buyAsset,
              buyAmount,
              "buyAsset"
            );
          }
        }
        calculateBuyAssetMarketFee();
        try {
          await swapForm.validateFields();
          setSellAmountErrors([]);
          setBuyAmountErrors([]);
        } catch (e) {
          console.log(e);
          setSellAmountErrors(swapForm.getFieldError("sellAmount"));
          setBuyAmountErrors(swapForm.getFieldError("buyAmount"));
        }
        setLoadingSwapData(false);
      }
    },
    [
      sellAsset,
      buyAsset,
      setLastChangedField,
      swapForm,
      setCalculatedPrice,
      setSellAmountErrors,
      setBuyAmountErrors,
      setLoadingSwapData,
      calculateBuyAssetMarketFee,
    ]
  );

  const handleSellAssetChange = useCallback(
    (value: unknown) => {
      previousPair.current = `${selectedAssetsSymbols.buyAssetSymbol}_${selectedAssetsSymbols.sellAssetSymbol}`;
      if (String(value) === selectedAssetsSymbols.buyAssetSymbol) {
        setSelectedAssetsSymbols({
          buyAssetSymbol: selectedAssetsSymbols.sellAssetSymbol,
          sellAssetSymbol: String(value),
        });
      } else {
        setSelectedAssetsSymbols({
          ...selectedAssetsSymbols,
          sellAssetSymbol: String(value),
        });
      }
    },
    [selectedAssetsSymbols, setSelectedAssetsSymbols]
  );

  const handleBuyAssetChange = useCallback(
    (value: unknown) => {
      previousPair.current = `${selectedAssetsSymbols.buyAssetSymbol}_${selectedAssetsSymbols.sellAssetSymbol}`;
      if (String(value) === selectedAssetsSymbols.sellAssetSymbol) {
        setSelectedAssetsSymbols({
          sellAssetSymbol: selectedAssetsSymbols.buyAssetSymbol,
          buyAssetSymbol: String(value),
        });
      } else {
        setSelectedAssetsSymbols({
          ...selectedAssetsSymbols,
          buyAssetSymbol: String(value),
        });
      }
    },

    [selectedAssetsSymbols, setSelectedAssetsSymbols]
  );

  const handleSwapAssets = useCallback(() => {
    previousPair.current = `${selectedAssetsSymbols.buyAssetSymbol}_${selectedAssetsSymbols.sellAssetSymbol}`;
    setSelectedAssetsSymbols({
      buyAssetSymbol: selectedAssetsSymbols.sellAssetSymbol,
      sellAssetSymbol: selectedAssetsSymbols.buyAssetSymbol,
    });
  }, [selectedAssetsSymbols, setSelectedAssetsSymbols]);

  const handleAssetChange = useCallback(async () => {
    if (allAssets && allAssets.length) {
      setLoadingSwapData(true);
      const sellAsset = allAssets.find(
        (asset) => asset.symbol === selectedAssetsSymbols.sellAssetSymbol
      ) as Asset;
      const buyAsset = allAssets.find(
        (asset) => asset.symbol === selectedAssetsSymbols.buyAssetSymbol
      ) as Asset;
      const { buyAmount, sellAmount } = swapForm.getFieldsValue();
      if (lastChangedField === "sellAsset" && sellAmount) {
        await updateSwapFormData(sellAsset, buyAsset, sellAmount, "sellAsset");
      } else if (lastChangedField === "buyAsset" && buyAmount) {
        await updateSwapFormData(sellAsset, buyAsset, buyAmount, "buyAsset");
      } else {
        swapForm.setFieldsValue({
          buyAmount: "0",
          sellAmount: "0",
        });
        setCalculatedPrice(undefined);
      }
      try {
        await swapForm.validateFields();
        setSellAmountErrors([]);
        setBuyAmountErrors([]);
      } catch (e) {
        console.log(e);
        setSellAmountErrors(swapForm.getFieldError("sellAmount"));
        setBuyAmountErrors(swapForm.getFieldError("buyAmount"));
      }
      updateSwapPair(`${buyAsset.symbol}_${sellAsset.symbol}`);
      setLoadingSwapData(false);
    }
  }, [
    allAssets,
    allAssets.length,
    selectedAssetsSymbols,
    swapForm,
    lastChangedField,
    updateSwapFormData,
    setCalculatedPrice,
    setSellAmountErrors,
    setBuyAmountErrors,
    setLoadingSwapData,
    calculateBuyAssetMarketFee,
  ]);

  const calculateSelectedAssetsSwapFee = useCallback(() => {
    if (sellAsset && buyAsset) {
      const swapOrderFee = calculateCreateLimitOrderFee(sellAsset, buyAsset);
      if (
        selectedAssetsSymbols.sellAssetSymbol === defaultToken ||
        selectedAssetsSymbols.buyAssetSymbol === defaultToken
      ) {
        return swapOrderFee !== undefined ? swapOrderFee.fee : undefined;
      } else {
        return swapOrderFee !== undefined ? swapOrderFee.fee * 2 : undefined;
      }
    }
  }, [
    sellAsset,
    buyAsset,
    selectedAssetsSymbols,
    calculateCreateLimitOrderFee,
    defaultToken,
  ]);

  const setAllAssets = useCallback(async () => {
    try {
      setLoadingAssets(true);
      const allAssets = await getAllAssets(true);
      if (allAssets && allAssets.length > 0) {
        _setAllAssets(allAssets);
      }
      setLoadingAssets(false);
    } catch (e) {
      console.log(e);
      setLoadingAssets(false);
    }
  }, [getAllAssets, _setAllAssets, setLoadingAssets]);

  const setBalances = useCallback(() => {
    if (assets && assets.length > 0) {
      const userSellAsset = assets.find(
        (asset) => asset.symbol === selectedAssetsSymbols.sellAssetSymbol
      );
      const userBuyAsset = assets.find(
        (asset) => asset.symbol === selectedAssetsSymbols.buyAssetSymbol
      );
      if (userSellAsset) {
        setSellAssetBalance(userSellAsset.amount as number);
      } else {
        setSellAssetBalance(0);
      }
      if (userBuyAsset) {
        setBuyAssetBalance(userBuyAsset.amount as number);
      } else {
        setBuyAssetBalance(0);
      }
    }
  }, [assets, selectedAssetsSymbols, setSellAssetBalance, setBuyAssetBalance]);

  const setSelectedAssets = useCallback(() => {
    if (allAssets && allAssets.length) {
      const sellAsset = allAssets.find(
        (asset) => asset.symbol === selectedAssetsSymbols.sellAssetSymbol
      ) as Asset;
      const buyAsset = allAssets.find(
        (asset) => asset.symbol === selectedAssetsSymbols.buyAssetSymbol
      ) as Asset;
      setBuyAsset(buyAsset);
      setSellAsset(sellAsset);
    }
  }, [
    allAssets,
    allAssets.length,
    selectedAssetsSymbols,
    setBuyAsset,
    setSellAsset,
  ]);

  const handleBasePairSwapSubmit = useCallback(
    async (
      sellAmount: string,
      buyAmount: string,
      sellAsset: Asset,
      buyAsset: Asset,
      signerKey: SignerKey
    ) => {
      const minToReceive = limitByPrecision(
        Number(sellAmount) / orderPrice,
        buyAsset.precision
      );
      const trx = buildSwapTransaction(
        id,
        Number(minToReceive) > 0
          ? minToReceive
          : String(1 / 10 ** buyAsset.precision),
        sellAmount,
        sellAsset,
        buyAsset
      );

      let trxResult;
      try {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADING,
        });
        trxResult = await buildTrx([trx], [signerKey]);
      } catch (e) {
        console.log(e);
        swapForm.resetFields();
        setCalculatedPrice(undefined);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      }
      if (trxResult) {
        formAccountBalancesByName(localStorageAccount);
        swapForm.resetFields();
        setCalculatedPrice(undefined);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_SUCCESS,
          message: counterpart.translate(
            `field.success.swap_order_successfully`,
            {
              sellAmount: sellAmount,
              buyAmount: buyAmount,
              sellAssetSymbol: selectedAssetsSymbols.sellAssetSymbol,
              buyAssetSymbol: selectedAssetsSymbols.buyAssetSymbol,
            }
          ),
        });
      } else {
        swapForm.resetFields();
        setCalculatedPrice(undefined);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      }
    },
    [
      buildSwapTransaction,
      id,
      limitByPrecision,
      orderPrice,
      buildTrx,
      swapForm,
      setCalculatedPrice,
      formAccountBalancesByName,
      localStorageAccount,
      selectedAssetsSymbols,
      dispatchTransactionMessage,
    ]
  );

  const handleNonBasePairSwapSubmit = useCallback(
    async (
      sellAmount: string,
      buyAmount: string,
      sellAsset: Asset,
      buyAsset: Asset,
      signerKey: SignerKey
    ) => {
      const coreMinToReceive = limitByPrecision(
        Number(sellAmount) / middleTrxOrderPrice,
        defaultAsset?.precision
      );
      const buyCoreAssetTrx = buildSwapTransaction(
        id,
        Number(coreMinToReceive) > 0
          ? coreMinToReceive
          : String(1 / 10 ** (defaultAsset as Asset).precision),
        sellAmount,
        sellAsset,
        defaultAsset as Asset
      );

      const minToReceive = limitByPrecision(
        Number(middleTrxCoreAmount) / orderPrice,
        buyAsset.precision
      );
      const sellCoreAssetTrx = buildSwapTransaction(
        id,
        Number(minToReceive) > 0
          ? minToReceive
          : String(1 / 10 ** buyAsset.precision),
        String(middleTrxCoreAmount),
        defaultAsset as Asset,
        buyAsset
      );

      let swapTrxResult;
      try {
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADING,
        });
        swapTrxResult = await buildTrx(
          [buyCoreAssetTrx, sellCoreAssetTrx],
          [signerKey]
        );
        if (swapTrxResult) {
          formAccountBalancesByName(localStorageAccount);
          swapForm.resetFields();
          setCalculatedPrice(undefined);
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_SUCCESS,
            message: counterpart.translate(
              `field.success.swap_order_successfully`,
              {
                sellAmount: sellAmount,
                buyAmount: buyAmount,
                sellAssetSymbol: selectedAssetsSymbols.sellAssetSymbol,
                buyAssetSymbol: selectedAssetsSymbols.buyAssetSymbol,
              }
            ),
          });
        } else {
          swapForm.resetFields();
          setCalculatedPrice(undefined);
          dispatchTransactionMessage({
            type: TransactionMessageActionType.LOADED_ERROR,
            message: counterpart.translate(`field.errors.transaction_unable`),
          });
        }
      } catch (e) {
        console.log(e);
        swapForm.resetFields();
        setCalculatedPrice(undefined);
        dispatchTransactionMessage({
          type: TransactionMessageActionType.LOADED_ERROR,
          message: counterpart.translate(`field.errors.transaction_unable`),
        });
      }
    },
    [
      middleTrxOrderPrice,
      middleTrxCoreAmount,
      orderPrice,
      buildSwapTransaction,
      id,
      defaultAsset,
      buildTrx,
      formAccountBalancesByName,
      localStorageAccount,
      swapForm,
      setCalculatedPrice,
      selectedAssetsSymbols,
      dispatchTransactionMessage,
    ]
  );

  const handleSwapSubmit = useCallback(
    async (signerKey: SignerKey) => {
      if (allAssets && allAssets.length) {
        const { sellAmount, buyAmount } = swapForm.getFieldsValue();
        const sellAsset = allAssets.find(
          (asset) => asset.symbol === selectedAssetsSymbols.sellAssetSymbol
        ) as Asset;
        const buyAsset = allAssets.find(
          (asset) => asset.symbol === selectedAssetsSymbols.buyAssetSymbol
        ) as Asset;

        if (
          selectedAssetsSymbols.sellAssetSymbol === defaultToken ||
          selectedAssetsSymbols.buyAssetSymbol === defaultToken
        ) {
          await handleBasePairSwapSubmit(
            sellAmount,
            buyAmount,
            sellAsset,
            buyAsset,
            signerKey
          );
        } else {
          await handleNonBasePairSwapSubmit(
            sellAmount,
            buyAmount,
            sellAsset,
            buyAsset,
            signerKey
          );
        }
      }
    },
    [
      allAssets,
      allAssets.length,
      swapForm,
      selectedAssetsSymbols,
      defaultToken,
      handleBasePairSwapSubmit,
      handleNonBasePairSwapSubmit,
      buildSwapTransaction,
      id,
      buildTrx,
      formAccountBalancesByName,
      setCalculatedPrice,
      localStorageAccount,
      orderPrice,
      defaultAsset,
      middleTrxCoreAmount,
      middleTrxOrderPrice,
    ]
  );

  const validateFeeAmount = (userDefaultAsset?: Asset) => {
    let errorMessage = "";
    if (!userDefaultAsset) {
      errorMessage = counterpart.translate(
        `field.errors.insufficient_balance_for_fee`,
        {
          coreAsset: defaultToken,
        }
      );
    } else {
      if (swapOrderFee > (userDefaultAsset?.amount as number)) {
        errorMessage = counterpart.translate(
          `field.errors.insufficient_balance_for_fee`,
          {
            coreAsset: defaultToken,
          }
        );
      }
    }
    return errorMessage;
  };

  const validateBalanceForSellAmount = (
    numberedValue: number,
    userSellAsset?: Asset
  ) => {
    let errorMessage = "";
    if (!userSellAsset) {
      errorMessage = counterpart.translate(
        `field.errors.insufficient_asset_balance`,
        {
          asset: selectedAssetsSymbols.sellAssetSymbol,
        }
      );
    } else {
      if (selectedAssetsSymbols.sellAssetSymbol === defaultToken) {
        if (numberedValue + swapOrderFee > (userSellAsset?.amount as number)) {
          errorMessage = counterpart.translate(
            `field.errors.insufficient_asset_balance`,
            {
              asset: selectedAssetsSymbols.sellAssetSymbol,
            }
          );
        }
      } else {
        if (numberedValue > (userSellAsset?.amount as number)) {
          errorMessage = counterpart.translate(
            `field.errors.insufficient_asset_balance`,
            {
              asset: selectedAssetsSymbols.sellAssetSymbol,
            }
          );
        }
      }
    }
    return errorMessage;
  };

  const validateSellAmount = (_: unknown, value: string) => {
    if (allAssets && allAssets.length > 0) {
      const userSellAsset = assets.find(
        (asset) => asset.symbol === selectedAssetsSymbols.sellAssetSymbol
      );
      const userDefaultAsset = assets.find(
        (asset) => asset.symbol === defaultToken
      );
      const numberedValue = Number(value);
      // zero check
      if (numberedValue <= 0) {
        return Promise.reject(
          new Error(
            counterpart.translate(`field.errors.sell_amount_should_greater`)
          )
        );
      }

      // fee check
      const feeErrorMessage = validateFeeAmount(userDefaultAsset);
      if (feeErrorMessage !== "") {
        return Promise.reject(new Error(feeErrorMessage));
      }

      // balance check
      const balanceErrorMessage = validateBalanceForSellAmount(
        numberedValue,
        userSellAsset
      );
      if (balanceErrorMessage !== "") {
        return Promise.reject(new Error(balanceErrorMessage));
      }

      //Liquidity check
      if (numberedValue > sellLiquidityVolume) {
        return Promise.reject(
          new Error(counterpart.translate(`field.errors.not_enough_liquidity`))
        );
      }

      return Promise.resolve();
    }
    return Promise.reject(new Error(""));
  };

  const validateBuyAmount = (_: unknown, value: string) => {
    if (allAssets && allAssets.length > 0) {
      const numberedValue = Number(value);
      // zero check
      if (numberedValue <= 0) {
        return Promise.reject(
          new Error(
            counterpart.translate(`field.errors.buy_amount_should_greater`)
          )
        );
      }

      // Liquidity check
      if (numberedValue > buyLiquidityVolume) {
        return Promise.reject(
          new Error(counterpart.translate(`field.errors.not_enough_liquidity`))
        );
      }

      return Promise.resolve();
    }
    return Promise.reject(new Error(""));
  };

  const formValidation = {
    sellAmount: [{ validator: validateSellAmount }],
    buyAmount: [{ validator: validateBuyAmount }],
  };

  const subscribeToMarket = useCallback(async () => {
    try {
      await handleAssetChange();
      if (
        selectedAssetsSymbols.sellAssetSymbol === defaultToken ||
        selectedAssetsSymbols.buyAssetSymbol === defaultToken
      ) {
        await dbApi("subscribe_to_market", [
          async () => {
            try {
              await handleAssetChange();
            } catch (e) {
              console.log(e);
            }
          },
          selectedAssetsSymbols.sellAssetSymbol,
          selectedAssetsSymbols.buyAssetSymbol,
        ]);
      } else {
        await Promise.all([
          dbApi("subscribe_to_market", [
            async () => {
              try {
                await handleAssetChange();
              } catch (e) {
                console.log(e);
              }
            },
            defaultToken,
            selectedAssetsSymbols.buyAssetSymbol,
          ]),
          dbApi("subscribe_to_market", [
            async () => {
              try {
                await handleAssetChange();
              } catch (e) {
                console.log(e);
              }
            },
            defaultToken,
            selectedAssetsSymbols.sellAssetSymbol,
          ]),
        ]);
      }
    } catch (e) {
      console.log(e);
    }
  }, [handleAssetChange, selectedAssetsSymbols, defaultToken, dbApi]);

  const unsubscribeFromMarket = useCallback(async () => {
    const previousBaseSymbol = previousPair.current.split("_")[1];
    const previousQuoteSymbol = previousPair.current.split("_")[0];
    if (
      previousBaseSymbol === defaultToken ||
      previousQuoteSymbol === defaultToken
    ) {
      try {
        await dbApi("unsubscribe_from_market", [
          () => {
            console.log("unsubscribing");
          },
          previousBaseSymbol,
          previousQuoteSymbol,
        ]);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await Promise.all([
          dbApi("unsubscribe_from_market", [
            () => {
              console.log("unsubscribing");
            },
            previousBaseSymbol,
            defaultToken,
          ]),
          dbApi("unsubscribe_from_market", [
            () => {
              console.log("unsubscribing");
            },
            previousQuoteSymbol,
            defaultToken,
          ]),
        ]);
      } catch (e) {
        console.log(e);
      }
    }
  }, [dbApi, defaultToken, previousPair, previousPair.current]);

  useEffect(() => {
    setAllAssets();
  }, [setAllAssets]);

  useEffect(() => {
    setBalances();
  }, [setBalances]);

  useEffect(() => {
    setSelectedAssets();
  }, [setSelectedAssets]);

  useEffect(() => {
    const swapOrderFee = calculateSelectedAssetsSwapFee();
    if (swapOrderFee) {
      setSwapOrderFee(swapOrderFee);
    }
  }, [calculateSelectedAssetsSwapFee]);

  useEffect(() => {
    subscribeToMarket();
    return () => {
      unsubscribeFromMarket();
    };
  }, [selectedAssetsSymbols, allAssets]);

  useEffect(() => {
    calculateBuyAssetMarketFee();
  }, [calculateBuyAssetMarketFee]);

  return {
    swapForm,
    transactionMessageState,
    dispatchTransactionMessage,
    selectedAssetsSymbols,
    allAssets,
    handleSellAssetChange,
    handleBuyAssetChange,
    localStorageAccount,
    swapOrderFee,
    price: calculatedPrice,
    loadingSwapData,
    loadingAssets,
    handleSwapAssets,
    handleValuesChange,
    buyAssetBalance,
    sellAssetBalance,
    handleSwapSubmit,
    formValidation,
    sellAmountErrors,
    buyAmountErrors,
    lastChangedField,
    buyAssetMarketFee,
  };
}
