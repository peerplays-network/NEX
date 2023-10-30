import { useCallback, useMemo } from "react";

import { useAsset } from "../../../../../../../common/hooks";
import { useMarketContext } from "../../../../../../../common/providers";
import { MarketOrder } from "../../../../../../../common/types";

type UseFormTabsResult = {
  targetOrders: MarketOrder[] | undefined;
  precisions: {
    price: number;
    amount: number;
    total: number;
  };
  handleTabChange: (activeKey: string) => void;
};
type Args = {
  isBuyForm: boolean;
};
export function useFormTabs({ isBuyForm }: Args): UseFormTabsResult {
  const { asks, bids, buyOrderForm, sellOrderForm, selectedPair } =
    useMarketContext();
  const { limitByPrecision } = useAsset();

  const targetOrders = isBuyForm ? asks : bids;
  const orderForm = useMemo(() => {
    return isBuyForm ? buyOrderForm : sellOrderForm;
  }, [isBuyForm, buyOrderForm, sellOrderForm]);

  const precisions = useMemo(() => {
    if (selectedPair) {
      const leastPrecision = 1;
      let firstPrecision = 5;
      let secondPrecision = 5;
      const isSamePrecisions =
        selectedPair.base.precision === selectedPair.quote.precision;
      if (isSamePrecisions) {
        firstPrecision = Math.floor(selectedPair.base.precision / 2);
        secondPrecision = Math.floor(selectedPair.base.precision / 2) + 1;
      } else {
        const smallToBigRatio =
          selectedPair.base.precision > selectedPair.quote.precision
            ? {
                ratio:
                  selectedPair.quote.precision / selectedPair.base.precision,
                isBaseBigger: true,
              }
            : {
                ratio:
                  selectedPair.base.precision / selectedPair.quote.precision,
                isBaseBigger: false,
              };
        firstPrecision = smallToBigRatio.isBaseBigger
          ? Math.round(selectedPair.quote.precision * smallToBigRatio.ratio)
          : Math.round(selectedPair.base.precision * smallToBigRatio.ratio);
        secondPrecision = selectedPair.base.precision - firstPrecision;
        if (firstPrecision === 0) {
          firstPrecision = leastPrecision;
          secondPrecision = secondPrecision - leastPrecision;
        } else if (secondPrecision === 0) {
          secondPrecision = leastPrecision;
          firstPrecision = firstPrecision - leastPrecision;
        }
      }
      const bigPrecision =
        firstPrecision >= secondPrecision ? firstPrecision : secondPrecision;
      const smallPrecision =
        firstPrecision >= secondPrecision ? secondPrecision : firstPrecision;
      return {
        price:
          selectedPair.base.precision >= selectedPair.quote.precision
            ? bigPrecision
            : smallPrecision,
        amount:
          selectedPair.quote.precision >= selectedPair.base.precision
            ? bigPrecision
            : smallPrecision,
        total: selectedPair.base.precision,
      };
    } else {
      return {
        price: 5,
        amount: 5,
        total: 5,
      };
    }
  }, [selectedPair]);

  const handleTabChange = useCallback(
    (activeKey: string) => {
      if (activeKey === "limit") {
        orderForm.setFieldsValue({
          price: undefined,
          amount: undefined,
          total: undefined,
        });
      } else if (activeKey === "market") {
        orderForm.setFieldsValue({
          price: isBuyForm
            ? limitByPrecision(
                Number((targetOrders as MarketOrder[])[0].price) +
                  10 ** -precisions.price,
                precisions.price
              )
            : limitByPrecision(
                Number((targetOrders as MarketOrder[])[0].price) -
                  10 ** -precisions.price,
                precisions.price
              ),
          amount: undefined,
          total: undefined,
        });
      }
    },
    [orderForm, precisions, isBuyForm, targetOrders]
  );

  return {
    targetOrders,
    precisions,
    handleTabChange,
  };
}
