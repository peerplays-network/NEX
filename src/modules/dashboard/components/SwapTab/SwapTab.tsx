import { InfoCircleOutlined } from "@ant-design/icons";
import React from "react";

import { DashboardButton } from "../../../../common/components/DashboardButton/DashboardButton";
import { LogoSelectOption } from "../../../../common/components/LogoSelectOption/LogoSelectOption";
import BitcoinIcon from "../DepositTab/icons/BitcoinIcon.svg";

import * as Styled from "./SwapTab.styled";

export const SwapTab = (): JSX.Element => {
  return (
    <Styled.SwapContainer>
      <Styled.SwapForm>
        <LogoSelectOption
          balance="1.0000"
          token={<BitcoinIcon width="30px" height="30px" />}
          amountCol={true}
        />
        <LogoSelectOption
          balance="2240.02"
          token={<BitcoinIcon width="30px" height="30px" />}
          amountCol={true}
        />
        <Styled.InfoDiv>
          <Styled.InfoPara>
            1 USDT= 0.0004475 ETH
            <InfoCircleOutlined />
          </Styled.InfoPara>
        </Styled.InfoDiv>
        <DashboardButton label="Swap Coins" />
        <Styled.HistoryLinkDiv>
          <Styled.HistoryLink>See My Swap History</Styled.HistoryLink>
        </Styled.HistoryLinkDiv>
        <Styled.FooterPara>
          Your swap was completed and you received 1.001 ETH for 2240.02 USDT{" "}
          <br />
          <br />
          Transaction Type : Trade <br />
          Fees : 0.01121 PPY
        </Styled.FooterPara>
      </Styled.SwapForm>
    </Styled.SwapContainer>
  );
};