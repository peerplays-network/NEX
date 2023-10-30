import React from "react";

import * as Styled from "./WithdrawTab.styled";
import { WithdrawForm } from "./components";

export const WithdrawTab = (): JSX.Element => {
  return (
    <Styled.WithdrawContainer>
      <WithdrawForm />
    </Styled.WithdrawContainer>
  );
};
