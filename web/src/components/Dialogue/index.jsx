import React, { useState } from "react";
import { ProChat } from "@ant-design/pro-chat";

const Dialogue = () => {
  const [messages, setMessages] = useState([]);

  const handleRequest = async (newMessages) => {
    const memory = newMessages
      .map((message) => {
        if (message.role === "user") {
          return `HumanMessage:${message.content}\n\n`;
        } else if (message.role === "assistant") {
          return `AiMessage:${message.content}\n\n`;
        }
        return "";
      })
      .join("");

    const Interviewee_message =
      newMessages.length > 0 ? newMessages[newMessages.length - 1].content : "";

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Interviewee_message: Interviewee_message,
          memory: memory,
        }),
      });

      if (!response.ok) {
        console.error("Response error:", response.status);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let aiMessage = "";

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          aiMessage += decoder.decode(value, { stream: true });
          setMessages([
            ...newMessages,
            { role: "assistant", content: aiMessage },
          ]);
        }
      }

      return aiMessage;
    } catch (error) {
      console.error("Request failed", error);
      return;
    }
  };

  return <ProChat request={handleRequest} />;
};

export default Dialogue;
