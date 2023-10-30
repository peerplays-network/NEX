import { Sidechain } from "./SonAccount";

export type GlobalProperties = {
  active_committee_members: string[];
  active_sons: [Sidechain, ActiveSon[]][];
  active_witnesses: string[];
  id: string;
  parameters: GlobalPropertiesParameters;
  next_available_vote_id: number;
};

export type ChainProperties = {
  chain_id: string;
  immutable_parameters: ImmutableParameters;
};

export type ImmutableParameters = {
  min_committee_member_count: number;
  min_witness_count: number;
  min_son_count: number;
  num_special_accounts: number;
  num_special_assets: number;
};

export type ActiveSon = {
  sidechain_public_keys: [string, string][];
  signing_key: string;
  son_id: string;
  weight: number;
};

export type GlobalPropertiesParameters = {
  account_fee_scale_bitshifts: number;
  accounts_per_fee_scale: number;
  allow_non_member_whitelists: boolean;
  block_interval: number;
  cashback_vesting_period_seconds: number;
  cashback_vesting_threshold: number;
  committee_proposal_review_period: number;
  count_non_member_votes: boolean;
  current_fees: {
    parameters: FeeParameter[];
    scale: number;
  };
  extensions: {
    account_roles_max_lifetime: number;
    account_roles_max_per_account: number;
    betting_rake_fee_percentage: number;
    btc_asset: string;
    eth_asset: string;
    gpos_period: number;
    gpos_period_start: number;
    gpos_subperiod: number;
    gpos_vesting_lockin_period: number;
    hbd_asset: string;
    hive_asset: string;
    live_betting_delay_time: number;
    max_bet_multiplier: number;
    maximum_son_count: number;
    min_bet_multiplier: number;
    rbac_max_account_authority_lifetime: number;
    rbac_max_authorities_per_permission: number;
    rbac_max_permissions_per_account: number;
    son_account: string;
    son_bitcoin_min_tx_confirmations: 1;
    son_deregister_time: number;
    son_down_time: number;
    son_heartbeat_frequency: number;
    son_pay_max: number;
    son_pay_time: number;
    son_vesting_amount: number;
    son_vesting_period: number;
    sweeps_distribution_asset: string;
    sweeps_distribution_percentage: number;
    sweeps_vesting_accumulator_account: string;
  };
  fee_liquidation_threshold: number;
  lifetime_referrer_percent_of_fee: number;
  maintenance_interval: number;
  maintenance_skip_slots: number;
  max_authority_depth: number;
  max_predicate_opcode: number;
  max_round_delay: number;
  max_time_per_commit_move: number;
  max_time_per_reveal_move: number;
  maximum_asset_feed_publishers: number;
  maximum_asset_whitelist_authorities: number;
  maximum_authority_membership: number;
  maximum_block_size: number;
  maximum_committee_count: number;
  maximum_players_in_tournament: number;
  maximum_proposal_lifetime: number;
  maximum_registration_deadline: number;
  maximum_time_until_expiration: number;
  maximum_tournament_number_of_wins: number;
  maximum_tournament_start_delay: number;
  maximum_tournament_start_time_in_future: number;
  maximum_tournament_whitelist_length: number;
  maximum_transaction_size: number;
  maximum_witness_count: number;
  min_round_delay: number;
  min_time_per_commit_move: number;
  min_time_per_reveal_move: number;
  network_percent_of_fee: number;
  rake_fee_percentage: number;
  reserve_percent_of_fee: number;
  witness_pay_per_block: number;
  witness_schedule_algorithm: number;
  worker_budget_per_day: string;
};

export type FeeAmounts = {
  fee?: number;
  price_per_kbyte?: number;
  basic_fee?: number;
  premium_fee?: number;
  lottery_asset?: number;
  distribution_base_fee?: number;
  distribution_fee_per_holder?: number;
  symbol3?: number;
  symbol4?: number;
  long_symbol?: number;
  membership_annual_fee?: number;
  membership_lifetime_fee?: number;
};

export type FeeParameter = [number, FeeAmounts];
