import { useCallback, useMemo } from "react";

import {
  excludedAssetsSymbols,
  tradeableAssetsSymbols,
} from "../../../api/params";
import {
  useAppSettingsContext,
  useAssetsContext,
  usePeerplaysApiContext,
} from "../../providers";
import { Asset, Cache } from "../../types";

import { UseAssetResult } from "./useAsset.types";

export function useAsset(): UseAssetResult {
  const { dbApi, assetApi } = usePeerplaysApiContext();
  const { cache, setCache: _setCache } = useAppSettingsContext();
  const { defaultAsset } = useAssetsContext();

  const assetsCacheExists = useMemo(() => {
    return Object.keys(cache).length > 0 && cache.assets.length > 0;
  }, [cache, cache.assets]);

  const setAssetsCache = useCallback(
    (asset: Asset) => {
      const assets =
        cache.assets.length > 0
          ? [
              ...cache.assets,
              {
                dynamic_asset_data_id: asset.dynamic_asset_data_id
                  ? asset.dynamic_asset_data_id
                  : undefined,
                id: asset.id,
                issuer: asset.issuer,
                options: asset.options,
                precision: asset.precision,
                symbol: asset.symbol,
              } as Asset,
            ]
          : [asset];
      _setCache({ created: cache.created, assets: assets } as Cache);
    },
    [cache, cache.assets, _setCache]
  );

  const getAssetById = useCallback(
    async (id: string) => {
      if (
        assetsCacheExists &&
        cache.assets.find((asset) => asset.id === id) !== undefined
      ) {
        return cache.assets.find((asset) => asset.id === id) as Asset;
      }
      try {
        const assets = await dbApi("get_assets", [[id]]);
        if (assets && assets.length) {
          const asset: Asset = assets[0];
          setAssetsCache(asset);
          return asset;
        } else {
          return undefined;
        }
      } catch (e) {
        console.log(e);
      }
    },
    [dbApi, cache, setAssetsCache, assetsCacheExists]
  );

  const getAssetBySymbol = useCallback(
    async (symbol: string) => {
      if (
        assetsCacheExists &&
        cache.assets.find((asset) => asset.symbol === symbol) !== undefined
      ) {
        return cache.assets.find((asset) => asset.symbol === symbol) as Asset;
      }
      try {
        const assets = await dbApi("lookup_asset_symbols", [[symbol]]);
        if (assets && assets.length) {
          const asset: Asset = assets[0];
          setAssetsCache(asset);
          return asset;
        } else {
          return undefined;
        }
      } catch (e) {
        console.log(e);
      }
    },
    [dbApi, cache, setAssetsCache, assetsCacheExists]
  );

  const getAllAssets = useCallback(
    async (tradeableAssetsOnly = false) => {
      try {
        const allAssets: Asset[] = await dbApi("list_assets", ["", 99]);
        if (tradeableAssetsOnly) {
          return allAssets.filter(
            (asset) =>
              !excludedAssetsSymbols.includes(asset.symbol) &&
              tradeableAssetsSymbols.includes(asset.symbol)
          );
        } else {
          return allAssets.filter(
            (asset) => !excludedAssetsSymbols.includes(asset.symbol)
          );
        }
      } catch (e) {
        console.log(e);
      }
    },
    [dbApi, excludedAssetsSymbols]
  );

  const getAssetsBySymbols = useCallback(
    async (symbols: string[]) => {
      const allAssets = await getAllAssets();
      if (allAssets) {
        const assets = allAssets.filter((asset) =>
          symbols.includes(asset.symbol)
        );
        return assets;
      } else {
        return [] as Asset[];
      }
    },
    [getAllAssets]
  );

  const getAssetHolders = useCallback(async () => {
    if (defaultAsset != undefined) {
      try {
        const allAssetHolders = await assetApi("get_asset_holders", [
          defaultAsset.symbol,
          0,
          100,
        ]);
        return allAssetHolders;
      } catch (e) {
        console.log(e);
      }
    }
  }, [assetApi, defaultAsset]);

  /**
   * private method, used only inside useAsset functions
   */
  const removeUnnecessaryZerosInDecimalPart = useCallback(
    (integerPart: string, decimalPart: string) => {
      let decimalPartWithoutEndZeros = decimalPart;
      for (let index = decimalPart.length - 1; index >= 0; index--) {
        const char = decimalPart[index];
        if (char === "0") {
          decimalPartWithoutEndZeros = decimalPart.slice(0, index);
        } else {
          break;
        }
      }
      if (decimalPartWithoutEndZeros.length > 0) {
        return integerPart + "." + decimalPartWithoutEndZeros;
      } else {
        return integerPart;
      }
    },
    []
  );
  /**
   * This is used for input fields in the app (like fee amounts)
   *
   * @param value value to be limited by precision
   * @param precision asset precision
   *
   * @returns limited by precision amount
   *
   */
  const limitByPrecision = (value: string, precision = 5) => {
    value = !value.includes("e") ? value : Number(value).toFixed(20);
    const splitString = value.split(".");
    if (
      splitString.length === 1 ||
      (splitString.length === 2 && splitString[1].length <= precision)
    ) {
      return value;
    } else {
      const limitedValue = removeUnnecessaryZerosInDecimalPart(
        splitString[0],
        splitString[1].slice(0, precision)
      );
      return limitedValue;
    }
  };

  const roundNum = (num: string | number, roundTo = 5): string => {
    const numbered = Number(num);
    const precised = numbered.toFixed(roundTo);
    const splitString = precised.split(".");
    return removeUnnecessaryZerosInDecimalPart(splitString[0], splitString[1]);
  };

  /**
   * This is used for integer amounts comes from the chain (like user balance)
   *
   * @param roundTo whether round the result or not
   * @param amount integer amount value
   * @param precision asset precision
   *
   * @returns denominated amount based on the asset precisions
   *
   */
  const setPrecision: (
    roundTo: boolean,
    amount: number,
    precision?: number
  ) => number = useCallback(
    (roundTo: boolean, amount: number, precision = 5) => {
      const precisioned = amount / 10 ** precision;
      return roundTo ? Number(roundNum(precisioned, precision)) : precisioned;
    },
    []
  );

  const formAssetBalanceById = useCallback(
    async (id: string, amount: number) => {
      const asset = await getAssetById(id);
      if (asset) {
        return {
          ...asset,
          amount: setPrecision(false, amount, asset.precision),
        } as Asset;
      }
    },
    [getAssetById, setPrecision]
  );
  const formKnownAssetBalanceById = useCallback(
    (asset: Asset, amount: number) => {
      if (asset) {
        return {
          ...asset,
          amount: setPrecision(false, amount, asset.precision),
        } as Asset;
      }
    },
    [setPrecision]
  );

  const ceilPrecision: (num: string | number, precision?: number) => string =
    useCallback((num: string | number, precision = 5) => {
      const numbered = Number(num);
      const precised = Number(numbered.toFixed(precision));
      return precised >= numbered
        ? precised.toFixed(precision)
        : (precised + 1 / 10 ** precision).toFixed(precision);
    }, []);

  return {
    formAssetBalanceById,
    getAssetById,
    setPrecision,
    getAssetBySymbol,
    getAllAssets,
    getAssetHolders,
    limitByPrecision,
    ceilPrecision,
    getAssetsBySymbols,
    roundNum,
    formKnownAssetBalanceById,
  };
}
