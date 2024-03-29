import counterpart from "counterpart";
import { Dispatch, SetStateAction, useCallback } from "react";

import { useUpdateExchanges } from "../../../../common/hooks";
import { Form, Select } from "../../../../ui/src";

import * as Styled from "./PairModal.styled";
import { usePairModal } from "./hooks";

type Props = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  currentPair: string;
};

const { Option } = Select;

export const PairModal = ({
  isVisible,
  setIsVisible,
  currentPair,
}: Props): JSX.Element => {
  const { exchanges } = useUpdateExchanges();
  const {
    pairModalForm,
    formValidation,
    allAssetsSymbols,
    handleCancel,
    handleSelectPair,
    handleSelectRecent,
    handleValuesChange,
  } = usePairModal({ setIsVisible, currentPair });
  const handleSubmit = useCallback(() => {
    pairModalForm.submit();
  }, [pairModalForm]);

  const footerButtons = [
    <Styled.PairModalFormButton
      key="submit"
      type="primary"
      onClick={handleSubmit}
    >
      {counterpart.translate(`buttons.confirm`)}
    </Styled.PairModalFormButton>,
    <Styled.PairModalFormButton
      key="back"
      onClick={handleCancel}
      className="cancel"
    >
      {counterpart.translate(`buttons.cancel`)}
    </Styled.PairModalFormButton>,
  ];

  return (
    <Styled.PairModal
      title={counterpart.translate(`pages.market.select_pair`)}
      visible={isVisible}
      centered={true}
      onOk={pairModalForm.submit}
      onCancel={handleCancel}
      footer={footerButtons}
    >
      <Styled.PairModalForm
        form={pairModalForm}
        onFinish={handleSelectPair}
        initialValues={{
          base: currentPair.split("_")[1],
          quote: currentPair.split("_")[0],
          recents: exchanges.list[1] ? exchanges.list[1] : exchanges.list[0],
        }}
        onValuesChange={handleValuesChange}
        name="pairModal"
        size="large"
        validateTrigger="onChange"
      >
        <Form.Item
          name="quote"
          validateFirst={true}
          rules={formValidation.quote}
        >
          <Select>
            {allAssetsSymbols.map((asset) => (
              <Option value={asset} key={`${asset}_quote`}>
                {asset}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="base" validateFirst={true} rules={formValidation.base}>
          <Select>
            {allAssetsSymbols.map((asset) => (
              <Option value={asset} key={`${asset}_base`}>
                {asset}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <p>{counterpart.translate(`pages.market.recent_pairs`)}</p>
        <Form.Item name="recents">
          <Select onSelect={handleSelectRecent}>
            {exchanges.list.map((pair) => (
              <Option value={pair} key={pair}>
                {pair}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Styled.PairModalForm>
    </Styled.PairModal>
  );
};
