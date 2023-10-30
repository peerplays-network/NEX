import {
  Col,
  DataItemContent,
  DataTable,
  DataTableActiveIcon,
  DataTableDownloadLinks,
  DataTableHeader,
  DataTableHeaderBar,
  DataTableLastBlock,
  DataTableMissedBlocks,
  DataTableUrlIcon,
  DataTabWrapper,
  Row,
  styled,
  ListItem as UiListItem,
  PrintTable as UiPrintTable,
  StatsCardsDeck as UIStatsCardsDeck,
} from "../../../../ui/src";
import { colors } from "../../../../ui/src/colors";

export const SonsTabWrapper = styled(DataTabWrapper)``;

export const StatsCardsDeck = styled(UIStatsCardsDeck)``;

export const SonsHeaderBar = styled(DataTableHeaderBar)``;

export const SonsHeader = styled(DataTableHeader)``;

export const DownloadLinks = styled(DataTableDownloadLinks)``;

export const SonsTable = styled(DataTable)``;

export const SonListItem = styled(UiListItem)`
  :not(:last-child) {
    border-bottom: 0.25px solid ${colors.borderColorBase} !important;
  }
`;

export const SonItemContent = styled(DataItemContent)``;

export const PrintTable = styled(UiPrintTable)``;

export const LastBlock = styled(DataTableLastBlock)``;
export const MissedBlocks = styled(DataTableMissedBlocks)``;
export const urlIcon = styled(DataTableUrlIcon)``;
export const ActiveIcon = styled(DataTableActiveIcon)``;

export const ExpandableContainer = styled.div`
  margin-left: 40px;
`;
export const SidechainRow = styled(Row)`
  margin-bottom: 8px;
`;
export const SidechainCol = styled(Col)``;
export const ExpandableHeader = styled.div`
  font-size: 12px;
  color: ${colors.textColorSecondary};
`;

export const ItemHeader = styled.div`
  font-weight: 300;
  width: 120px;
  min-width: 120px;
  word-break: break-word;
  margin-right: 5px;
  color: #6c6c6c;
`;
export const IndentedListItem = styled.div`
  margin-left: 24px;
`;
