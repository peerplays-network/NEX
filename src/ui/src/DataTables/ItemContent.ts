import styled from "styled-components";

import { colors } from "../colors";

export const DataItemContent = styled.div`
  margin: 18px 0 25px;
  .item-info {
    margin: 8px 0;
    display: flex;
    .item-info-title {
      font-weight: 300;
      width: 120px;
      min-width: 120px;
      word-break: break-word;
      margin-right: 5px;
      color: ${colors.textColorSecondary};
    }
    .item-info-value {
      word-break: break-all;
      font-weight: 500;
      .ant-tag {
        padding: 5px 15px;
        background: ${colors.assetTag};
        border: none;
        color: ${colors.textColor};
      }
    }
  }
`;
