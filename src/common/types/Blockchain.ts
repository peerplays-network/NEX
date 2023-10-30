export type Block = {
  id?: number;
  extensions: any[];
  next_secret_hash?: string;
  previous: string;
  previous_secret: string;
  timestamp: string | Date;
  transaction_merkle_root: string;
  transactions: any[];
  //This is id of witness
  witness: string;
  witness_account_name: string;
  witness_signature: string;
};

export type Block2 = {
  id?: number;
  block_id: string;
  extensions: any[];
  next_secret_hash?: string;
  previous: string;
  previous_secret: string;
  signing_key: string;
  timestamp: string | Date;
  transaction_ids: string[];
  transaction_merkle_root: string;
  transactions: any[];
  witness: string;
  witness_account_name: string;
  witness_signature: string;
};

export type DynamicGlobalProperties = {
  accounts_registered_this_interval: number;
  current_aslot: number;
  current_witness: string;
  dynamic_flags: number;
  head_block_id: string;
  head_block_number: number;
  id: string;
  last_budget_time: string;
  last_irreversible_block_num: number;
  last_son_payment_time: string;
  next_maintenance_time: string;
  recent_slots_filled: string;
  recently_missed_count: number;
  son_budget: number;
  time: string;
  witness_budget: number;
};

export type AssetDynamicData = {
  accumulated_fees: number;
  confidential_supply: number;
  current_supply: string;
  fee_pool: number;
  id: string;
};
