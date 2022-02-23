import {
  Input as KeyInput,
  styled,
  Form as withdrawForm,
} from "../../../../ui/src";

export const WithdrawContainer = styled.div`
  background: var(---text-icons-ffffff) 0% 0% no-repeat padding-box;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 4px;
  opacity: 1;
  color: white;
  font-size: 20px;
  width: 600px;
  // height: 354px;
  margin: 10px;
  padding: 10px;
`;

export const WithdrawForm = styled(withdrawForm)``;

export const WithdrawLabel = styled.div`
  font: normal normal normal 14px/17px Inter;
  letter-spacing: 0px;
  color: #6c6c6c;
  opacity: 1;
  margin-left: 5%;
  margin-top: 30px;
`;

export const WithdrawFormItem = styled(withdrawForm.Item)`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
`;

export const WithdrawFormInput = styled(KeyInput)`
  height: 65px;
  color: var(---text-icons);
  text-align: left;
  font: normal normal medium 20px/24px Inter;
  letter-spacing: 0px;
  color: #212121;
  opacity: 1;
  font-size: 20px;
`;
export const WithdrawFooter = styled.p``;
