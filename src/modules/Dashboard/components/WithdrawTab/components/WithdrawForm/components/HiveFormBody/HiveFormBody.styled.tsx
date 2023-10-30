import { styled } from "../../../../../../../../ui/src";
import { breakpoint } from "../../../../../../../../ui/src/breakpoints";
import { colors } from "../../../../../../../../ui/src/colors";

export const WithdrawalInstruction = styled.div`
  display: flex;
  margin-bottom: 24px;
  span {
    color: ${colors.textColorSecondary};
    font-size: 12px;
    ${breakpoint.sm} {
      font-size: 14px;
    }
  }
`;

export const IconWrapper = styled.div`
  margin-right: 16px;
`;
