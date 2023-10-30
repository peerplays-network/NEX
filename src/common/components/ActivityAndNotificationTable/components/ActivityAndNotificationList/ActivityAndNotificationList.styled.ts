import { Button, styled, List as UiList } from "../../../../../ui/src";
import { breakpoint } from "../../../../../ui/src/breakpoints";
import { colors } from "../../../../../ui/src/colors";

export const StyledList = styled(UiList)`
  .ant-list-pagination {
    margin-top: 16px;
    margin-right: 25px;
  }
  .ant-pagination-item {
    border: none;
  }
  .ant-pagination.mini .ant-pagination-item,
  .ant-pagination-item-active {
    border-right: 2px solid ${colors.borderColorBase};
  }
`;

export const ActivityListItem = styled(UiList.Item)`
  padding: 25px 0px;
  a {
    font-style: italic;
  }
`;

export const ActivityItemContent = styled.div`
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

export const NotificationTableStatusButton = styled(Button)`
  margin: 0px;
  border: none;
  background: none;
  box-shadow: none;
  padding: 0;
  color: ${colors.primaryColor};
  text-align: right;
  vertical-align: middle;
  &:hover {
    background: #fafafa;
  }
`;
