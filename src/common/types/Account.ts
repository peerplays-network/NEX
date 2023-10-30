import {
  CallOrder,
  ForceSettlement,
  LimitOrder,
  Member,
  VestingBalance,
  WithdrawPermission,
} from ".";

export type FullAccount = {
  account: Account;
  assets: string[];
  balances: AccountBalance[];
  call_orders: CallOrder[];
  cashback_balance?: VestingBalance;
  vesting_balances: VestingBalance[];
  lifetime_referrer_name: string;
  limit_orders: LimitOrder[];
  pending_dividend_payments: PendingDividendPayoutBalanceForHolder[];
  proposals: any[];
  referrer_name: string;
  registrar_name: string;
  settle_orders: ForceSettlement[];
  statistics: AccountStatistics;
  votes: Member[];
  withdraws: WithdrawPermission[];
};

export type Account = {
  active: Authority;
  active_special_authority: [number, SpecialAuthority];
  blacklisted_accounts: string[];
  blacklisting_accounts: string[];
  cashback_vb: string;
  id: string;
  lifetime_referrer: string;
  lifetime_referrer_fee_percentage: number;
  membership_expiration_date: string;
  name: string;
  network_fee_percentage: number;
  options: AccountOptions;
  owner: Authority;
  owner_special_authority: [number, SpecialAuthority];
  referrer: string;
  referrer_rewards_percentage: number;
  registrar: string;
  statistics: string;
  top_n_control_flags: number;
  whitelisting_accounts: string[];
  whitelisted_accounts: string[];
};

export type AccountBalance = {
  asset_type: string;
  balance: number;
  id: string;
  maintenance_flag: boolean;
  owner: string;
};

export type PendingDividendPayoutBalanceForHolder = {
  owner: string;
  dividend_holder_asset_type: string;
  dividend_payout_asset_type: string;
  pending_balance: number;
};

export type PublicKeys = { type: string; key: string };

export type GeneratedKey = { label: string; key: string };

// eslint-disable-next-line @typescript-eslint/ban-types
export type NoSpecialAuthority = {};
export type TopHoldersSpecialAuthority = {
  asset: string;
  num_top_holders: number;
};
export type SpecialAuthority = NoSpecialAuthority | TopHoldersSpecialAuthority;

export type Authority = {
  account_auths: [string, number][];
  address_auths: [string, number][];
  key_auths: [string, number][];
  weight_threshold: number;
};

export type AccountAuthorities = {
  active: Authority | string;
  memo: Authority | string;
  owner: Authority | string;
};

export type AccountOptions = {
  extensions: any;
  memo_key: string;
  num_committee: number;
  num_witness: number;
  num_son: number;
  votes: string[];
  voting_account: string;
};

export type SignupForm = {
  username: string;
  password: string;
  passwordCheck: string;
  confirm: boolean;
  saved: boolean;
};

export type SidechainAccount = {
  deposit_address: string;
  deposit_address_data: string;
  deposit_public_key: string;
  expires: string;
  id: string;
  sidechain: string;
  sidechain_address_account: string;
  valid_from: string;
  withdraw_address: string;
  withdraw_public_key: string;
};

export type AccountStatistics = {
  core_in_balance: number;
  has_cashback_vb: boolean;
  id: string;
  is_voting: false;
  last_vote_time: string;
  lifetime_fees_paid: number;
  most_recent_op: string;
  name: string;
  owner: string;
  pending_fees: number;
  pending_vested_fees: number;
  removed_ops: number;
  total_core_in_orders: number;
  total_ops: number;
};

export type ActivityRow = {
  key: string;
  time: string;
  type: string;
  info: string;
  id: string;
  block_num: number;
  trx_in_block: number;
  transaction_id: string;
  fee: string;
  status: boolean;
};

export type KeyType =
  | "password"
  | "active"
  | "memo"
  | "owner"
  | "whaleVault"
  | "";

export type SignerKey =
  | string
  | {
      whaleVaultInfo: {
        keyType: KeyType;
        account: string;
      };
    };

export type BitcoinSidechainAccounts =
  | {
      deposit: BitcoinAccount;
      withdraw: BitcoinAccount;
    }
  | undefined;

export type BitcoinAccount = {
  address: string;
  pubKey: string;
  privateKey: string;
};

export type EthereumSidechainAccounts =
  | {
      deposit: EthereumAccount;
      withdraw: EthereumAccount;
    }
  | undefined;

export type EthereumAccount = {
  address: string;
  privateKey: string;
};
