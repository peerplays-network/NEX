import { LogoSelectOption } from "../../../../common/components";
import { styled } from "../../../../ui/src";
import { breakpoint } from "../../../../ui/src/breakpoints";
import { colors } from "../../../../ui/src/colors";
import { mixIns } from "../../../../ui/src/mixins";

export const DepositFormContainer = styled.div`
  background: ${colors.white} 0% 0% no-repeat padding-box;
  ${mixIns.borderRadius}
  font-size: 25px;
  width: 600px;
  padding: 25px 20px 0 20px;
  margin: 10px;
  min-height: 190px;
  ${breakpoint.sm} {
    padding: 35px 30px 0 30px;
    min-height: 215px;
  }
  .ant-form {
    margin: 0 auto;
    .ant-input {
      height: 50px;
      ${breakpoint.sm} {
        height: 65px;
      }
    }
  }
`;

export const LogoSelect = styled(LogoSelectOption)`
  height: 50px;
  background: ${colors.white} 0% 0% no-repeat padding-box;
  border: 1px solid ${colors.borderColorBase};
  ${mixIns.borderRadius}
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  ${breakpoint.sm} {
    height: 65px;
    margin-bottom: 35px;
  }
`;

export const AddressGeneratedContainer = styled.div``;

export const HIVEDepositContainer = styled.div``;

export const SidechainDepositInstructionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  ${breakpoint.sm} {
    margin-bottom: 35px;
  }
`;

export const SidechainIconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

export const SidechainDepositInstruction = styled.div`
  color: ${colors.textColor};
  font-size: 12px;
  ${breakpoint.sm} {
    font-size: 14px;
  }
`;

export const LoadingIndicatorContainer = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
`;
