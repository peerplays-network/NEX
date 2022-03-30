import { FormInstance, Rule } from "../../../../ui/src";

export type UseTransferFormResult = {
  status: string;
  visible: boolean;
  feeAmount: number;
  formValdation: FormValidation;
  transferForm: FormInstance<TransferForm>;
  onFormFinish: (name: string, info: { values: any; forms: any }) => void;
  onCancel: () => void;
  confirm: () => void;
  handleValuesChange: (changedValues: any) => void;
};

export type FormField = {
  field: string;
  fullField: string;
  type: string;
  validator: unknown;
};

export type FormValidation = {
  from: Rule[];
  to: Rule[];
  amount: Rule[];
  asset: Rule[];
  memo: Rule[];
};

export type TransferForm = {
  form: string;
  to: string;
  amount: number;
  asset: string;
  memo: string;
};
