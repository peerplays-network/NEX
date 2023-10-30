import {
  DataTableDownloadLinks,
  DataTableHeader,
  DataTableHeaderBar,
  DataTabWrapper,
  styled,
  List as UiList,
  PrintTable as UiPrintTable,
  DataTable as UiTable,
} from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";
import { colors } from "../../../../ui/src/colors";

export const OrdersWrapper = styled(DataTabWrapper)``;

export const OrdersHeaderBar = styled(DataTableHeaderBar)``;

export const OrdersHeader = styled(DataTableHeader)``;

export const DownloadLinks = styled(DataTableDownloadLinks)``;

export const PrintTable = styled(UiPrintTable)``;

export const OrdersTable = styled(UiTable)`
  .sell,
  .ant-table-tbody > tr.sell.ant-table-row:hover > td,
  .ant-table-tbody > tr.sell > td.ant-table-cell-row-hover {
    background: #fff4f4;
  }
  .buy,
  .ant-table-tbody > tr.buy.ant-table-row:hover > td,
  .ant-table-tbody > tr.buy > td.ant-table-cell-row-hover {
    background: #e5fff6;
  }
  .ant-table-thead > tr > th {
    color: ${colors.textColorSecondary};
    font-weight: 300;
    border: none;
    &:not(:last-child):not(.ant-table-selection-column):not(
        .ant-table-row-expand-icon-cell
      ):not([colspan])::before {
      display: none;
    }
  }

  .ant-table-tbody > tr > td {
    border: none;
    font-weight: 500;
  }
  .ant-table {
    max-width: 100%;
  }
  .ant-table-container {
    width: 100%;
  }
  .ant-table-tbody tr {
    height: 50px;
  }
`;

export const OrderListItem = styled(UiList.Item)`
  padding: 25px 0px;
  a {
    font-style: italic;
  }
`;

export const OrderItemContent = styled.div`
  .activity-info {
    &:last-child {
      align-items: center;
      margin: 15px 0 0 0;
    }
    margin: 5px 0;
    display: flex;
    .activity-info-title {
      width: 100px;
      min-width: 100px;
      margin-right: 15px;
      font-weight: 300;
      color: ${colors.textColorSecondary};
    }
    .activity-info-value {
      word-break: break-all;
      font-weight: 500;
    }
  }
  ${breakpoint.sm} {
    margin: 18px 0 25px;
  }
`;
