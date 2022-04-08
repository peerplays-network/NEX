import { styled, Col as UiCol, Row as UiRow } from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";
import { colors } from "../../../../ui/src/colors";

export const MarketContainer = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 4px;
  color: white;
  width: 600px;
  margin: 10px;
  padding: 10px;
  text-align: center;
`;

export const Row = styled(UiRow)`
  margin-bottom: 20px;
  ${breakpoint.xs} {
    margin-left: 25px;
    margin-top: 25px;
    margin-right: auto;
  }
`;
export const Col = styled(UiCol)`
  margin: 5px;
`;
export const Heading = styled.p`
  text-align: left;
  font: normal normal normal 14px/17px Inter;
  font-size: 12px;
  margin-left: 7px;
  letter-spacing: 0px;
  color: ${colors.textColorSecondary};
  opacity: 1;
  margin-top: 30px;
  ${breakpoint.xs} {
    font-size: 14px;
    margin-left: 30px;
  }
`;
