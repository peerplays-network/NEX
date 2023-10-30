import { config as Config } from "./config";

const MAIN_NET_CHAIN_ID =
  "6b6b5f0ce7a36d323768e534f3edb41c6d6332a541a95725b98e28d140850134";

const TESTNET_CHAIN_ID =
  "195d4e865e3a27d2b204de759341e4738f778dd5c4e21860c7e8bf1bd9c79203";

export const networkChain =
  MAIN_NET_CHAIN_ID === Config.defaultChainID
    ? "mainnet"
    : TESTNET_CHAIN_ID === Config.defaultChainID
    ? "testnet"
    : "devnet";

export const testnetCheck = MAIN_NET_CHAIN_ID !== Config.defaultChainID;

export const defaultToken = Config.defaultToken;
export const defaultQuote = Config.defaultQuote;
export const FAUCET_URL = Config.faucetUrl;
export const DEFAULT_CHAIN_ID = Config.defaultChainID;
export const DEFAULT_PROXY_ID = "1.2.5";

export const DEFAULT_NETWORK = "Peerplays";
export const BITCOIN_NETWORK = "Bitcoin";
export const BITCOIN_ASSET_SYMBOL = "BTC";
export const ETHEREUM_NETWORK = "Ethereum";
export const ETHEREUM_ASSET_SYMBOL = "ETH";
export const HIVE_NETWORK = "Hive";
export const HIVE_ASSET_SYMBOL = "HIVE";
export const HBD_ASSET_SYMBOL = "HBD";
export const SON_ACCOUNT_NAME = "son-account";

export const ASSETS_BLOCKCHAINS: {
  [assetSymbol: string]: string[];
} = {
  BTC: [DEFAULT_NETWORK, BITCOIN_NETWORK],
  HIVE: [DEFAULT_NETWORK, HIVE_NETWORK],
  HBD: [DEFAULT_NETWORK, HIVE_NETWORK],
  ETH: [DEFAULT_NETWORK, ETHEREUM_NETWORK],
};

export const WITNESS_VOTE_IDENTIFIER = 1;
export const COMMITTEE_VOTE_IDENTIFIER = 0;
export const BITCOIN_SON_VOTE_IDENTIFIER = 3;
export const HIVE_SON_VOTE_IDENTIFIER = 4;
export const ETHEREUM_SON_VOTE_IDENTIFIER = 5;

export const BTC_MIN_WITHDRAWAL = 0.001;
export const ETH_MIN_WITHDRAWAL = 0.004;
export const BTC_DEFAULT_WITHDRAWAL_FEE = 0.0003;
export const ETH_DEFAULT_WITHDRAWAL_FEE = 0.003;
