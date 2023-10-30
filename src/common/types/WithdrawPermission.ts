import { Amount } from "./Asset";

export type WithdrawPermission = {
  withdraw_from_account: string;
  authorized_account: string;
  withdrawal_limit: Amount;
  withdrawal_period_sec: number;
  period_start_time: string;
  expiration: string;
  claimed_this_period: number;
};
