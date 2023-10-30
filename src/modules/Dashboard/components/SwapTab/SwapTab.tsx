import counterpart from "counterpart";
import { FocusEvent, useCallback, useState } from "react";

import { defaultToken } from "../../../../api/params";
import { utils } from "../../../../api/utils";
import {
  DashboardLoginButton,
  LogoSelectOption,
  PasswordModal,
  TransactionModal,
} from "../../../../common/components";
import { useTransactionForm } from "../../../../common/hooks";
import {
  CardFormButton,
  Form,
  InfoCircleOutlined,
  Input,
  SwapOutlined,
} from "../../../../ui/src";

import * as Styled from "./SwapTab.styled";
import { useSwap } from "./hooks";

export const SwapTab = (): JSX.Element => {
  const {
    swapForm,
    transactionMessageState,
    dispatchTransactionMessage,
    selectedAssetsSymbols,
    allAssets,
    handleSellAssetChange,
    handleBuyAssetChange,
    localStorageAccount,
    swapOrderFee,
    price,
    loadingSwapData,
    handleValuesChange,
    handleSwapAssets,
    buyAssetBalance,
    sellAssetBalance,
    handleSwapSubmit,
    formValidation,
    sellAmountErrors,
    buyAmountErrors,
    lastChangedField,
    buyAssetMarketFee,
  } = useSwap();

  const {
    isPasswordModalVisible,
    isTransactionModalVisible,
    hidePasswordModal,
    handleFormFinish,
    hideTransactionModal,
  } = useTransactionForm({
    executeTransaction: handleSwapSubmit,
    dispatchTransactionMessage,
    neededKeyType: "active",
  });

  const selectOnFocus = useCallback(
    (e: FocusEvent<HTMLInputElement, Element>) => {
      e.target.select();
    },
    []
  );
  const [transactionModalSellAmount, setTransactionModalSellAmount] =
    useState<string>("");
  const [transactionModalBuyAmount, setTransactionModalBuyAmount] =
    useState<string>("");

  const isLoggedIn = localStorageAccount ? true : false;
  const renderUserSellAssetBalance = isLoggedIn ? (
    <Styled.Balance>{`${counterpart.translate(
      `field.labels.balance`
    )}: ${sellAssetBalance}`}</Styled.Balance>
  ) : (
    ""
  );
  const renderUserBuyAssetBalance = localStorageAccount ? (
    <Styled.Balance>{`${counterpart.translate(
      `field.labels.balance`
    )}: ${buyAssetBalance}`}</Styled.Balance>
  ) : (
    ""
  );

  const renderPriceLeftSideEquality =
    "1 " + selectedAssetsSymbols.buyAssetSymbol;
  const renderPriceRightSideEquality =
    price + " " + selectedAssetsSymbols.sellAssetSymbol;
  const renderPriceAmount =
    price === undefined ? (
      ""
    ) : (
      <>
        <span>
          {renderPriceLeftSideEquality} &#8776; {renderPriceRightSideEquality}
        </span>
        <InfoCircleOutlined />
      </>
    );
  const renderPrice = loadingSwapData ? (
    <>
      <Styled.PriceLoadingOutlined></Styled.PriceLoadingOutlined>
      {counterpart.translate(`field.labels.fetching_price`) + "..."}
    </>
  ) : (
    renderPriceAmount
  );

  const swapHasError =
    sellAmountErrors.length > 0 || buyAmountErrors.length > 0;
  const renderBuyAmountError =
    buyAmountErrors.length > 0 ? buyAmountErrors[0] : sellAmountErrors[0];
  const renderSellAmountError =
    lastChangedField === "sellAsset" && sellAmountErrors.length > 0
      ? sellAmountErrors[0]
      : renderBuyAmountError;
  const renderSwapButtonText = swapHasError
    ? renderSellAmountError
    : counterpart.translate(`buttons.swap_coins`);

  const renderSubmitButton = isLoggedIn ? (
    <Styled.SwapButtonFormItem>
      <CardFormButton
        type="primary"
        htmlType="submit"
        disabled={swapHasError || loadingSwapData}
      >
        {renderSwapButtonText}
      </CardFormButton>
    </Styled.SwapButtonFormItem>
  ) : (
    <DashboardLoginButton
      buttonText={counterpart.translate(`buttons.login_and_swap_coins`)}
    />
  );

  const transactionModalMarketFee =
    Number(buyAssetMarketFee) > 0
      ? `+ ${buyAssetMarketFee} ${selectedAssetsSymbols.buyAssetSymbol}`
      : "";

  const transactionModalFee = `${swapOrderFee} ${defaultToken} ${transactionModalMarketFee}`;

  const feeSummary = (
    <>
      <div>{`${swapOrderFee} ${defaultToken}`}</div>
      {Number(buyAssetMarketFee) > 0 ? (
        <div>
          + {`${buyAssetMarketFee} ${selectedAssetsSymbols.buyAssetSymbol}`}
        </div>
      ) : (
        ""
      )}
    </>
  );

  const renderTransactionDetails = isLoggedIn ? (
    <Styled.TransactionDetails>
      <Styled.FeeInfo>
        {counterpart.translate(`field.labels.swap_fee_info`)}
      </Styled.FeeInfo>
      <Styled.DetailsWrapper>
        <Styled.DetailsLabelWrapper>
          {counterpart.translate(`field.labels.fees_label`)}
        </Styled.DetailsLabelWrapper>
        <Styled.AmountsWrapper>{feeSummary}</Styled.AmountsWrapper>
      </Styled.DetailsWrapper>

      <Styled.DetailsWrapper>
        <Styled.DetailsLabelWrapper>
          {counterpart.translate(`transaction.transaction_type`)}
        </Styled.DetailsLabelWrapper>
        <Styled.AmountsWrapper>
          {counterpart.translate(`transaction.trade`)}
        </Styled.AmountsWrapper>
      </Styled.DetailsWrapper>
    </Styled.TransactionDetails>
  ) : (
    ""
  );

  return (
    <Styled.SwapContainer>
      <Styled.SwapForm.Provider onFormFinish={handleFormFinish}>
        <Styled.SwapForm
          form={swapForm}
          name="swapForm"
          onValuesChange={handleValuesChange}
          onFinish={() => {
            const values = swapForm.getFieldsValue();
            setTransactionModalSellAmount(values.sellAmount);
            setTransactionModalBuyAmount(values.buyAmount);
          }}
          initialValues={{
            sellAmount: "0",
            buyAmount: "0",
          }}
          validateTrigger={["onChange", "onSubmit", "onBlur"]}
        >
          <Styled.SwapButton
            icon={<SwapOutlined />}
            shape="circle"
            onClick={handleSwapAssets}
          />
          <Form.Item>
            <Input.Group compact>
              <Styled.AssetSelectContainer>
                <LogoSelectOption
                  id="sellAsset"
                  value={selectedAssetsSymbols.sellAssetSymbol}
                  assets={allAssets.filter(
                    (asset) =>
                      asset.symbol !== selectedAssetsSymbols.buyAssetSymbol
                  )}
                  onChange={handleSellAssetChange}
                />
                {renderUserSellAssetBalance}
              </Styled.AssetSelectContainer>
              <Styled.SwapSellItem
                name="sellAmount"
                rules={formValidation.sellAmount}
                validateFirst={true}
                help={""}
                validateStatus={""}
                noStyle
              >
                <Input
                  placeholder="0.0"
                  onFocus={selectOnFocus}
                  autoComplete="off"
                  onKeyPress={utils.ensureInputNumberValidity}
                  onPaste={utils.numberedInputsPasteHandler}
                  disabled={!isLoggedIn}
                />
              </Styled.SwapSellItem>
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Input.Group compact>
              <Styled.AssetSelectContainer>
                <LogoSelectOption
                  id="buyAsset"
                  value={selectedAssetsSymbols.buyAssetSymbol}
                  assets={allAssets.filter(
                    (asset) =>
                      asset.symbol !== selectedAssetsSymbols.sellAssetSymbol
                  )}
                  onChange={handleBuyAssetChange}
                />
                {renderUserBuyAssetBalance}
              </Styled.AssetSelectContainer>
              <Styled.SwapItem
                name="buyAmount"
                rules={formValidation.buyAmount}
                validateFirst={true}
                help={""}
                validateStatus={""}
                noStyle
              >
                <Input
                  placeholder="0.0"
                  onFocus={selectOnFocus}
                  onKeyPress={utils.ensureInputNumberValidity}
                  onPaste={utils.numberedInputsPasteHandler}
                  autoComplete="off"
                  disabled={!isLoggedIn}
                />
              </Styled.SwapItem>
            </Input.Group>
          </Form.Item>

          {isLoggedIn ? (
            <Styled.PriceContainer>{renderPrice}</Styled.PriceContainer>
          ) : (
            ""
          )}
          {renderTransactionDetails}
          {renderSubmitButton}
        </Styled.SwapForm>

        <TransactionModal
          visible={isTransactionModalVisible}
          onCancel={hideTransactionModal}
          transactionMessageState={transactionMessageState}
          account={localStorageAccount}
          fee={transactionModalFee}
          transactionType="swap_order_create"
          sell={`${transactionModalSellAmount} ${selectedAssetsSymbols.sellAssetSymbol}`}
          buy={`${transactionModalBuyAmount} ${selectedAssetsSymbols.buyAssetSymbol}`}
        />
        <PasswordModal
          visible={isPasswordModalVisible}
          onCancel={hidePasswordModal}
          neededKeyType="active"
        />
      </Styled.SwapForm.Provider>
    </Styled.SwapContainer>
  );
};
