import counterpart from "counterpart";
import { useMemo } from "react";

import {
  BITCOIN_ASSET_SYMBOL,
  defaultToken,
  ETHEREUM_ASSET_SYMBOL,
} from "../../../../../../../../api/params";

import * as Styled from "./TransactionDetails.styled";

type Props = {
  selectedAssetSymbol: string;
  withdrawFee: number;
  btcTransferFee?: number;
  ethTransferFee?: number;
  precisedAmount: string;
};

export const TransactionDetails = ({
  selectedAssetSymbol,
  withdrawFee,
  btcTransferFee,
  ethTransferFee,
  precisedAmount,
}: Props): JSX.Element => {
  const feeLabel = useMemo(() => {
    if (
      selectedAssetSymbol === BITCOIN_ASSET_SYMBOL ||
      selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL
    ) {
      return counterpart.translate(`field.labels.estimated_fees_label`);
    } else {
      return counterpart.translate(`field.labels.fees_label`);
    }
  }, [selectedAssetSymbol, BITCOIN_ASSET_SYMBOL, ETHEREUM_ASSET_SYMBOL]);

  const feeSummary: (inTotal?: boolean) => string | JSX.Element = (
    inTotal = false
  ) => {
    const BtcFeeSummary = inTotal ? (
      <>
        <div>{`+ ${withdrawFee} ${defaultToken}`}</div>
        <div>+ {`${btcTransferFee} BTC`}</div>
      </>
    ) : (
      <>
        <div>{`${withdrawFee} ${defaultToken}`}</div>
        <div>+ {`${btcTransferFee} BTC`}</div>
      </>
    );
    const EthFeeSummary = inTotal ? (
      <>
        <div>{`+ ${withdrawFee} ${defaultToken}`}</div>
        <div>+ {`${ethTransferFee} ETH`}</div>
      </>
    ) : (
      <>
        <div>{`${withdrawFee} ${defaultToken}`}</div>
        <div>+ {`${ethTransferFee} ETH`}</div>
      </>
    );
    const HiveFeeSummary = inTotal
      ? `+ ${withdrawFee}
    ${defaultToken}`
      : `${withdrawFee}
    ${defaultToken}`;

    if (selectedAssetSymbol === BITCOIN_ASSET_SYMBOL) {
      return BtcFeeSummary;
    } else if (selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL) {
      return EthFeeSummary;
    } else {
      return HiveFeeSummary;
    }
  };
  const totalTransaction = (
    <>
      <div>{`${precisedAmount} ${selectedAssetSymbol}`}</div>
      <>{feeSummary(true)}</>
    </>
  );
  const confirmationTime = useMemo(() => {
    if (selectedAssetSymbol === BITCOIN_ASSET_SYMBOL) {
      return counterpart.translate(
        `field.labels.btc_withdrawal_confirmation_time`
      );
    } else if (selectedAssetSymbol === ETHEREUM_ASSET_SYMBOL) {
      return counterpart.translate(
        `field.labels.eth_withdrawal_confirmation_time`
      );
    } else {
      return counterpart.translate(
        `field.labels.hive_withdrawal_confirmation_time`
      );
    }
  }, [selectedAssetSymbol, BITCOIN_ASSET_SYMBOL, ETHEREUM_ASSET_SYMBOL]);

  return (
    <Styled.TransactionDetails>
      <Styled.DetailsWrapper>
        <Styled.DetailsLabelWrapper>{feeLabel}</Styled.DetailsLabelWrapper>
        <Styled.AmountsWrapper>{feeSummary()}</Styled.AmountsWrapper>
      </Styled.DetailsWrapper>
      <Styled.DetailsWrapper>
        <Styled.DetailsLabelWrapper>
          {counterpart.translate(`field.labels.total_transaction`)}
        </Styled.DetailsLabelWrapper>
        <Styled.AmountsWrapper>{totalTransaction}</Styled.AmountsWrapper>
      </Styled.DetailsWrapper>
      <Styled.DetailsWrapper>
        <Styled.DetailsLabelWrapper>
          {counterpart.translate(`field.labels.withdrawal_confirmation_time`)}
        </Styled.DetailsLabelWrapper>
        <Styled.AmountsWrapper>{confirmationTime}</Styled.AmountsWrapper>
      </Styled.DetailsWrapper>
    </Styled.TransactionDetails>
  );
};
