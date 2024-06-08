import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    axios
      .post("http://localhost:5000/login", values)
      .then((response) => {
        message.success("Login successful");
        navigate("/");
        localStorage.setItem("username", "admin");
      })
      .catch((error) => {
        message.error("Invalid username or password");
        setLoading(false);
      });
  };

  return (
    <Form
      name="login"
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 8 }}
      style={{ marginTop: "50px" }}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
