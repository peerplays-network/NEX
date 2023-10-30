import { styled } from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";
import { colors } from "../../../../ui/src/colors";

export const TopBar = styled.nav`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #2e5fb7;
  padding-bottom: 13px;
  .topbar-left {
    margin: 23px 0 0 20px;
    display: flex;
    align-items: center;
    .peerplays-logo {
      display: flex;
      align-items: center;
      .logo-link {
        display: flex;
        align-items: center;
        color: ${colors.white};
        .logo {
          font-size: 10em;
          display: flex;
          color: ${colors.white};
          margin-right: 6px;
          ${breakpoint.sm} {
            margin-right: 12px;
          }
        }
        .peer {
          color: ${colors.white};
          letter-spacing: 1px;
          font-size: 1.25rem;
          margin: 0;
          .plays {
            font-weight: 200;
          }
          .link {
            font-size: 1.25rem;
            font-weight: 200;
            color: #ff903e;
            letter-spacing: 1px;
          }
        }
      }
    }
    .dex-logo {
      font-size: 1.25rem;
      font-weight: 200;
      color: #ff903e;
      letter-spacing: 1px;
      &.test {
        margin: 0 0 15px 6px;
        ${breakpoint.sm} {
          margin: 0px 0px 14px 10px;
        }
      }
      &.main {
        margin: 0px 0px 0px 6px;
        ${breakpoint.sm} {
          margin: 0 0 0 10px;
        }
      }
    }
    .network-heading {
      color: ${colors.white};
      font-size: 0.9rem;
      font-weight: 200;
      padding: 0;
      margin: 0;
    }
  }
  .topbar-right {
    margin: 23px 20px 0 0;
    display: flex;
    flex-direction: row;
  }
  ${breakpoint.sm} {
    border: none;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1;
`;
