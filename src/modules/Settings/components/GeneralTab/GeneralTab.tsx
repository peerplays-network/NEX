import counterpart from "counterpart";

import { defaultLocales, FAUCET_URL } from "../../../../api/params";
import { Checkbox, Col, InfoCircleOutlined, Row } from "../../../../ui/src";
import { useSettings } from "../../hooks";

import * as Styled from "./GeneralTab.styled";

export const GeneralTab = (): JSX.Element => {
  const {
    updateSettings,
    generalSettingsForm,
    handleAllowNotifications,
    showSuccessMessage,
    handleValuesChange,
    isSettingChanged,
    settings,
    allowNotification,
  } = useSettings();

  const walletLockInMinutes = ["0", "30", "60", "90", "180", "210"];
  const notificationOptions = [
    {
      label: counterpart.translate(`transaction.trxTypes.transfer.title`),
      value: "transfer",
    },
    {
      label: counterpart.translate(
        `transaction.trxTypes.limit_order_create.title`
      ),
      value: "limit_order_create",
    },
    {
      label: counterpart.translate(`transaction.trxTypes.fill_order.title`),
      value: "fill_order",
    },
    {
      label: counterpart.translate(
        `transaction.trxTypes.limit_order_cancel.title`
      ),
      value: "limit_order_cancel",
    },
    {
      label: counterpart.translate(`transaction.trxTypes.account_update.title`),
      value: "account_update",
    },
    {
      label: counterpart.translate(
        `transaction.trxTypes.account_upgrade.title`
      ),
      value: "account_upgrade",
    },
    {
      label: counterpart.translate(
        `transaction.trxTypes.vesting_balance_create.title`
      ),
      value: "vesting_balance_create",
    },
    {
      label: counterpart.translate(
        `transaction.trxTypes.vesting_balance_withdraw.title`
      ),
      value: "vesting_balance_withdraw",
    },
  ];

  return (
    <Styled.GeneralSettingsCard>
      <Styled.GeneralTabForm
        form={generalSettingsForm}
        name="generalSettingsForm"
        onFinish={updateSettings}
        initialValues={{
          walletLockInMinutes: settings.walletLock,
          selectedLanguage: settings.language,
          allowNotifications: settings.notifications.allow,
          selectedNotifications: settings.notifications.selectedNotifications,
        }}
        onValuesChange={handleValuesChange}
      >
        <Row>
          <Col span={{ xs: 24, sm: 24, lg: 9 }}>
            <Styled.LabelText>
              {counterpart.translate(`field.labels.select_language`)}
            </Styled.LabelText>
            <Styled.GeneralSettingFormItem name="selectedLanguage">
              <Styled.Select>
                {defaultLocales.map((e) => (
                  <Styled.Option key={e.type} value={e.type}>
                    {e.title}
                  </Styled.Option>
                ))}
              </Styled.Select>
            </Styled.GeneralSettingFormItem>

            {/* <Styled.LabelText>
              {counterpart.translate(`field.labels.ui_design`)}
            </Styled.LabelText>
            <Styled.GeneralSettingFormItem name="darkTheme">
              <Styled.Select>
                <Styled.Option value={true}>Dark mode</Styled.Option>
                <Styled.Option value={false}>Light mode</Styled.Option>
              </Styled.Select>
            </Styled.GeneralSettingFormItem>

            <Styled.LabelText>
              {counterpart.translate(
                `field.labels.allow_transfer_to_my_account`
              )}
              <InfoCircleOutlined />
            </Styled.LabelText>
            <Styled.GeneralSettingFormItem name="allowTransferToMeNotifications">
              <Styled.Select>
                <Styled.Option value={true}>Yes</Styled.Option>
                <Styled.Option value={false}>No</Styled.Option>
              </Styled.Select>
            </Styled.GeneralSettingFormItem> */}

            <Styled.LabelText>
              {counterpart.translate(`field.labels.lock_wallet`)}
              <InfoCircleOutlined />
            </Styled.LabelText>
            <Styled.GeneralSettingFormItem name="walletLockInMinutes">
              <Styled.Select>
                {walletLockInMinutes.map((e) => (
                  <Styled.Option value={e} key={e}>
                    {e} {counterpart.translate(`field.options.lock_wallet`)}
                  </Styled.Option>
                ))}
              </Styled.Select>
            </Styled.GeneralSettingFormItem>
          </Col>
          <Col span={{ xs: 24, sm: 24, lg: 9 }}>
            <Styled.LabelText>
              {counterpart.translate(`field.labels.show_notifications`)}
            </Styled.LabelText>
            <Styled.GeneralSettingFormItem name="allowNotifications">
              <Styled.Select onChange={handleAllowNotifications}>
                <Styled.Option value={true}>
                  {counterpart.translate(`general.yes`)}
                </Styled.Option>
                <Styled.Option value={false}>
                  {counterpart.translate(`general.no`)}
                </Styled.Option>
              </Styled.Select>
            </Styled.GeneralSettingFormItem>

            <Styled.LabelText>
              {counterpart.translate(`field.labels.select_notifications`)}
              <InfoCircleOutlined />
            </Styled.LabelText>

            <Styled.CheckBoxGroup
              name="selectedNotifications"
              validateTrigger="onChange"
            >
              <Checkbox.Group
                disabled={!allowNotification}
                options={notificationOptions}
              ></Checkbox.Group>
            </Styled.CheckBoxGroup>
          </Col>
        </Row>
        <Styled.TextContainer>
          {isSettingChanged && (
            <Styled.LabelText>
              <InfoCircleOutlined />
              {counterpart.translate(`field.labels.unsaved_changes`)}
            </Styled.LabelText>
          )}
        </Styled.TextContainer>
        <Styled.SaveButton
          type="primary"
          htmlType="submit"
          disabled={!isSettingChanged}
        >
          {counterpart.translate(`buttons.save`)}
        </Styled.SaveButton>
        <Styled.FaucetSpace>
          <Styled.LabelText>
            {counterpart.translate(`field.labels.faucet`)}
            <InfoCircleOutlined />
          </Styled.LabelText>
          <Styled.FaucetURLWrapper>
            <Styled.FaucetURL>{`${counterpart.translate(
              `field.labels.faucet_url`
            )} ${FAUCET_URL}`}</Styled.FaucetURL>
            <Styled.CopyButton
              buttonText={counterpart.translate(`field.labels.copy_url`)}
              copyValue={`${FAUCET_URL as string}`}
            ></Styled.CopyButton>
          </Styled.FaucetURLWrapper>
          {showSuccessMessage && (
            <Styled.LabelText type="success">
              {counterpart.translate(`field.labels.setting_saved`)}
            </Styled.LabelText>
          )}
        </Styled.FaucetSpace>
      </Styled.GeneralTabForm>
    </Styled.GeneralSettingsCard>
  );
};
