import counterpart from "counterpart";
import React, { useMemo } from "react";

import {
  BITCOIN_ASSET_SYMBOL,
  config,
  ETHEREUM_ASSET_SYMBOL,
} from "../../../../api/params";
import {
  AddOrUpdateEthereumDepositAddress,
  AddressGenerated,
  DashboardLoginButton,
  DownloadBitcoinKeys,
  GenerateBitcoinAddress,
  HIVEAndHBDDeposit,
  LoadingIndicator,
} from "../../../../common/components";
import { useAssetsContext, useUserContext } from "../../../../common/providers";
import { Asset, Sidechain } from "../../../../common/types";
import BitcoinIcon from "../../../../ui/src/icons/Cryptocurrencies/BitcoinIcon.svg";
import EthereumIcon from "../../../../ui/src/icons/Cryptocurrencies/EthereumIcon.svg";

import * as Styled from "./DepositTab.styled";
import { useDepositTab } from "./hooks";

export const DepositTab = (): JSX.Element => {
  const {
    sidechainAccounts,
    getSidechainAccounts,
    loadingSidechainAccounts,
    localStorageAccount,
  } = useUserContext();
  const { sidechainAssets } = useAssetsContext();
  const { handleAssetChange, selectedAsset } = useDepositTab();
  const bitcoinSidechainAccount = useMemo(() => {
    return sidechainAccounts[Sidechain.BITCOIN];
  }, [sidechainAccounts]);
  const ethereumSidechainAccount = useMemo(() => {
    return sidechainAccounts[Sidechain.ETHEREUM];
  }, [sidechainAccounts]);

  const isLoggedIn = localStorageAccount && localStorageAccount !== "";

  const renderBTCDepositInstruction = (instruction: string) => {
    return (
      <Styled.SidechainDepositInstructionContainer>
        <Styled.SidechainIconWrapper>
          <BitcoinIcon width="30" height="30" />
        </Styled.SidechainIconWrapper>
        <Styled.SidechainDepositInstruction>
          {instruction}
        </Styled.SidechainDepositInstruction>
      </Styled.SidechainDepositInstructionContainer>
    );
  };
  const BTCDeposit =
    bitcoinSidechainAccount && bitcoinSidechainAccount.hasDepositAddress ? (
      <Styled.AddressGeneratedContainer>
        <AddressGenerated
          label={counterpart.translate(`field.labels.bitcoin_deposit_address`)}
          sidechainAccount={bitcoinSidechainAccount.account}
        />
        {renderBTCDepositInstruction(
          counterpart.translate(`field.labels.deposit_btc`)
        )}
        <DownloadBitcoinKeys
          bitcoinSidechainAccount={bitcoinSidechainAccount.account}
          getSidechainAccounts={getSidechainAccounts}
        />
      </Styled.AddressGeneratedContainer>
    ) : (
      <>
        <GenerateBitcoinAddress getSidechainAccounts={getSidechainAccounts} />
        {renderBTCDepositInstruction(
          counterpart.translate(`field.labels.generate_btc_deposit_address`)
        )}
      </>
    );

  const renderEthDepositInstruction = (instruction: string) => {
    return (
      <Styled.SidechainDepositInstructionContainer>
        <Styled.SidechainIconWrapper>
          <EthereumIcon width="30" height="30" />
        </Styled.SidechainIconWrapper>
        <Styled.SidechainDepositInstruction>
          {instruction}
        </Styled.SidechainDepositInstruction>
      </Styled.SidechainDepositInstructionContainer>
    );
  };
  const ethDeposit = (
    <>
      <AddOrUpdateEthereumDepositAddress
        ethereumSidechainAccount={ethereumSidechainAccount}
        getSidechainAccounts={getSidechainAccounts}
      />
      {renderEthDepositInstruction(
        counterpart.translate(`field.labels.add_eth_deposit_address`, {
          primaryWallet: config.EthereumPrimaryWallet,
        })
      )}
    </>
  );
  const HIVEDeposit = (
    <Styled.HIVEDepositContainer>
      <HIVEAndHBDDeposit assetSymbol={selectedAsset} />
    </Styled.HIVEDepositContainer>
  );

  const loginText = useMemo(() => {
    if (selectedAsset === BITCOIN_ASSET_SYMBOL) {
      return counterpart.translate(
        `buttons.login_and_generate_bitcoin_address`
      );
    } else if (selectedAsset === ETHEREUM_ASSET_SYMBOL) {
      return counterpart.translate(`buttons.login_and_deposit_ethereum`);
    } else {
      return counterpart.translate(`buttons.log_in_deposit_hbd_hive`, {
        assetSymbol: selectedAsset,
      });
    }
  }, [selectedAsset, BITCOIN_ASSET_SYMBOL, ETHEREUM_ASSET_SYMBOL]);

  const deposit = useMemo(() => {
    if (selectedAsset === BITCOIN_ASSET_SYMBOL) {
      return BTCDeposit;
    } else if (selectedAsset === ETHEREUM_ASSET_SYMBOL) {
      return ethDeposit;
    } else {
      return HIVEDeposit;
    }
  }, [
    selectedAsset,
    BITCOIN_ASSET_SYMBOL,
    BTCDeposit,
    ETHEREUM_ASSET_SYMBOL,
    ethDeposit,
    HIVEDeposit,
  ]);

  const depositWithLoading = loadingSidechainAccounts ? (
    <Styled.LoadingIndicatorContainer>
      <LoadingIndicator type="three-bounce" />
    </Styled.LoadingIndicatorContainer>
  ) : (
    deposit
  );

  return (
    <Styled.DepositFormContainer>
      <Styled.LogoSelect
        assets={sidechainAssets as Asset[]}
        value={selectedAsset}
        onChange={handleAssetChange}
      />

      {!isLoggedIn ? (
        <DashboardLoginButton buttonText={loginText} />
      ) : (
        depositWithLoading
      )}
    </Styled.DepositFormContainer>
  );
};
