import counterpart from "counterpart";

import { DownloadBitcoinKeys } from "../../../../../../../../common/components";
import { SidechainAccount } from "../../../../../../../../common/types";
import { Form, Input, Rule } from "../../../../../../../../ui/src";
import BitcoinIcon from "../../../../../../../../ui/src/icons/Cryptocurrencies/BitcoinIcon.svg";
import { SubmitButton } from "../SubmitButton";
import { TransactionDetails } from "../TransactionDetails";

import * as Styled from "./BtcFormBody.styled";

type FormValidation = {
  from: Rule[];
  amount: Rule[];
  withdrawAddress: Rule[];
  withdrawPublicKey: Rule[];
};
type Props = {
  bitcoinSidechainAccount:
    | {
        account: SidechainAccount;
        hasDepositAddress: boolean;
      }
    | undefined;
  localStorageAccount: string;
  isLoggedIn: boolean;
  formValidation: FormValidation;
  getSidechainAccounts: (accountId: string) => Promise<void>;
  withdrawFee: number;
  btcTransferFee: number;
  precisedAmount: string;
};
export const BtcFormBody = ({
  bitcoinSidechainAccount,
  localStorageAccount,
  isLoggedIn,
  formValidation,
  getSidechainAccounts,
  withdrawFee,
  btcTransferFee,
  precisedAmount,
}: Props): JSX.Element => {
  return bitcoinSidechainAccount &&
    bitcoinSidechainAccount.hasDepositAddress ? (
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
        {counterpart.translate(`field.labels.withdraw_public_key_address`)}
      </p>

      <Form.Item
        name="withdrawPublicKey"
        validateFirst={true}
        rules={formValidation.withdrawPublicKey}
      >
        <Input
          placeholder={counterpart.translate(
            `field.placeholder.withdraw_public_key`
          )}
          autoComplete="off"
          className="form-input"
          disabled={!isLoggedIn}
        />
      </Form.Item>
      <Form.Item
        name="withdrawAddress"
        validateFirst={true}
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
          <BitcoinIcon height="30" width="30" />
        </Styled.IconWrapper>
        <span>
          {counterpart.translate(`field.labels.btc_withdraw_instruction`)}
        </span>
      </Styled.WithdrawalInstruction>
      <DownloadBitcoinKeys
        bitcoinSidechainAccount={bitcoinSidechainAccount.account}
        getSidechainAccounts={getSidechainAccounts}
      />
      <TransactionDetails
        selectedAssetSymbol="BTC"
        withdrawFee={withdrawFee}
        btcTransferFee={btcTransferFee}
        precisedAmount={precisedAmount}
      />
      <SubmitButton />
    </>
  ) : (
    <></>
  );
};
