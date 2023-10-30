import counterpart from "counterpart";

import { ETHEREUM_ASSET_SYMBOL } from "../../../../../../../../api/params";
import { SidechainAccount } from "../../../../../../../../common/types";
import { Form, Input, Rule } from "../../../../../../../../ui/src";
import EthereumIcon from "../../../../../../../../ui/src/icons/Cryptocurrencies/EthereumIcon.svg";
import { SubmitButton } from "../SubmitButton";
import { TransactionDetails } from "../TransactionDetails";

import * as Styled from "./EthFormBody.styled";

type FormValidation = {
  from: Rule[];
  amount: Rule[];
  withdrawAddress: Rule[];
  withdrawPublicKey: Rule[];
};
type Props = {
  ethereumSidechainAccount:
    | {
        account: SidechainAccount;
        hasDepositAddress: boolean;
      }
    | undefined;
  localStorageAccount: string;
  formValidation: FormValidation;
  withdrawFee: number;
  ethTransferFee: number;
  precisedAmount: string;
};
export const EthFormBody = ({
  ethereumSidechainAccount,
  localStorageAccount,
  formValidation,
  withdrawFee,
  ethTransferFee,
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
        {counterpart.translate(`field.labels.ethereum_withdrawal_address`)}
      </p>

      <Form.Item
        name="withdrawAddress"
        validateFirst={true}
        initialValue={ethereumSidechainAccount?.account.withdraw_address}
        rules={formValidation.withdrawAddress}
      >
        <Input
          placeholder={counterpart.translate(
            `field.placeholder.withdraw_address`
          )}
          className="form-input"
          disabled={localStorageAccount ? false : true}
          autoComplete="off"
        />
      </Form.Item>
      <Styled.WithdrawalInstruction>
        <Styled.IconWrapper>
          <EthereumIcon height="30" width="30" />
        </Styled.IconWrapper>
        <span>
          {counterpart.translate(`field.labels.eth_withdraw_instruction`)}
        </span>
      </Styled.WithdrawalInstruction>
      <TransactionDetails
        selectedAssetSymbol={ETHEREUM_ASSET_SYMBOL}
        withdrawFee={withdrawFee}
        ethTransferFee={ethTransferFee}
        precisedAmount={precisedAmount}
      />
      <SubmitButton />
    </>
  );
};
