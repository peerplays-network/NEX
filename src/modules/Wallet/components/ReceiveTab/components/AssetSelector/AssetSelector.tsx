import counterpart from "counterpart";

import { utils } from "../../../../../../api/utils";

import * as Styled from "./AssetSelector.styled";
import { useAssetSelector } from "./hooks";

type Props = {
  assetSymbol?: string;
};

export const AssetSelector = ({ assetSymbol }: Props): JSX.Element => {
  const { allAssets, onChange } = useAssetSelector();
  return (
    <Styled.AssetSelector
      placeholder={counterpart.translate(`pages.wallet.select_to_receive`)}
      value={assetSymbol}
      onChange={onChange}
    >
      {allAssets.map((asset) => {
        return (
          <Styled.AssetOption key={asset.id} value={asset.symbol}>
            {`${asset.symbol} - ${utils.getNativeBlockchainFromAssetSymbol(
              asset.symbol
            )}`}
          </Styled.AssetOption>
        );
      })}
    </Styled.AssetSelector>
  );
};
