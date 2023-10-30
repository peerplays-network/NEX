import { CopyButton as UiCopyButton } from "../../../../common/components";
import {
  CardFormButton,
  styled,
  Text,
  Checkbox as UiCheckbox,
  Form as UiForm,
  Option as UiOption,
  Select as UiSelect,
  Space as UiSpace,
  Typography as UiTypography,
} from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";
import { colors } from "../../../../ui/src/colors";
import { mixIns } from "../../../../ui/src/mixins";

export const GeneralSettingsCard = styled.div`
  .ant-form-horizontal {
    text-align: left;
    letter-spacing: 0px;
    color: ${colors.textColor};
    margin: 20px;
    ${breakpoint.sm} {
      margin-left: 30px;
    }
  }
`;

export const GeneralTabForm = styled(UiForm)`
  margin-top: 24px;
`;

export const GeneralSettingFormItem = styled(UiForm.Item)`
  width: 100%;
  margin-top: 15px;
  background: ${colors.white} 0% 0% no-repeat padding-box;
  border: 1px solid ${colors.borderColorBase};
  ${mixIns.borderRadius}
  opacity: 1;
  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    width: 100%;
    height: 40px;
    padding: 0 11px;
    align-items: center;
    ${breakpoint.sm} {
      height: 50px;
    }
  }
  ${breakpoint.sm} {
    width: 350px;
  }
`;
export const LabelText = styled(Text)`
  font-weight: 400;
  .anticon-info-circle {
    margin: 0 15px;
    color: ${colors.warningColor};
  }
`;
export const Select = styled(UiSelect)``;

export const FormItem = styled(UiForm.Item)`
  margin-top: 15px;
  margin-bottom: 5px;
`;

export const FaucetURLWrapper = styled.div`
  ${breakpoint.sm} {
    display: flex;
    align-items: center;
  }
`;

export const FaucetURL = styled.div`
  color: ${colors.textColor};
  margin-bottom: 20px;
  word-break: break-word;
  ${breakpoint.sm} {
    margin-bottom: 0;
  }
`;

export const FaucetSpace = styled.div`
  margin-top: 48px;
  .ant-row {
    align-items: center;
  }
  ${breakpoint.sm} {
    margin-top: 96px;
  }
`;

export const SaveButton = styled(CardFormButton)`
  margin: 0;
  margin-top: 30px;
  width: 100%;
  ${breakpoint.sm} {
    width: 350px;
  }
`;

export const CopyButton = styled(UiCopyButton)`
  margin-left: 0;
  ${breakpoint.sm} {
    margin-left: 15px;
  }
`;

export const TransferCheckbox = styled(UiCheckbox)``;

export const Checkbox = styled(UiCheckbox)``;

export const Option = styled(UiOption)``;

export const Space = styled(UiSpace)``;

export const Typography = styled(UiTypography)``;

export const CheckBoxGroup = styled(UiForm.Item)`
  .ant-checkbox-group {
    display: inline;
  }
  .ant-checkbox-wrapper {
    width: 45%;
    margin-bottom: 8px;
    margin-top: 8px;
  }
  .ant-checkbox + span {
    font-size: 14px;
  }
  ${breakpoint.sm} {
    .ant-form-item-control-input-content {
      min-width: 120%;
    }
  }
`;

export const TextContainer = styled.div`
  min-height: 22px;
  font-size: 14px;
  .anticon-info-circle {
    margin: 0 15px 0 0;
    color: ${colors.warningColor};
  }
  ${breakpoint.sm} {
    .anticon-info-circle {
      margin: 0 15px;
      color: ${colors.warningColor};
    }
  }
`;
