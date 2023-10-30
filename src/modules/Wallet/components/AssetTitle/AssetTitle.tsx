import {
  BITCOIN_NETWORK,
  DEFAULT_NETWORK,
  HBD_ASSET_SYMBOL,
  HIVE_ASSET_SYMBOL,
} from "../../../../api/params";
import BitcoinCashIcon from "../../../../ui/src/icons/Cryptocurrencies/BitcoinCashIcon.svg";
import BitcoinIcon from "../../../../ui/src/icons/Cryptocurrencies/BitcoinIcon.svg";
import BitsharesIcon from "../../../../ui/src/icons/Cryptocurrencies/BitsharesIcon.svg";
import DefaultIcon from "../../../../ui/src/icons/Cryptocurrencies/DefaultIcon.svg";
import EOSIcon from "../../../../ui/src/icons/Cryptocurrencies/EOSIcon.svg";
import EthereumIcon from "../../../../ui/src/icons/Cryptocurrencies/EthereumIcon.svg";
import HIVEIcon from "../../../../ui/src/icons/Cryptocurrencies/HIVEIcon.svg";
import PPYIcon from "../../../../ui/src/icons/Cryptocurrencies/PPYIcon.svg";
import TetherIcon from "../../../../ui/src/icons/Cryptocurrencies/TetherIcon.svg";
import USDIcon from "../../../../ui/src/icons/Cryptocurrencies/USDIcon.svg";

import * as Styled from "./AssetTitle.styled";

type Props = {
  symbol: string;
  showTitle?: boolean;
};

export const AssetTitle = ({
  symbol,
  showTitle = true,
}: Props): JSX.Element => {
  const icons: {
    [symbol: string]: JSX.Element;
  } = {
    EOS: <EOSIcon height="30" width="30" />,
    PEOS: <EOSIcon height="30" width="30" />,
    PBTC: <BitcoinIcon height="30" width="30" />,
    BTC: <BitcoinIcon height="30" width="30" />,
    TEST: <PPYIcon height="30" width="30" />,
    PPY: <PPYIcon height="30" width="30" />,
    HIVE: <HIVEIcon height="30" width="30" />,
    HBD: <HIVEIcon height="30" width="30" />,
    PETH: <EthereumIcon height="30" width="30" />,
    ETH: <EthereumIcon height="30" width="30" />,
    BTS: <BitsharesIcon height="30" width="30" />,
    USDT: <TetherIcon height="30" width="30" />,
    Default: <DefaultIcon height="30" width="30" />,
    USD: <USDIcon height="30" width="30" />,
    BCH: <BitcoinCashIcon height="30" width="30" />,
  };
  const AssetNames: {
    [symbol: string]: string;
  } = {
    BTC: BITCOIN_NETWORK,
    TEST: DEFAULT_NETWORK,
    PPY: DEFAULT_NETWORK,
    HIVE: HIVE_ASSET_SYMBOL,
    HBD: HBD_ASSET_SYMBOL,
  };

  return (
    <Styled.AssetTitle
      avatar={icons[symbol] !== undefined ? icons[symbol] : icons["Default"]}
      title={
        showTitle ? (
          <>
            {AssetNames[symbol]} <span className="asset-symbol">{symbol}</span>
          </>
        ) : (
          ""
        )
      }
    />
  );
};
