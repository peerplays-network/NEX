import { Asset, AssetHolders } from "../../types";

export type UseAssetResult = {
  formAssetBalanceById: (
    id: string,
    amount: number
  ) => Promise<Asset | undefined>;
  formKnownAssetBalanceById: (
    asset: Asset,
    amount: number
  ) => Asset | undefined;
  getAssetById: (id: string) => Promise<Asset | undefined>;
  getAssetBySymbol: (symbol: string) => Promise<Asset | undefined>;
  getAssetHolders: () => Promise<AssetHolders[] | undefined>;
  setPrecision: (
    roundTo: boolean,
    amount: number,
    precision?: number | undefined
  ) => number;
  getAllAssets: (tradeableAssetsOnly?: boolean) => Promise<Asset[] | undefined>;
  limitByPrecision: (value: string, precision?: number) => string;
  ceilPrecision: (
    num: string | number,
    precision?: number | undefined
  ) => string;
  getAssetsBySymbols: (symbols: string[]) => Promise<Asset[]>;
  roundNum: (num: string | number, roundTo?: number) => string;
};
