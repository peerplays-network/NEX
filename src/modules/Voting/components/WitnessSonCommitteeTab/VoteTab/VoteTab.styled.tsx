import { styled } from "../../../../../ui/src";
import { breakpoint } from "../../../../../ui/src/breakpoints";
import { colors } from "../../../../../ui/src/colors";

export const Container = styled.div`
  padding: 10px 0;
`;

export const VoteTabCard = styled.div``;

export const Title = styled.h2`
  margin: 0 25px;
  max-width: 100%;
  font-size: 18px;
  ${breakpoint.md} {
    font-size: 20px;
    margin: 0 35px;
    margin-bottom: 25px;
  }
  margin-bottom: 25px;
  .anticon-info-circle {
    margin: 0 15px;
    color: ${colors.warningColor};
  }
  a {
    font: normal normal normal 14px/40px Inter;
    letter-spacing: 0px;
    opacity: 1;
  }
`;
