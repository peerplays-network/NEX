import { styled, Card as UiCard } from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";

export const WalletCard = styled(UiCard)`
  .ant-card-body {
    padding: 0 0 68px 0;
  }
`;

export const AssetTabWrapper = styled.div``;

export const AssetsTableWrapper = styled.div`
  margin-bottom: 40px;
  ${breakpoint.sm} {
    margin-bottom: 60px;
  }
`;
