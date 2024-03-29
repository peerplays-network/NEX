import {
  CardForm,
  CardFormButton,
  styled,
  Checkbox as UICheckbox,
  Input as UIInput,
} from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";

export const UsernameFormItem = styled(CardForm.Item)`
  margin-bottom: 15px;
  ${breakpoint.sm} {
    margin-bottom: 24px;
  }
`;
export const Label = styled.p`
  margin-bottom: 15px;
  ${breakpoint.sm} {
    margin-bottom: 24px;
  }
`;
export const GeneratedPassordInput = styled(UIInput)`
  .ant-input-password-icon {
    color: #b9b9b9;
    display: flex;
    justify-content: space-between;
    width: 38px;
  }
  .anticon {
    color: #b9b9b9;
    margin-right: 10px;
    ${breakpoint.sm} {
      margin-right: 15px;
    }
  }
`;

export const PasswordFormItem = styled(CardForm.Item)`
  margin-bottom: 15px;
  ${breakpoint.sm} {
    margin-bottom: 20px;
  }
`;

export const PasswordCheckFormItem = styled(CardForm.Item)`
  margin-bottom: 23px;
  ${breakpoint.sm} {
    margin-bottom: 35px;
  }
`;
export const ConfirmFormItem = styled(CardForm.Item)`
  margin-bottom: 12px;
`;

export const SavedFormItem = styled(CardForm.Item)`
  margin-bottom: 35px;
`;

export const Checkbox = styled(UICheckbox)`
  align-items: flex-start;
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
    &::after {
      left: 25%;
    }
  }
  .checkbox-text {
    margin-bottom: 0;
  }
  ${breakpoint.sm} {
    align-items: flex-start;
  }

  .ant-checkbox + span {
    font-size: 14px;
    ${breakpoint.sm} {
      font-size: 16px;
    }
  }
`;

export const SignupForm = styled(CardForm)`
  .ant-input,
  .ant-input-affix-wrapper {
    height: 100%;
    ${breakpoint.sm} {
      padding-left: 30px;
    }
  }
  .ant-form-item-control-input-content {
    height: 40px;
    ${breakpoint.sm} {
      height: 50px;
    }
  }
  .ant-form-large .ant-form-item-control-input {
    width: 539px;
  }
  .checkbox-item {
    .ant-form-item-control-input-content {
      height: 80%;
    }
  }

  .ant-row.ant-form-item.ant-form-item-with-help.checkbox-item.ant-form-item-has-error {
    height: 50px;
  }
`;
export const SignupFormButton = styled(CardFormButton)`
  margin-bottom: 35px;
  width: 255px;
  height: 35px;
  ${breakpoint.sm} {
    width: 400px;
    height: 45px;
  }
`;

export const FormItem = styled(CardForm.Item)``;
