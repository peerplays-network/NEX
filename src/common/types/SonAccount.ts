export type SonAccount = {
  deposit: string;
  id: string;
  pay_vb: string;
  sidechain_public_keys: [Sidechain | "peerplays", string][];
  sidechain_vote_ids: [Sidechain, string][];
  signing_key: string;
  son_account: string;
  statistics: string;
  statuses: [Sidechain, SonStatus][];
  total_votes: [Sidechain, number][];
  url: string;
};

export type SonStatistics = {
  current_interval_downtime: [Sidechain, number][];
  deregistered_timestamp: string;
  id: string;
  last_active_timestamp: [Sidechain, string][];
  last_down_timestamp: [Sidechain, string][];
  owner: string;
  sidechain_txs_reported: [Sidechain, number][];
  total_downtime: [Sidechain, number][];
  total_sidechain_txs_reported: [Sidechain, number][];
  total_txs_signed: [Sidechain, number][];
  total_voted_time: [Sidechain, number][];
  txs_signed: [Sidechain, number][];
};

export enum Sidechain {
  BITCOIN = "bitcoin",
  ETHEREUM = "ethereum",
  HIVE = "hive",
}

export type SonStatus = "active" | "inactive";
