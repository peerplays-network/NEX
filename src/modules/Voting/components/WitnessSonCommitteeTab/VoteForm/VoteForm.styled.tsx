import {
  Button,
  DataTableDownloadLinks,
  Form,
  styled,
  TableSearch,
  PrintTable as UiPrintTable,
} from "../../../../../ui/src";
import { breakpoint } from "../../../../../ui/src/breakpoints";
import { colors } from "../../../../../ui/src/colors";
import { Reset as UiReset } from "../../../../../ui/src/icons";

export const VoteFormWrapper = styled.div`
  padding: 0 25px;
  background-color: ${colors.white};
  ${breakpoint.md} {
    padding: 0 35px;
    background-color: unset;
    min-height: 86px;
  }
`;

export const VoteSearch = styled(TableSearch)`
  margin-bottom: 20px;
`;

export const VoteForm = styled(Form)`
  max-width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  ${breakpoint.md} {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  ${breakpoint.md} {
    justify-content: flex-start;
  }
  .ant-tooltip-disabled-compatible-wrapper {
    min-width: 85%;
    text-align: center;
    ${breakpoint.md} {
      min-width: unset;
    }
  }
`;

export const Publish = styled(Button)`
  min-width: 85%;
  font-size: 12px;
  ${breakpoint.md} {
    min-width: 185px;
    font-size: 16px;
  }
`;

export const CardFormLinkButton = styled(Button)`
  font-size: 12px;
  background: none;
  border: none;
  color: ${colors.additionalBlue};
  ${breakpoint.md} {
    font-size: 16px;
  }
`;

export const CardFormLinkButtonDisabled = styled(Button)`
  font-size: 12px;
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
  pointer-events: none;
  ${breakpoint.md} {
    font-size: 16px;
  }
`;

export const Reset = styled(UiReset)`
  color: #b9b9b9;
  margin-right: 4px;
`;

export const DownloadLinks = styled(DataTableDownloadLinks)``;

export const PrintTable = styled(UiPrintTable)``;
