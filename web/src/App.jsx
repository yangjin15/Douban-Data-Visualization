import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import Books from "./components/Books";
import Register from "./components/Register";
import Login from "./components/Login";
import AreaChart from "./components/AreaChart";
import ScatterPlot from "./components/ScatterPlot";
import BarPieChart from "./components/BarPieChart";
import DynamicTimelineChart from "./components/DynamicTimelineChart";

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/">Books</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/register">Register</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/login">Login</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/area-chart">Area Chart</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="/scatter-plot">Scatter Plot</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/bar-pie-chart">Bar Pie Chart</Link>
            </Menu.Item>
            <Menu.Item key="7">
              <Link to="/dynamic-timeline-chart">Dynamic Timeline Chart</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">
            <Routes>
              <Route path="/" element={<Books />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/area-chart" element={<AreaChart />} />
              <Route path="/scatter-plot" element={<ScatterPlot />} />
              <Route path="/bar-pie-chart" element={<BarPieChart />} />
              <Route
                path="/dynamic-timeline-chart"
                element={<DynamicTimelineChart />}
              />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Douban Books ©2024 Created by YourName
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
