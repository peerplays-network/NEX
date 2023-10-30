import { CardFormButton, styled } from "../../../../../../../../ui/src";
import { breakpoint } from "../../../../../../../../ui/src/breakpoints";
import { colors } from "../../../../../../../../ui/src/colors";

export const WithdrawFormButton = styled(CardFormButton)`
  margin-bottom: 25px;
  background-color: ${colors.primaryColor};
  border-color: ${colors.primaryColor};
  ${breakpoint.sm} {
    margin-bottom: 35px;
  }
  &:hover {
    background-color: ${colors.buttonHover};
    border-color: ${colors.buttonHover};
  }
`;
