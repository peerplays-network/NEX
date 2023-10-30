import counterpart from "counterpart";
import { useMemo } from "react";

import {
  BITCOIN_ASSET_SYMBOL,
  BITCOIN_NETWORK,
  DEFAULT_NETWORK,
  defaultToken,
  ETHEREUM_ASSET_SYMBOL,
  ETHEREUM_NETWORK,
} from "../../../../../../api/params";
import { utils } from "../../../../../../api/utils";
import {
  PasswordModal,
  TransactionModal,
} from "../../../../../../common/components";
import { useAsset, useTransactionForm } from "../../../../../../common/hooks";
import { Form, Input, Progress } from "../../../../../../ui/src";
import BitcoinIcon from "../../../../../../ui/src/icons/Cryptocurrencies/BitcoinIcon.svg";
import EthereumIcon from "../../../../../../ui/src/icons/Cryptocurrencies/EthereumIcon.svg";
import HIVEIcon from "../../../../../../ui/src/icons/Cryptocurrencies/HIVEIcon.svg";
import PPYIcon from "../../../../../../ui/src/icons/Cryptocurrencies/PPYIcon.svg";

import * as Styled from "./SendForm.styled";
import { TransactionDetails } from "./components";
import { useSendForm } from "./hooks";

type Props = {
  assetSymbol?: string;
};

