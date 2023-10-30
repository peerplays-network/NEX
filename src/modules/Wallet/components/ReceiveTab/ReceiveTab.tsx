import counterpart from "counterpart";
import { useMemo } from "react";

import { AssetsTable, AssetTitle } from "..";
import {
  BITCOIN_ASSET_SYMBOL,
  config,
  ETHEREUM_ASSET_SYMBOL,
  HBD_ASSET_SYMBOL,
  HIVE_ASSET_SYMBOL,
} from "../../../../api/params";
import {
  AddressGenerated,
  DownloadBitcoinKeys,
  HIVEAndHBDDeposit,
  LoadingIndicator,
  UserLinkExtractor,
} from "../../../../common/components";
import { useUserContext } from "../../../../common/providers";
import { Sidechain, SidechainAccount } from "../../../../common/types";
import BitcoinIcon from "../../../../ui/src/icons/Cryptocurrencies/BitcoinIcon.svg";
import EthereumIcon from "../../../../ui/src/icons/Cryptocurrencies/EthereumIcon.svg";

import * as Styled from "./ReceiveTab.styled";
import { AssetSelector } from "./components";

type Props = {
  assetSymbol?: string;
};

export const ReceiveTab = ({ assetSymbol }: Props): JSX.Element => {
  const {
    sidechainAccounts,
    loadingSidechainAccounts,
    getSidechainAccounts,
    localStorageAccount,
  } = useUserContext();
  const bitcoinSidechainAccount = useMemo(() => {
    return sidechainAccounts[Sidechain.BITCOIN];
  }, [sidechainAccounts]);
  const ethereumSidechainAccount = useMemo(() => {
    return sidechainAccounts[Sidechain.ETHEREUM];
  }, [sidechainAccounts]);

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
  const renderBtcDeposit = (bitcoinSidechainAccount?: {
    account: SidechainAccount;
    hasDepositAddress: boolean;
  }) => {
    if (bitcoinSidechainAccount && bitcoinSidechainAccount.hasDepositAddress) {
      return (
        <>
          <AddressGenerated
            label={counterpart.translate(
              `field.labels.bitcoin_deposit_address`
            )}
            sidechainAccount={bitcoinSidechainAccount.account}
          />
          {renderBTCDepositInstruction(
            counterpart.translate(`field.labels.deposit_btc`)
          )}
          <DownloadBitcoinKeys
            bitcoinSidechainAccount={bitcoinSidechainAccount.account}
            getSidechainAccounts={getSidechainAccounts}
          />
        </>
      );
    } else {
      return (
        <>
          <Styled.SidechainAddressNotAssociated>
            {counterpart.translate(`pages.wallet.no_btc_address`)}
          </Styled.SidechainAddressNotAssociated>
          <Styled.GenerateBitcoinAddress
            getSidechainAccounts={getSidechainAccounts}
          />
          {renderBTCDepositInstruction(
            counterpart.translate(`field.labels.generate_btc_deposit_address`)
          )}
        </>
      );
    }
  };

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
  const renderEthDeposit = (ethereumSidechainAccount?: {
    account: SidechainAccount;
    hasDepositAddress: boolean;
  }) => {
    return (
      <>
        {ethereumSidechainAccount &&
        ethereumSidechainAccount.hasDepositAddress ? (
          <></>
        ) : (
          <Styled.SidechainAddressNotAssociated>
            {counterpart.translate(`pages.wallet.no_eth_address`)}
          </Styled.SidechainAddressNotAssociated>
        )}

        <Styled.AddOrUpdateEthereumDepositAddress
          getSidechainAccounts={getSidechainAccounts}
          ethereumSidechainAccount={ethereumSidechainAccount}
        />
        {renderEthDepositInstruction(
          counterpart.translate(`field.labels.add_eth_deposit_address`, {
            primaryWallet: config.EthereumPrimaryWallet,
          })
        )}
      </>
    );
  };

  const renderDeposit = (asset: string) => {
    if (asset === BITCOIN_ASSET_SYMBOL) {
      return renderBtcDeposit(bitcoinSidechainAccount);
    } else if (asset === ETHEREUM_ASSET_SYMBOL) {
      return renderEthDeposit(ethereumSidechainAccount);
    } else if (asset === HIVE_ASSET_SYMBOL || asset === HBD_ASSET_SYMBOL) {
      return <HIVEAndHBDDeposit assetSymbol={asset} />;
    } else {
      return (
        <Styled.AssetTitleWrapper>
          <AssetTitle symbol={asset} showTitle={false} />
          <span>
            <UserLinkExtractor
              infoString={counterpart.translate(
                `pages.wallet.receive_selected_asset_instruction`,
                {
                  assetSymbol: asset,
                  account: `[userlink = ${localStorageAccount}]`,
                }
              )}
            />
          </span>
        </Styled.AssetTitleWrapper>
      );
    }
  };

  return (
    <Styled.ReceiveTabWrapper>
      <Styled.ReceiveInstructionWrapper>
        <Styled.Header>
          {counterpart.translate(`pages.wallet.receive_assets`)}
        </Styled.Header>
        <AssetSelector assetSymbol={assetSymbol} />
        <>
          {loadingSidechainAccounts ? (
            <LoadingIndicator type="three-bounce" />
          ) : (
            assetSymbol && renderDeposit(assetSymbol)
          )}
        </>
      </Styled.ReceiveInstructionWrapper>
      <AssetsTable
        className="no-margin"
        filterAsset={assetSymbol}
        actionType="receive_select"
        title={counterpart.translate(`pages.wallet.available_assets`)}
      />
    </Styled.ReceiveTabWrapper>
  );
};
