import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import React from "react";

import { DashboardButton } from "../../../../common/components/DashboardButton/DashboardButton";
import { LogoSelectOption } from "../../../../common/components/LogoSelectOption/LogoSelectOption";

import * as Styled from "./SwapTab.styled";
import { useSwap } from "./hooks/useSwapTab";

export const SwapTab = (): JSX.Element => {
  const { visible, onCancel, onFormFinish, confirm, handleAssetChange } =
    useSwap();
  return (
    <Styled.SwapContainer>
      <Styled.SwapForm>
        <Styled.SwapItem
        // name="from"
        // validateFirst={true}
        // rules={formValdation.amount}
        // validateTrigger="onBlur"
        >
          <Input
            placeholder="0.00000"
            type="number"
            prefix={
              <Styled.SwapFormItem>
                <LogoSelectOption
                  defaultValue="BTC"
                  onChange={handleAssetChange} />
              </Styled.SwapFormItem>}
          />
        </Styled.SwapItem>
        <Styled.SwapItem
        // name="from"
        // validateFirst={true}
        // rules={formValdation.amount}
        // validateTrigger="onBlur"
        >
          <Input
            placeholder="0.00000"
            type="number"
            prefix={
              <Styled.SwapFormItem>
                <LogoSelectOption
                  defaultValue="BTC"
                  onChange={handleAssetChange} />
              </Styled.SwapFormItem>}
          />
        </Styled.SwapItem>

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
