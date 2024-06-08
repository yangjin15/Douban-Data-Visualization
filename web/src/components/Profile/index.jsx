import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const Profile = () => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user profile data when component mounts
    axios
      .get("http://localhost:5000/profile")
      .then((response) => {
        form.setFieldsValue(response.data);
        setAvatar(response.data.avatar);
      })
      .catch((error) => {
        message.error("Failed to fetch profile data");
      });
  }, [form]);

  const handleAvatarChange = (info) => {
    if (info.file.status === "done") {
      setAvatar(info.file.response.url);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/profile", {
        ...values,
        avatar,
      });
      message.success("Profile updated successfully");
    } catch (error) {
      if (
        error.response &&
        error.response.data.error === "Username already exists"
      ) {
        message.error("Username already exists");
      } else {
        message.error("Profile update failed");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>个人主页</h2>
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="bio" label="个人简介">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="上传头像">
          <Upload
            name="avatar"
            action="http://localhost:5000/upload-avatar"
            listType="picture"
            onChange={handleAvatarChange}
          >
            <Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
          {avatar && (
            <img
              src={`http://localhost:5000/${avatar}`}
              alt="avatar"
              style={{ marginTop: 10, maxWidth: "100px" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
