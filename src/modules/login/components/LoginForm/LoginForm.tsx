import { CheckOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import React from "react";

import * as Styled from "./LoginForm.styled";
import { useLoginForm } from "./hooks";

const LoginForm: React.FC = () => {
  const { validUser, loginForm, onLogin, formValdation } = useLoginForm();

  return (
    <Styled.LoginForm form={loginForm} name="loginForm" onFinish={onLogin}>
      <Form.Item
        name="username"
        rules={formValdation.username}
        validateFirst={true}
        validateTrigger="onBlur"
      >
        <Input
          size="large"
          placeholder="Enter username"
          suffix={validUser ? <CheckOutlined /> : ""}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={formValdation.password}
        validateFirst={true}
        validateTrigger="onSubmit"
      >
        <Input.Password size="large" placeholder="Enter password" />
      </Form.Item>
      <Form.Item>
        <Styled.LoginFormButton type="primary" htmlType="submit">
          Log in
        </Styled.LoginFormButton>
      </Form.Item>
    </Styled.LoginForm>
  );
};

export default LoginForm;
