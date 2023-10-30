import { Input, styled } from "../../../ui/src";
import { breakpoint } from "../../../ui/src/breakpoints";
import { colors } from "../../../ui/src/colors";
import { mixIns } from "../../../ui/src/mixins";

export const GeneratedAddressLabel = styled.div`
  margin-bottom: 20px;
  color: ${colors.textColorSecondary};
  font-size: 12px;
  ${breakpoint.sm} {
    font-size: 14px;
  }
`;

export const GeneratedAddress = styled(Input)`
  height: 50px;
  background: ${colors.white} 0% 0% no-repeat padding-box;
  border: 1px solid ${colors.borderColorBase};
  ${mixIns.borderRadius}
  padding: 10px;
  margin-bottom: 35px;
  ${breakpoint.sm} {
    width: 100%;
  }
  .ant-input.ant-input-disabled.ant-input-sm {
    color: ${colors.textColor};
  }
`;
