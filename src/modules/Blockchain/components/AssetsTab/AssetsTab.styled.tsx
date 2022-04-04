import {
  Input,
  styled,
  StatsCardsDeck as UIStatsCardsDeck,
  Table as UiTable,
} from "../../../../ui/src";
import { colors } from "../../../../ui/src/colors";

const { Search } = Input;

export const AssetsTabWrapper = styled.div`
  margin: 0 25px;
`;

export const StatsCardsDeck = styled(UIStatsCardsDeck)``;

export const AssetsSearch = styled(Search)`
  max-width: 520px;
  margin-bottom: 35px;
  .ant-input {
    border-radius: 4px;
  }
  > .ant-input-group
    > .ant-input-group-addon:last-child
    .ant-input-search-button {
    border-radius: 0 4px 4px 0;
    border-left: none;
  }
`;

export const AssetsTable = styled(UiTable)`
  .ant-table-thead > tr > th {
    color: ${colors.textColorSecondary};
    background: ${colors.white};
    border: none;
    font-size: 0.9em;
    font-weight: 300;
    &:before {
      display: none;
    }
  }
  .ant-table-tbody > tr > td {
    border: none;
  }
  .ant-tag {
    padding: 5px 15px;
    background: ${colors.assetTag};
    border: none;
    color: ${colors.textColor};
  }
`;