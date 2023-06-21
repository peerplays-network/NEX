import {
  DataItemContent,
  DataTable,
  DataTableDownloadLinks,
  DataTableHeader,
  DataTableHeaderBar,
  DataTabWrapper,
  styled,
  ListItem as UiListItem,
  PrintTable as UiPrintTable,
  StatsCardsDeck as UIStatsCardsDeck,
} from "../../../../ui/src";
import { colors } from "../../../../ui/src/colors";

export const AccountsTabWrapper = styled(DataTabWrapper)``;

export const StatsCardsDeck = styled(UIStatsCardsDeck)``;

export const AccountsHeaderBar = styled(DataTableHeaderBar)``;

export const AccountsHeader = styled(DataTableHeader)``;

export const AccountsTable = styled(DataTable)`
  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
  .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
  .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    cursor: pointer;
  }
`;

export const AccountsListItem = styled(UiListItem)`
  :not(:last-child) {
    border-bottom: 0.25px solid ${colors.borderColorBase} !important;
  }
`;

export const AccountsItemContent = styled(DataItemContent)``;

export const DownloadLinks = styled(DataTableDownloadLinks)``;

export const PrintTable = styled(UiPrintTable)``;
