import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the books!", error);
      });
  }, []);

  const columns = [
    { title: "书名", dataIndex: "title", key: "title" },
    {
      title: "豆瓣链接",
      dataIndex: "link",
      key: "link",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    { title: "作者", dataIndex: "author", key: "author" },
    { title: "译者", dataIndex: "translator", key: "translator" },
    { title: "出版社", dataIndex: "publisher", key: "publisher" },
    { title: "出版日期", dataIndex: "publish_date", key: "publish_date" },
    { title: "价格", dataIndex: "price", key: "price" },
    { title: "评分", dataIndex: "rating", key: "rating" },
    { title: "评分人数", dataIndex: "rating_count", key: "rating_count" },
    { title: "一句话评价", dataIndex: "summary", key: "summary" },
  ];

  return <Table dataSource={books} columns={columns} rowKey="id" />;
};

export default Books;
