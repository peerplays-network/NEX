import { Amount } from "./Asset";

export type TransferOperation = {
  fee: Amount;
  from: string;
  to: string;
  amount: Amount;
  // memo?:
};
