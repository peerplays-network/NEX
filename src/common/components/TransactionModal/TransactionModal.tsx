import counterpart from "counterpart";

import { CardFormButton } from "../../../ui/src";
import { TransactionMessageState } from "../../hooks";
import { GeneratedKey, Proxy } from "../../types";

import * as Styled from "./TransactionModal.styled";
import {
  AccountUpdate,
  AccountUpgrade,
  CancelLimitOrder,
  CreateLimitOrder,
  CreateSwapOrder,
  CreateVestingBalance,
  GenerateBitcoinAddresses,
  Transfer,
  Withdraw,
  WithdrawVestingBalance,
} from "./components";
import { useTransactionModal } from "./hooks";

type Props = {
  visible: boolean;
  onCancel: () => void;
  transactionType: string;
  transactionMessageState: TransactionMessageState;
  account?: string;
  fee: number | string;
  proxy?: Proxy;
  memberType?: string;
  generatedKeys?: GeneratedKey[];
  price?: string;
  sell?: string;
  buy?: string;
  expiration?: string;
  vestingAmount?: string;
  withdrawalAmount?: string;
  asset?: string;
  to?: string;
  amount?: string;
  orderId?: string;
  withdrawAddress?: string;
  sidechain?: string;
  afterClose?: () => void;
  blockchain?: string;
  approvedMembers?: number;
  removedMembers?: number;
};

export const TransactionModal = ({
  visible,
  onCancel,
  transactionType,
  transactionMessageState,
  account,
  fee,
  proxy,
  memberType,
  generatedKeys,
  price,
  sell,
  buy,
  expiration,
  vestingAmount,
  withdrawalAmount,
  asset,
  to,
  amount,
  orderId,
  withdrawAddress,
  sidechain,
  afterClose,
  blockchain,
  approvedMembers,
  removedMembers,
}: Props): JSX.Element => {
  const transactionDetails: {
    [transactionType: string]: JSX.Element;
  } = {
    account_upgrade: (
      <AccountUpgrade account={account as string} fee={fee as number} />
    ),
    account_update: (
      <AccountUpdate
        account={account as string}
        fee={fee as number}
        proxy={proxy}
        approvedMembers={approvedMembers}
        removedMembers={removedMembers}
        memberType={memberType}
        generatedKeys={generatedKeys}
      />
    ),
    limit_order_create: (
      <CreateLimitOrder
        account={account as string}
        fee={fee as number}
        price={price as string}
        sell={sell as string}
        buy={buy as string}
        expiration={expiration as string}
      />
    ),
    swap_order_create: (
      <CreateSwapOrder
        account={account as string}
        fee={fee as string}
        price={price as string}
        sell={sell as string}
        buy={buy as string}
      />
    ),
    limit_order_cancel: (
      <CancelLimitOrder
        account={account as string}
        fee={fee as number}
        orderId={orderId as string}
      />
    ),
    vesting_balance_create: (
      <CreateVestingBalance
        vestingAmount={vestingAmount}
        fee={fee as number}
        account={account}
      />
    ),
    vesting_balance_withdraw: (
      <WithdrawVestingBalance
        withdrawalAmount={withdrawalAmount}
        fee={fee as number}
        account={account}
      />
    ),
    sidechain_address_add: (
      <GenerateBitcoinAddresses
        account={account as string}
        fee={fee as number}
        sidechain={sidechain as string}
      />
    ),
    transfer: (
      <Transfer
        account={account as string}
        fee={fee as number}
        asset={asset as string}
        to={to as string}
        amount={amount as string}
        blockchain={blockchain as string}
      />
    ),
    withdraw: (
      <Withdraw
        account={account as string}
        fee={fee as string}
        asset={asset as string}
        withdrawAddress={withdrawAddress as string}
        amount={amount as string}
      />
    ),
  };

  const { useResetFormOnCloseModal, transactionModalForm } =
    useTransactionModal();

  useResetFormOnCloseModal(transactionModalForm, visible);

  const postTransactionButton =
    transactionMessageState.transactionErrorMessage !== "" ? (
      <CardFormButton key="back" onClick={onCancel} className="cancel">
        {counterpart.translate(`buttons.cancel`)}
      </CardFormButton>
    ) : (
      <CardFormButton key="back" onClick={onCancel} className="cancel">
        {counterpart.translate(`buttons.done`)}
      </CardFormButton>
    );

  const defaultButtons = [
    <CardFormButton
      key="submit"
      type="primary"
      onClick={() => {
        transactionModalForm.submit();
      }}
      loading={transactionMessageState.loadingTransaction}
    >
      {counterpart.translate(`buttons.confirm`)}
    </CardFormButton>,
    <CardFormButton
      key="back"
      onClick={onCancel}
      disabled={transactionMessageState.loadingTransaction}
      className="cancel"
    >
      {counterpart.translate(`buttons.cancel`)}
    </CardFormButton>,
  ];

  return (
    <>
      <Styled.TransactionModal
        title={counterpart.translate(`pages.modal.transaction_modal.heading`)}
        open={visible}
        onOk={() => {
          transactionModalForm.submit();
        }}
        onCancel={
          !transactionMessageState.loadingTransaction ? onCancel : undefined
        }
        centered={true}
        footer={
          transactionMessageState.transactionErrorMessage !== "" ||
          transactionMessageState.transactionSuccessMessage !== ""
            ? postTransactionButton
            : defaultButtons
        }
        afterClose={afterClose}
      >
        <Styled.TransactionModalForm
          form={transactionModalForm}
          name="transactionModal"
          size="large"
        ></Styled.TransactionModalForm>
        <Styled.DetailContainer>
          <Styled.TransactionType>
            {counterpart.translate(
              `transaction.trxTypes.${transactionType}.title`
            )}
          </Styled.TransactionType>
        </Styled.DetailContainer>
        {transactionDetails[transactionType] !== undefined
          ? transactionDetails[transactionType]
          : ""}
        {transactionMessageState.transactionErrorMessage !== "" ? (
          <Styled.TransactionError>
            {transactionMessageState.transactionErrorMessage}
          </Styled.TransactionError>
        ) : (
          ""
        )}
        {transactionMessageState.transactionSuccessMessage !== "" ? (
          <Styled.TransactionSuccess>
            {transactionMessageState.transactionSuccessMessage}
          </Styled.TransactionSuccess>
        ) : (
          ""
        )}
      </Styled.TransactionModal>
    </>
  );
};
