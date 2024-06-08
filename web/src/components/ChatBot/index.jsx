import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { ProForm, ProFormTextArea } from "@ant-design/pro-form";
import { MessageOutlined } from "@ant-design/icons";

const ChatBot = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          zIndex: 1000,
        }}
        onClick={showDrawer}
      />
      <Drawer
        title="Chat Bot"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <ProForm
          onFinish={async (values) => {
            console.log(values);
            // Here you would handle the message submission to your chat bot
          }}
        >
          <ProFormTextArea
            name="message"
            label="Message"
            placeholder="Type your message here..."
            rules={[{ required: true, message: "Please enter your message" }]}
          />
        </ProForm>
      </Drawer>
    </div>
  );
};

export default ChatBot;
