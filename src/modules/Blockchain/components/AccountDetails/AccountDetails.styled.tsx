import {
  styled,
  Card as UiCard,
  StatsCardsDeck as UIStatsCardsDeck,
} from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";
import { colors } from "../../../../ui/src/colors";

export const AccountCard = styled(UiCard)`
    .ant-card-body {
      color: ${colors.textColor}
      padding: 0;
    }
  `;
export const StatsCardsDeck = styled(UIStatsCardsDeck)``;

export const LoadingContainer = styled.div`
  min-height: 58px;
  margin-left: 64px;
`;

export const AccountWrapper = styled.div`
  margin: 20px 15px;
  max-width: 800px;
`;

export const AccountNav = styled.div`
  display: flex;
  align-items: center;
  a {
    color: ${colors.textColor};
  }
`;

export const AccountNavItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 25px;
`;

export const AccountNumber = styled.h2`
  display: flex;
  justify-content: space-between;
  font-size: 1em;
  font-weight: 400;
  margin: 0;
`;

export const TwoColumns = styled.div`
  display: flex;
  flex-direction: column;
  ${breakpoint.sm} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const AccountInfoTitle = styled.h3`
  font-size: 1em;
  font-weight: 200;
  color: ${colors.textColorSecondary};
`;

export const AccountInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: normal;
  word-break: break-all;
  width: 100%;
  min-height: 120px;
  ${breakpoint.sm} {
    min-height: 88px;
  }
`;
export const AccountTime = styled.p`
  font-weight: 400;
`;
