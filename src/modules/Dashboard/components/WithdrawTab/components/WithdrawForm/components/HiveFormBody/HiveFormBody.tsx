import counterpart from "counterpart";

import { Form, Input, Rule } from "../../../../../../../../ui/src";
import HIVEIcon from "../../../../../../../../ui/src/icons/Cryptocurrencies/HIVEIcon.svg";
import { SubmitButton } from "../SubmitButton";
import { TransactionDetails } from "../TransactionDetails";

import * as Styled from "./HiveFormBody.styled";

type FormValidation = {
  from: Rule[];
  amount: Rule[];
  withdrawAddress: Rule[];
  withdrawPublicKey: Rule[];
};
type Props = {
  selectedAssetSymbol: string;
  localStorageAccount: string;
  formValidation: FormValidation;
  withdrawFee: number;
  precisedAmount: string;
};
export const HiveFormBody = ({
  selectedAssetSymbol,
  localStorageAccount,
  formValidation,
  withdrawFee,
  precisedAmount,
}: Props): JSX.Element => {
  return (
    <>
      <Form.Item
        name="from"
        rules={formValidation.from}
        validateFirst={true}
        initialValue={localStorageAccount}
        hidden={true}
      >
        <Input disabled={true} placeholder="From" />
      </Form.Item>
      <p className="label">
        {counterpart.translate(`field.labels.hive_blockchain_account`)}
      </p>

      <Form.Item
        name="withdrawAddress"
        validateFirst={true}
        rules={formValidation.withdrawAddress}
      >
        <Input
          placeholder={counterpart.translate(
            `field.placeholder.hive_blockchain_account`
          )}
          className="form-input"
          disabled={localStorageAccount ? false : true}
        />
      </Form.Item>
      <Styled.WithdrawalInstruction>
        <Styled.IconWrapper>
          <HIVEIcon width="30" height="30" />
        </Styled.IconWrapper>
        <span>
          {counterpart.translate(`field.labels.hive_withdraw_instruction`, {
            asset: selectedAssetSymbol,
          })}
        </span>
      </Styled.WithdrawalInstruction>
      <TransactionDetails
        selectedAssetSymbol={selectedAssetSymbol}
        withdrawFee={withdrawFee}
        precisedAmount={precisedAmount}
      />
      <SubmitButton />
    </>
  );
};
