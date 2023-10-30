import counterpart from "counterpart";

import * as Styled from "./SubmitButton.styled";

export const SubmitButton = (): JSX.Element => {
  return (
    <Styled.WithdrawFormButton type="primary" htmlType="submit">
      {counterpart.translate(`buttons.withdraw`)}
    </Styled.WithdrawFormButton>
  );
};
