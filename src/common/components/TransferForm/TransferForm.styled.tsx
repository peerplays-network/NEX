import { CardForm, CardFormButton, Form, Input, styled } from "../../../ui/src";
import { breakpoint } from "../../../ui/src/breakpoints";

export const TransferForm = styled(CardForm)`
  margin: 0 20px;
  ${breakpoint.sm} {
    .two-input-row {
      display: flex;
      justify-content: space-between;
      width: 710px;
      height: 70px;
      .ant-form-item {
        width: 49%;
      }
    }
    .ant-input {
      height: 100%;
      padding: 15px 30px;
    }
    .ant-form-item-control-input-content {
      height: 50px;
    }
    #transferForm_memo {
      width: 710px;
    }
  }
`;
export const TransferFormButton = styled(CardFormButton)`
  width: 100%;
  height: 100%;
`;

export const FormItem = styled(CardForm.Item)`
  width: 255px;
  margin-left: auto;
  margin-right: auto;
  .ant-form-item-control-input-content {
    height: 35px;
  }
  .ant-btn-lg {
    padding: 0px;
  }
  ${breakpoint.sm} {
    margin-left: 245px;
    width: 290px;
    .ant-form-item-control-input-content {
      height: 45px;
    }
  }
`;

export const MemoFormItem = styled(Form.Item)`
  ${breakpoint.sm} {
    .ant-form-item-control-input-content {
      height: 60px;
    }
  }
`;

export const Memo = styled(Input.TextArea)`
  resize: none;
  scroll: auto;
`;
