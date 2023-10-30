import counterpart from "counterpart";
import React from "react";

import { PasswordModal, TransactionModal } from "..";
import { ETHEREUM_NETWORK } from "../../../api/params";
import { Form } from "../../../ui/src";
import { useTransactionForm } from "../../hooks";
import { useUserContext } from "../../providers";
import { SidechainAccount } from "../../types";

import * as Styled from "./AddOrUpdateEthereumDepositAddress.styled";
import { useAddOrUpdateEthereumDepositAddress } from "./hooks";

type Props = {
  getSidechainAccounts: (accountId: string) => Promise<void>;
  className?: string;
  ethereumSidechainAccount?: {
    account: SidechainAccount;
    hasDepositAddress: boolean;
  };
};

export const AddOrUpdateEthereumDepositAddress = ({
  className,
  getSidechainAccounts,
  ethereumSidechainAccount,
}: Props): JSX.Element => {
  const { localStorageAccount } = useUserContext();
  const {
    formValidation,
    ethereumAddressForm,
    transactionMessageState,
    dispatchTransactionMessage,
    addOrUpdateEthereumDepositAddress,
  } = useAddOrUpdateEthereumDepositAddress(
    getSidechainAccounts,
    ethereumSidechainAccount
  );

  const {
    isPasswordModalVisible,
    isTransactionModalVisible,
    hidePasswordModal,
    handleFormFinish,
    hideTransactionModal,
  } = useTransactionForm({
    executeTransaction: addOrUpdateEthereumDepositAddress,
    dispatchTransactionMessage,
    neededKeyType: "active",
  });

  return (
    <>
      <Form.Provider onFormFinish={handleFormFinish}>
        <Styled.DepositForm
          form={ethereumAddressForm}
          name="ethereumAddressForm"
          className={className}
          validateTrigger={["onChange", "onSubmit"]}
          initialValues={{
            address: ethereumSidechainAccount?.account.deposit_address,
          }}
        >
          <Styled.FormItem
            name="address"
            validateFirst={true}
            rules={formValidation.address}
          >
            <Styled.Input
              placeholder={counterpart.translate(
                `field.placeholder.deposit_address`
              )}
              className="form-input"
              disabled={localStorageAccount ? false : true}
              autoComplete="off"
            />
          </Styled.FormItem>
          <Styled.ButtonFormItem>
            <Styled.Button type="primary" htmlType="submit">
              {ethereumSidechainAccount &&
              ethereumSidechainAccount.hasDepositAddress
                ? counterpart.translate(`buttons.update_ethereum_address`)
                : counterpart.translate(`buttons.add_ethereum_address`)}
            </Styled.Button>
          </Styled.ButtonFormItem>
        </Styled.DepositForm>

        <PasswordModal
          neededKeyType="active"
          visible={isPasswordModalVisible}
          onCancel={hidePasswordModal}
        />
        <TransactionModal
          visible={isTransactionModalVisible}
          onCancel={hideTransactionModal}
          transactionMessageState={transactionMessageState}
          account={localStorageAccount}
          fee={0}
          sidechain={ETHEREUM_NETWORK}
          transactionType="sidechain_address_add"
        />
      </Form.Provider>
    </>
  );
};
