import { styled, Card as UiCard } from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";

export const UserCard = styled(UiCard)`
  .ant-card-body {
    padding: 0;
  }
  ${breakpoint.sm} {
    .ant-card-body {
      padding-left: 35px;
      padding-right: 35px;
      padding-top: 20px;
    }
  }
`;

export const UserHeading = styled.h2`
  margin: 0 15px;
  ${breakpoint.sm} {
    margin: 0 25px;
  }
`;
