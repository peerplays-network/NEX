export type Asset = {
  dynamic_asset_data_id?: string;
  id: string;
  issuer: string;
  options: AssetOptions;
  precision: number;
  symbol: string;
  amount?: number;
};

export type Amount = {
  amount: number;
  asset_id: string;
};

export type AssetOptions = {
  blacklist_authorities: any[];
  blacklist_markets: any[];
  core_exchange_rate: { base: Amount; quote: Amount };
  description: string;
  extensions: any[];
  flags: number;
  issuer_permissions: number;
  market_fee_percent: number;
  max_market_fee: string;
  max_supply: string;
  whitelist_authorities: any[];
  whitelist_markets: any[];
};

export type AssetHolders = {
  account_id: string;
  name: string;
  amount: string;
};
