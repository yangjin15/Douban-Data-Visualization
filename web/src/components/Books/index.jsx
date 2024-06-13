import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [visible, setVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/books");
      setBooks(response.data);
    } catch (error) {
      console.error("There was an error fetching the books!", error);
    }
  };

  const showModal = (book = null) => {
    setEditingBook(book);
    form.setFieldsValue(book);
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingBook) {
        await axios.put(
          `http://localhost:5000/books/${editingBook.id}`,
          values
        );
        setBooks(
          books.map((book) =>
            book.id === editingBook.id ? { ...editingBook, ...values } : book
          )
        );
        message.success("Book updated successfully");
      } else {
        const response = await axios.post(
          "http://localhost:5000/books",
          values
        );
        setBooks([...books, response.data]);
        message.success("Book added successfully");
      }
      setVisible(false);
    } catch (error) {
      console.error("Error saving book:", error);
      message.error("Failed to save book");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
      message.success("Book deleted successfully");
    } catch (error) {
      console.error("Error deleting book:", error);
      message.error("Failed to delete book");
    }
  };

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
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>编辑</Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            style={{ marginLeft: 8 }}
          >
            删除
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: 16 }}
      >
        添加图书
      </Button>
      <Table dataSource={books} columns={columns} rowKey="id" />
      <Modal
        title={editingBook ? "编辑图书" : "添加图书"}
        visible={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
      >
        <Form form={form} layout="vertical" name="book_form">
          <Form.Item
            name="title"
            label="书名"
            rules={[{ required: true, message: "请输入书名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="link"
            label="豆瓣链接"
            rules={[{ required: true, message: "请输入豆瓣链接!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="作者"
            rules={[{ required: true, message: "请输入作者!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="translator" label="译者">
            <Input />
          </Form.Item>
          <Form.Item name="publisher" label="出版社">
            <Input />
          </Form.Item>
          <Form.Item name="publish_date" label="出版日期">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="price" label="价格">
            <Input />
          </Form.Item>
          <Form.Item name="rating" label="评分">
            <Input type="number" min={0} max={10} step={0.1} />
          </Form.Item>
          <Form.Item name="rating_count" label="评分人数">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="summary" label="一句话评价">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Books;
