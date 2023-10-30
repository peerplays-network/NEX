import counterpart from "counterpart";
import { useMemo } from "react";

import {
  BITCOIN_ASSET_SYMBOL,
  defaultToken,
  ETHEREUM_ASSET_SYMBOL,
} from "../../../../../../api/params";
import { utils } from "../../../../../../api/utils";
import {
  DashboardLoginButton,
  LoadingIndicator,
  LogoSelectOption,
  PasswordModal,
  TransactionModal,
} from "../../../../../../common/components";
import { useAsset, useTransactionForm } from "../../../../../../common/hooks";
import {
  useAssetsContext,
  useUserContext,
} from "../../../../../../common/providers";
import { Asset } from "../../../../../../common/types";
import { Form, Input } from "../../../../../../ui/src";

import * as Styled from "./WithdrawForm.styled";
import {
  BtcFormBody,
  EthFormBody,
  GenerateBitcoinAddresses,
  HiveFormBody,
} from "./components";
import { useWithdrawForm } from "./hooks";

export const WithdrawForm = (): JSX.Element => {
  const { localStorageAccount } = useUserContext();
  const { sidechainAssets } = useAssetsContext();
  const { limitByPrecision } = useAsset();
  const {
    withdrawForm,
    formValidation,
    handleValuesChange,
    selectedAssetSymbol,
    handleAssetChange,
    transactionMessageState,
    dispatchTransactionMessage,
    handleWithdraw,
    amount,
    userBalance,
    withdrawFee,
    btcTransferFee,
    selectedAssetPrecision,
    bitcoinSidechainAccount,
    ethereumSidechainAccount,
    getSidechainAccounts,
    loadingSidechainAccounts,
    ethTransferFee,
  } = useWithdrawForm();

  const {
    isPasswordModalVisible,
    isTransactionModalVisible,
    hidePasswordModal,
    handleFormFinish,
    hideTransactionModal,
  } = useTransactionForm({
    executeTransaction: handleWithdraw,
    dispatchTransactionMessage,
    neededKeyType: "active",
  });

  let withdrawAddress = "";
  if ((withdrawForm as any).__INTERNAL__.name) {
    // do form logic here
    const values = withdrawForm.getFieldsValue();
    withdrawAddress = values.withdrawAddress;
  }
  const precisedAmount = limitByPrecision(amount, selectedAssetPrecision);
  const isLoggedIn =
    localStorageAccount && localStorageAccount !== "" ? true : false;
  const renderUserBalance = isLoggedIn ? (
    <Styled.Balance>{`${counterpart.translate(
      `field.labels.balance`
    )}: ${userBalance}`}</Styled.Balance>
  ) : (
    ""
  );
  const transactionModalFee = useMemo(() => {
    if (selectedAssetSymbol === BITCOIN_ASSET_SYMBOL) {
      return `${withdrawFee} ${defaultToken} + ${btcTransferFee} ${BITCOIN_ASSET_SYMBOL}`;
    } else if (selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL) {
      return `${withdrawFee} ${defaultToken} + ${ethTransferFee} ${ETHEREUM_ASSET_SYMBOL}`;
    } else {
      return `${withdrawFee}`;
    }
  }, [
    selectedAssetSymbol,
    BITCOIN_ASSET_SYMBOL,
    withdrawFee,
    defaultToken,
    btcTransferFee,
    ETHEREUM_ASSET_SYMBOL,
    ethTransferFee,
  ]);

  const formBody = useMemo(() => {
    if (selectedAssetSymbol === BITCOIN_ASSET_SYMBOL) {
      return (
        <BtcFormBody
          bitcoinSidechainAccount={bitcoinSidechainAccount}
          btcTransferFee={btcTransferFee}
          formValidation={formValidation}
          getSidechainAccounts={getSidechainAccounts}
          isLoggedIn={isLoggedIn}
          localStorageAccount={localStorageAccount}
          precisedAmount={precisedAmount}
          withdrawFee={withdrawFee}
        />
      );
    } else if (selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL) {
      return (
        <EthFormBody
          ethTransferFee={ethTransferFee}
          ethereumSidechainAccount={ethereumSidechainAccount}
          formValidation={formValidation}
          localStorageAccount={localStorageAccount}
          precisedAmount={precisedAmount}
          withdrawFee={withdrawFee}
        />
      );
    } else {
      return (
        <HiveFormBody
          formValidation={formValidation}
          localStorageAccount={localStorageAccount}
          precisedAmount={precisedAmount}
          selectedAssetSymbol={selectedAssetSymbol}
          withdrawFee={withdrawFee}
        />
      );
    }
  }, [
    selectedAssetSymbol,
    BITCOIN_ASSET_SYMBOL,
    bitcoinSidechainAccount,
    btcTransferFee,
    formValidation,
    getSidechainAccounts,
    isLoggedIn,
    localStorageAccount,
    precisedAmount,
    withdrawFee,
    ethTransferFee,
    ethereumSidechainAccount,
  ]);

  const formBodyWithLoading = loadingSidechainAccounts ? (
    <Styled.LoadingIndicatorContainer>
      <LoadingIndicator type="three-bounce" />
    </Styled.LoadingIndicatorContainer>
  ) : (
    formBody
  );

  return (
    <>
      <Form.Provider onFormFinish={handleFormFinish}>
        <Styled.WithdrawForm
          form={withdrawForm}
          name="withdrawForm"
          onValuesChange={handleValuesChange}
          size="large"
          validateTrigger={["onChange", "onSubmit"]}
          initialValues={{
            withdrawAddress: bitcoinSidechainAccount?.account.withdraw_address,
            withdrawPublicKey:
              bitcoinSidechainAccount?.account.withdraw_public_key,
          }}
        >
          <Form.Item>
            <Input.Group compact>
              <Styled.WithdrawFormAsset>
                <LogoSelectOption
                  assets={sidechainAssets as Asset[]}
                  value={selectedAssetSymbol}
                  onChange={handleAssetChange}
                />
                {renderUserBalance}
              </Styled.WithdrawFormAsset>
              <Styled.WithdrawFormAssetAmount
                name="amount"
                validateFirst={true}
                rules={formValidation.amount}
                noStyle
              >
                <Input
                  placeholder="0.0"
                  type="number"
                  step="any"
                  min={0}
                  onKeyPress={utils.ensureInputNumberValidity}
                  disabled={!isLoggedIn}
                  autoComplete="off"
                />
              </Styled.WithdrawFormAssetAmount>
            </Input.Group>
          </Form.Item>

          {isLoggedIn ? (
            <>{formBodyWithLoading}</>
          ) : (
            <DashboardLoginButton
              buttonText={counterpart.translate(`buttons.log_in_withdraw`, {
                selectedAsset: selectedAssetSymbol,
              })}
            />
          )}
        </Styled.WithdrawForm>

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
          fee={transactionModalFee}
          asset={selectedAssetSymbol}
          withdrawAddress={withdrawAddress}
          amount={amount}
          transactionType="withdraw"
        />
      </Form.Provider>
      <GenerateBitcoinAddresses
        bitcoinSidechainAccount={bitcoinSidechainAccount}
        getSidechainAccounts={getSidechainAccounts}
        loadingSidechainAccounts={loadingSidechainAccounts}
        isLoggedIn={isLoggedIn}
        selectedAssetSymbol={selectedAssetSymbol}
      />
    </>
  );
};
