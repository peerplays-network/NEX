import React from "react";

import * as Styled from "./LogoSelectOption.style";

type LogoSelectionProps = {
  balance: string;
  token: React.ReactNode;
  amountCol: boolean;
};

export const LogoSelectOption = ({
  balance,
  token,
  amountCol,
}: LogoSelectionProps): JSX.Element => {
  return (
    <Styled.FormContainer>
      <Styled.Row>
        <Styled.SelectOptionCol span={amountCol ? 11 : 23}>
          <Styled.SelectContainer defaultValue="1" bordered={false}>
            <Styled.SelectOptionContainer value="1">
              <Styled.OptionsDiv>
                <Styled.IconDiv>{token}</Styled.IconDiv>
                <Styled.NamePara>BTC</Styled.NamePara>
              </Styled.OptionsDiv>
            </Styled.SelectOptionContainer>
          </Styled.SelectContainer>
        </Styled.SelectOptionCol>
        {amountCol && (
          <Styled.AmountCol span={12}>
            <Styled.BalancePara>
              {balance} <br />{" "}
              <Styled.BalanceFooterPara>~$ 2,239.57</Styled.BalanceFooterPara>
            </Styled.BalancePara>
          </Styled.AmountCol>
        )}
      </Styled.Row>
    </Styled.FormContainer>
  );
};