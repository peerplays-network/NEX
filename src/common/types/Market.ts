import { Asset } from "./Asset";

export type MarketPair =
  | {
      base: Asset;
      quote: Asset;
    }
  | undefined;

export type MarketPairStats = {
  latest: string;
  percentChange: string;
  volume: string;
  ask_quote: string;
  bid_quote: string;
  dailyHigh: string;
  dailyLow: string;
};

// TODO: remove marketPage redesign
export type PairNameAndMarketStats = {
  tradingPair: string;
  marketPairStats: MarketPairStats;
};

export type MarketOrder = {
  base: string;
  price: string;
  quote: string;
  isBuyOrder: boolean;
};

export type MarketOrderType = "total" | "buy" | "sell";
