import { Card as AntdCard } from "antd";
import styled from "styled-components";

import { breakpoint } from "./breakpoints";

export const MenuCard = styled(AntdCard)`
   {
    height: 93%;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      li {
        border-bottom: 1px solid var(--border-color-base);
        padding: 0 0 10px 0;
        margin: 10px 0 0 0;
      }
    }
    .menu-item {
      display: flex;
      justify-content: space-between;
      color: var(---text-color);
    }
    .menu-icon {
      color: var(--border-color-base);
    }
    .advanced {
      border: none;
      margin: 30px 0;
      padding: 0;
      border: none;
    }
    .logout {
      position: absolute;
      bottom: 40px;
      border: none;
    }
    .link {
      margin-top: 25px;
      border: none;
    }
  }
  ${breakpoint.xs} {
    height: inherit;
    ul {
      li {
        border-bottom: none;
      }
    }
    .menu-item-arrow {
      display: none;
    }
    .advanced {
      border: none;
      margin: 10px 0 30px 0;
      padding: 0;
      border: none;
    }
    .logout {
      position: relative;
      bottom: 0;
    }
    .link {
      margin-top: 0;
    }
  }
`;
