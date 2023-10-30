import { styled } from "../../../ui/src";
import { breakpoint } from "../../../ui/src/breakpoints";
import { colors } from "../../../ui/src/colors";

export const Page = styled.section`
   {
    min-height: 100vh;
    padding: 0;
    margin: 0;
    font-weight: 300;
    color: ${colors.white};
    background: transparent
      radial-gradient(
        closest-side at 50% 50%,
        ${colors.primaryColor} 0%,
        ${colors.primaryGradiantColor} 100%
      )
      0% 0% no-repeat padding-box;
    &.dex {
      .top-bar {
        .dex-logo {
          display: block;
        }
      }
      .page-heading {
        color: ${colors.white};
        letter-spacing: 0px;
        font-size: 24px;
        font: normal normal medium 24px/29px Inter;
      }
    }
    &.peerlink {
      ${breakpoint.sm} {
        .card-layout {
          max-width: 700px;
          padding: 0;
        }
      }
    }
  }
`;

export const Layout = styled.main`
   {
    &.default {
      margin: 0;
    }
    &.card-layout,
    &.card-layout__lrg,
    &.card-layout__xlrg {
      margin: 0 5%;
      padding-bottom: 24px;
    }
    &.card-layout__lrg > .ant-card,
    &.card-layout__xlrg > .ant-card {
      min-height: 661px;
    }
    ${breakpoint.sm} {
      &.card-layout,
      &.card-layout__lrg {
        margin: 0 auto;
        padding-left: 24px;
        padding-right: 24px;
      }
      &.card-layout__xlrg {
        margin: 0 auto;
        padding-left: 16px;
        padding-right: 16px;
      }
      &.card-layout {
        max-width: 600px;
      }
      &.card-layout__lrg {
        max-width: 1070px;
      }
      &.card-layout__xlrg {
        max-width: 1912px;
      }
      &.card-layout__lrg > .ant-card {
        min-height: 856px;
      }
      &.card-layout__xlrg > .ant-card {
        min-height: 1280px;
        height: 1280px;
      }
    }
  }
`;

export const PageHeading = styled.h1`
  color: ${colors.white};
  font-size: 20px;
  font-weight: 500;
  margin: 20px 0 20px;

  ${breakpoint.sm} {
    font-size: 24px;
  }
`;
