import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    axios
      .post("http://localhost:5000/login", values)
      .then((response) => {
        message.success("Login successful");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", values.username);
        onLogin();
        navigate("/");
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
      <div style={{ textAlign: "center" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </Form>
  );
};

export default Login;
