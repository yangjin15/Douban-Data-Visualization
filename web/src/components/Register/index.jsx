import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    axios
      .post("http://localhost:5000/register", values)
      .then((response) => {
        message.success("User registered successfully");
        navigate("/login");
      })
      .catch((error) => {
        message.error("Registration failed");
        setLoading(false);
      });
  };

  return (
    <Form
      name="register"
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
          Register
        </Button>
      </Form.Item>
      <div style={{ textAlign: "center" }}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </Form>
  );
};

export default Register;
