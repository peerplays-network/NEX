import {
  DataItemContent,
  DataTable,
  DataTableActiveIcon,
  DataTableDownloadLinks,
  DataTableHeader,
  DataTableHeaderBar,
  DataTabWrapper,
  styled,
  ListItem as UiListItem,
  PrintTable as UiPrintTable,
} from "../../../../ui/src";

export const NFTsTableWrapper = styled(DataTabWrapper)``;
export const NFTsHeaderBar = styled(DataTableHeaderBar)``;
export const NFTsHeader = styled(DataTableHeader)`
  display: flex;
  align-items: center;
`;
export const NFTLinkWrapper = styled.div`
  margin-left: 16px;
`;
export const NFTsTable = styled(DataTable)``;
export const NFTsListItem = styled(UiListItem)``;
export const NFTsItemContent = styled(DataItemContent)``;
export const DownloadLinks = styled(DataTableDownloadLinks)``;
export const PrintTable = styled(UiPrintTable)``;
export const ActiveIcon = styled(DataTableActiveIcon)``;