export const SendForm = ({ assetSymbol }: Props): JSX.Element => {
  const {
    assets,
    onAssetChange,
    assetBlockchains,
    sendForm,
    selectedAssetSymbol,
    userAsset,
    handleValuesChange,
    onBlockchainChange,
    selectedBlockchain,
    formValidation,
    feeAmount,
    send,
    dispatchTransactionMessage,
    transactionMessageState,
    localStorageAccount,
    amount,
    toAccount,
    selectedAssetPrecision,
    btcTransferFee,
    ethTransferFee,
    afterTransactionModalClose,
  } = useSendForm({
    assetSymbol,
  });
  const { limitByPrecision } = useAsset();
  const icons: {
    [blockchain: string]: JSX.Element;
  } = {
    Peerplays: <PPYIcon height="20" width="20" />,
    Hive: <HIVEIcon height="20" width="20" />,
    Bitcoin: <BitcoinIcon height="20" width="20" />,
    Ethereum: <EthereumIcon height="20" width="20" />,
  };

  const {
    isPasswordModalVisible,
    isTransactionModalVisible,
    hidePasswordModal,
    handleFormFinish,
    hideTransactionModal,
  } = useTransactionForm({
    executeTransaction: send,
    dispatchTransactionMessage,
    neededKeyType: "active",
  });

  const precisedAmount = limitByPrecision(amount, selectedAssetPrecision);
  const transactionModalFee = useMemo(() => {
    if (selectedBlockchain === BITCOIN_NETWORK) {
      return `${feeAmount} ${defaultToken} + ${btcTransferFee} ${BITCOIN_ASSET_SYMBOL}`;
    } else if (selectedBlockchain === ETHEREUM_NETWORK) {
      return `${feeAmount} ${defaultToken} + ${ethTransferFee} ${ETHEREUM_ASSET_SYMBOL}`;
    } else {
      return `${feeAmount} ${defaultToken}`;
    }
  }, [
    selectedBlockchain,
    BITCOIN_NETWORK,
    ETHEREUM_NETWORK,
    feeAmount,
    defaultToken,
    btcTransferFee,
    BITCOIN_ASSET_SYMBOL,
    ethTransferFee,
    ETHEREUM_ASSET_SYMBOL,
  ]);

  return (
    <Form.Provider onFormFinish={handleFormFinish}>
      <Styled.SendForm
        name="sendForm"
        size="large"
        form={sendForm}
        onValuesChange={handleValuesChange}
        validateTrigger={["onChange", "onBlur", "onSubmit"]}
        initialValues={{
          asset: assetSymbol,
        }}
      >
        <div className="two-input-row">
          <Form.Item
            name="asset"
            rules={formValidation.asset}
            validateFirst={true}
          >
            <Styled.AssetSelector
              placeholder={counterpart.translate(`pages.wallet.select_asset`)}
              value={selectedAssetSymbol}
              onChange={onAssetChange}
            >
              {assets.map((asset) => {
                return (
                  <Styled.AssetOption key={asset.id} value={asset.symbol}>
                    {`${
                      asset.symbol
                    } - ${utils.getNativeBlockchainFromAssetSymbol(
                      asset.symbol
                    )}`}
                  </Styled.AssetOption>
                );
              })}
            </Styled.AssetSelector>
          </Form.Item>

          <Form.Item
            name="blockchain"
            rules={formValidation.blockchain}
            validateFirst={true}
          >
            <Styled.BlockchainSelector
              placeholder={counterpart.translate(
                `pages.wallet.select_blockchain`
              )}
              onChange={onBlockchainChange}
              disabled={assetSymbol ? false : true}
              value={selectedBlockchain}
            >
              {assetBlockchains.map((blockchain, index) => {
                const key = `${blockchain}-${index}`;
                return (
                  <Styled.BlockchainOption key={key} value={blockchain}>
                    <Styled.contentWrapper>
                      <Styled.IconWrapper>
                        {icons[blockchain]}
                      </Styled.IconWrapper>
                      <div>{blockchain}</div>
                    </Styled.contentWrapper>
                  </Styled.BlockchainOption>
                );
              })}
            </Styled.BlockchainSelector>
          </Form.Item>
        </div>
        <Styled.AvailableAssetAndProgressWrapper>
          <Styled.AvailableAssetWrapper>
            <Styled.AvailableAssetLabel>
              {counterpart.translate(`pages.wallet.available_to_send`)}
            </Styled.AvailableAssetLabel>
            <Styled.AvailableAssetAmount>
              {userAsset ? userAsset.amount : 0}
            </Styled.AvailableAssetAmount>
          </Styled.AvailableAssetWrapper>
          <Progress
            status="normal"
            percent={
              userAsset && userAsset.amount && amount
                ? Number(((Number(amount) / userAsset.amount) * 100).toFixed(1))
                : 0
            }
          />
        </Styled.AvailableAssetAndProgressWrapper>
        <div className="two-input-row">
          <Form.Item
            name="amount"
            validateFirst={true}
            rules={formValidation.amount}
          >
            <Input
              placeholder={counterpart.translate(
                `field.placeholder.enter_amount`
              )}
              type="number"
              min={0}
              onKeyPress={utils.ensureInputNumberValidity}
              onPaste={utils.numberedInputsPasteHandler}
              step="any"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item name="to" validateFirst={true} rules={formValidation.to}>
            <Input
              placeholder={counterpart.translate(
                `field.placeholder.enter_recipient`
              )}
              autoComplete="off"
              disabled={
                selectedBlockchain === BITCOIN_NETWORK ||
                selectedBlockchain === ETHEREUM_NETWORK
              }
            />
          </Form.Item>
        </div>
        {selectedBlockchain === undefined ||
        selectedBlockchain === DEFAULT_NETWORK ? (
          <>
            <p>{counterpart.translate(`field.comments.public_memo`)}</p>
            <Styled.MemoWrapper>
              <Styled.MemoFormItem
                name="memo"
                validateFirst={true}
                validateTrigger="onChange"
              >
                <Styled.Memo
                  placeholder={counterpart.translate(`field.placeholder.memo`)}
                  maxLength={256}
                  disabled={selectedBlockchain !== DEFAULT_NETWORK}
                />
              </Styled.MemoFormItem>
            </Styled.MemoWrapper>
          </>
        ) : (
          <Styled.AlertWrapper>
            <Styled.AlertIcon />
            <Styled.AlertText>
              {counterpart.translate("pages.wallet.withdraw_alert")}
            </Styled.AlertText>
          </Styled.AlertWrapper>
        )}
        {(selectedBlockchain === BITCOIN_NETWORK ||
          selectedBlockchain === ETHEREUM_NETWORK) &&
        !toAccount ? (
          <Styled.AlertWrapper>
            <Styled.AlertIcon />
            <Styled.AlertText>
              {counterpart.translate(
                "field.errors.first_generate_deposit_addresses"
              )}
            </Styled.AlertText>
          </Styled.AlertWrapper>
        ) : (
          ""
        )}

        <TransactionDetails
          btcTransferFee={btcTransferFee}
          ethTransferFee={ethTransferFee}
          feeAmount={feeAmount}
          precisedAmount={precisedAmount}
          selectedAssetSymbol={selectedAssetSymbol}
          selectedBlockchain={selectedBlockchain}
        />
        <Styled.FormItem>
          <Styled.TransferFormButton type="primary" htmlType="submit">
            {counterpart.translate(`buttons.send`)}
          </Styled.TransferFormButton>
        </Styled.FormItem>
      </Styled.SendForm>
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
        to={toAccount}
        amount={amount}
        blockchain={selectedBlockchain}
        transactionType="transfer"
        afterClose={afterTransactionModalClose}
      />
    </Form.Provider>
  );
};
