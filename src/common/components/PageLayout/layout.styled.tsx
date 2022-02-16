import { styled } from "../../../ui/src";
import { breakpoint } from "../../../ui/src/breakpoints";
import { colors } from "../../../ui/src/colors";

export const Layout = styled.main`
  &.default {
    margin: 0;
  }
  &.card-layout {
    margin: 0 5%;
  }
  ${breakpoint.sm} {
    &.card-layout {
      margin: 0 auto;
      max-width: 600px;
    }
    &.card-layout__lrg {
      margin: 0 auto;
      max-width: 1070px;
    }
  }
`;

export const PageHeading = styled.h1`
   {
    color: ${colors.white};
    font-size: 1.5em;
    font-weight: 300;
    margin: 7% 0 5%;
  }
`;