import counterpart from "counterpart";
import { useCallback, useMemo } from "react";

import {
  BITCOIN_ASSET_SYMBOL,
  BITCOIN_NETWORK,
  defaultToken,
  ETHEREUM_ASSET_SYMBOL,
  ETHEREUM_NETWORK,
  HIVE_NETWORK,
} from "../../../../../../../api/params";

import * as Styled from "./TransactionDetails.styled";

type Props = {
  selectedAssetSymbol?: string;
  selectedBlockchain: string | undefined;
  feeAmount: number;
  btcTransferFee: number;
  ethTransferFee: number;
  precisedAmount: string;
};

export const TransactionDetails = ({
  selectedAssetSymbol,
  selectedBlockchain,
  feeAmount,
  btcTransferFee,
  ethTransferFee,
  precisedAmount,
}: Props): JSX.Element => {
  const feeLabel =
    selectedBlockchain === BITCOIN_NETWORK ||
    selectedBlockchain === ETHEREUM_NETWORK
      ? counterpart.translate(`field.labels.estimated_fees_label`)
      : counterpart.translate(`field.labels.fees_label`);

  const feeSummary: (inTotal?: boolean) => string | JSX.Element = useCallback(
    (inTotal = false) => {
      const bitcoinNetworkFeeSummary = inTotal ? (
        <>
          <div>{`+ ${feeAmount} ${defaultToken}`}</div>
          <div>+ {`${btcTransferFee} ${BITCOIN_ASSET_SYMBOL}`}</div>
        </>
      ) : (
        <>
          <div>{`${feeAmount} ${defaultToken}`}</div>
          <div>+ {`${btcTransferFee} ${BITCOIN_ASSET_SYMBOL}`}</div>
        </>
      );
      const ethereumNetworkFeeSummary = inTotal ? (
        <>
          <div>{`+ ${feeAmount} ${defaultToken}`}</div>
          <div>+ {`${ethTransferFee} ${ETHEREUM_ASSET_SYMBOL}`}</div>
        </>
      ) : (
        <>
          <div>{`${feeAmount} ${defaultToken}`}</div>
          <div>+ {`${ethTransferFee} ${ETHEREUM_ASSET_SYMBOL}`}</div>
        </>
      );

      const otherNetworksFeeSummary = inTotal
        ? `+ ${feeAmount}
          ${defaultToken}`
        : `${feeAmount}
          ${defaultToken}`;

      if (selectedBlockchain === BITCOIN_NETWORK) {
        return bitcoinNetworkFeeSummary;
      } else if (selectedBlockchain === ETHEREUM_NETWORK) {
        return ethereumNetworkFeeSummary;
      } else {
        return otherNetworksFeeSummary;
      }
    },
    [
      feeAmount,
      defaultToken,
      btcTransferFee,
      BITCOIN_ASSET_SYMBOL,
      ethTransferFee,
      ETHEREUM_ASSET_SYMBOL,
      selectedBlockchain,
      BITCOIN_NETWORK,
      ETHEREUM_NETWORK,
    ]
  );

  const totalTransaction = useMemo(() => {
    return (
      <>
        <div>{`${precisedAmount} ${
          selectedAssetSymbol !== undefined ? selectedAssetSymbol : ""
        }`}</div>
        <>{feeSummary(true)}</>
      </>
    );
  }, [precisedAmount, selectedAssetSymbol, feeSummary]);

  const sideChainConfirmationTime = useMemo(() => {
    if (selectedBlockchain === BITCOIN_NETWORK) {
      return counterpart.translate(
        `field.labels.btc_withdrawal_confirmation_time`
      );
    } else if (selectedBlockchain === ETHEREUM_NETWORK) {
      return counterpart.translate(
        `field.labels.eth_withdrawal_confirmation_time`
      );
    } else {
      return counterpart.translate(
        `field.labels.hive_withdrawal_confirmation_time`
      );
    }
  }, [selectedBlockchain, BITCOIN_NETWORK, ETHEREUM_NETWORK]);

  const confirmationTime =
    selectedBlockchain === HIVE_NETWORK ||
    selectedBlockchain === BITCOIN_NETWORK ||
    selectedBlockchain === ETHEREUM_NETWORK
      ? sideChainConfirmationTime
      : counterpart.translate(`field.labels.peerplays_confirmation_time`);

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
