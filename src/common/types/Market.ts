import { Amount, Asset } from "./Asset";

export type MarketPair = {
  base: Asset;
  quote: Asset;
};

export type MarketPairStats = {
  latest: string;
  percentChange: string;
  volume: string;
  lowestAsk?: string;
  highestBid?: string;
  dailyHigh?: string;
  dailyLow?: string;
};

export type PairNameAndMarketStats = {
  tradingPair: string;
  marketPairStats: MarketPairStats;
};

export type MarketOrder = {
  base: string;
  price: string;
  quote: string;
  isBuyOrder: boolean;
  timestamp?: Date;
  key?: string;
};

export type OrderForm = {
  price: string;
  amount: string;
  total: string;
};

export type LimitOrder = {
  deferred_fee: number;
  expiration: string;
  for_sale: number;
  id: string;
  sell_price: {
    base: {
      amount: number;
      asset_id: string;
    };
    quote: {
      amount: number;
      asset_id: string;
    };
  };
  seller: string;
};

export type CallOrder = {
  borrower: string;
  collateral: number;
  debt: number;
  call_price: {
    base: {
      amount: number;
      asset_id: string;
    };
    quote: {
      amount: number;
      asset_id: string;
    };
  };
};

export type ForceSettlement = {
  owner: string;
  balance: Amount;
  settlement_date: string;
};
