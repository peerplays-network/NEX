import {
  Col as col,
  DataItemContent,
  DataTable,
  DataTableActiveIcon,
  DataTableDownloadLinks,
  DataTableHeader,
  DataTableHeaderBar,
  DataTableMissedBlocks,
  DataTableUrlIcon,
  LikeFilled,
  LikeOutlined,
  Row as row,
  styled,
  Button as UiButton,
  List as UiList,
  ListItem as UiListItem,
  PrintTable as UiPrintTable,
} from "../../../../../ui/src";
import { breakpoint } from "../../../../../ui/src/breakpoints";
import { colors } from "../../../../../ui/src/colors";
import { Check as check, Xmark as xmark } from "../../../../../ui/src/icons";
import { mixIns } from "../../../../../ui/src/mixins";

export const LikeFilledIcon = styled(LikeFilled)`
  font-size: 16px;
  color: ${colors.approvedStatus};
`;

export const LikePartiallyFilledIcon = styled(LikeFilled)`
  font-size: 16px;
  color: ${colors.partiallyApprovedStatus};
`;

export const LikeOutlinedIcon = styled(LikeOutlined)`
  font-size: 16px;
  color: ${colors.unapprovedStatus};
`;

export const MissedBlocks = styled(DataTableMissedBlocks)``;

export const VoteTableWrapper = styled.div`
  margin: 0 25px;
  ${breakpoint.md} {
    margin: 0 35px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
`;

export const VoteTable = styled(DataTable)`
  max-width: 100%;
  .ant-table-row {
    height: 50px;
  }
`;

export const VoteList = styled(UiList)`
  padding-bottom: 25px;
  ${mixIns.hairline}
  &.ant-list-split.ant-list-something-after-last-item .ant-spin-container > .ant-list-items > .ant-list-item:last-child {
    border-bottom: none;
  }
  .ant-list-pagination {
    margin-top: 0;
  }
  .ant-pagination-item {
    border: none;
  }
  .ant-pagination.mini .ant-pagination-item,
  .ant-pagination-item-active {
    border-right: 2px solid ${colors.borderColorBase};
  }
  .ant-pagination-options {
    display: inline-block;
  }

  .ant-list-pagination {
    text-align: center;
  }

  .ant-pagination.ant-pagination-mini .ant-pagination-options {
    margin-left: 16px;
    padding-top: 4px;
    ${breakpoint.md} {
      padding-top: 0;
    }
  }
`;

export const VoteListItem = styled(UiListItem)`
  :not(:last-child) {
    border-bottom: 0.25px solid ${colors.borderColorBase} !important;
  }
`;

export const VoteItemContent = styled(DataItemContent)``;

export const VoteActionButton = styled(UiButton)`
  margin: 0px;
  border: none;
  background: none;
  boxshadow: none;
  padding: 0;
  color: ${colors.additionalBlue};
  text-align: right;
  vertical-align: middle;
  &:hover {
    background: #fafafa;
  }
`;

export const Container = styled.div`
  margin-bottom: 0px;
`;

export const Title = styled(DataTableHeader)``;

export const ColHeader = styled(col)`
  width: 25%;
  font-size: 12px;
  color: ${colors.textColorSecondary};
  margin-bottom: 10px;
`;

export const Col = styled(col)`
  width: 25%;
  font-size: 14px;
  margin-bottom: 10px;
`;

export const Row = styled(row)`
  width: 100%;
`;

export const RowMessage = styled(row)`
  width: 100%;
  font-size: 20px;
  justify-content: center;
`;

/** ICONS */
export const Check = styled(check)`
  color: #11b881;
`;

export const PartialCheck = styled(check)`
  color: ${colors.partiallyApprovedStatus};
`;

export const Xmark = styled(xmark)`
  color: #d01721;
`;

export const VoteHeaderBar = styled(DataTableHeaderBar)`
  .ant-tooltip-disabled-compatible-wrapper {
    width: 100%;
  }
`;
export const DownloadLinks = styled(DataTableDownloadLinks)``;
export const PrintTable = styled(UiPrintTable)``;
export const urlIcon = styled(DataTableUrlIcon)``;
export const ActiveIcon = styled(DataTableActiveIcon)``;

export const ApprovedStatus = styled.span`
  color: ${colors.approvedStatus};
`;

export const PartiallyApprovedStatus = styled.span`
  color: ${colors.partiallyApprovedStatus};
`;

export const NotApprovedStatus = styled.span`
  color: ${colors.unapprovedStatus};
`;

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
