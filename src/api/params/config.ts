const isDev = process.env.NEXT_PUBLIC_NODE_ENV === "development";
const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_DEFAULT_TOKEN;
const DEFAULT_QUOTE = process.env.NEXT_PUBLIC_DEFAULT_QUOTE;
const FAUCET_URL = process.env.NEXT_PUBLIC_FAUCET_URL;
const DEFAULT_CHAIN_ID = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
const FORCE_VERSION = process.env.NEXT_PUBLIC_FORCE_VERSION;
const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
const ETHEREUM_PRIMARY_WALLET = process.env.NEXT_PUBLIC_ETHEREUM_PRIMARY_WALLET;

/**
 * @namespace Config
 */
export const config = {
  /**
   * @type {boolean}
   * @memberof Config
   */
  isDev,

  /**
   * The default token - PPY/TEST.
   *
   * @type {string}
   * @memberof Config
   */
  defaultToken: DEFAULT_TOKEN,

  /**
   * The default quote token.
   *
   * @type {string}
   * @memberof Config
   */
  defaultQuote: DEFAULT_QUOTE,

  /**
   * Represents the faucet url.
   *
   * @type {string}
   * @memberof Config
   */
  faucetUrl: FAUCET_URL,

  /**
   * The default chain ID.
   *
   * @type {string}
   * @memberof Config
   */
  defaultChainID: DEFAULT_CHAIN_ID,
  /**
   * Local storage version.
   *
   * @type {string}
   * @memberof Config
   */
  forceVersion: FORCE_VERSION,
  /**
   * Google Tag Manager Id.
   *
   * @type {string}
   * @memberof Config
   */
  googleTagManagerId: GOOGLE_TAG_MANAGER_ID,

  /**
   * Google Tag Manager Id.
   *
   * @type {string}
   * @memberof Config
   */
  EthereumPrimaryWallet: ETHEREUM_PRIMARY_WALLET,
};
