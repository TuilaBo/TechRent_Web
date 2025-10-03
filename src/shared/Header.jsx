import React from "react";
import {
  Layout,
  Row,
  Col,
  Input,
  Space,
  Badge,
  Dropdown,
  Avatar,
  Menu,
  Button,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Header } = Layout;

const navItems = [
  { key: "home", label: "Trang chủ", link: "/" },
  { key: "products", label: "Sản phẩm", link: "/products" },
  { key: "categories", label: "Danh mục", link: "/categories" },
  { key: "about", label: "Giới thiệu", link: "/about" },
  { key: "support", label: "Hỗ trợ", link: "/support" },
];

export default function AppHeader() {
  const userMenu = (
    <Menu
      items={[
        { key: "1", label: <a href="/profile">Tài khoản</a> },
        { key: "2", label: <a href="/orders">Đơn thuê</a> },
        { key: "3", label: <a href="/logout">Đăng xuất</a> },
      ]}
    />
  );

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(6px)",
        padding: "0 24px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Row align="middle" justify="space-between">
        {/* Logo */}
        <Col>
          <a
            href="/"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: 0.5,
            }}
          >
            TechRent
          </a>
        </Col>

        {/* Menu desktop */}
        <Col flex="auto" className="hidden md:block">
          <Space size="large" style={{ marginLeft: 40 }}>
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.link}
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </a>
            ))}
          </Space>
        </Col>

        {/* Search + User + Cart */}
        <Col>
          <Space size="large">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined />}
              style={{
                borderRadius: 30,
                width: 220,
              }}
            />
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Avatar
                style={{ backgroundColor: "#1677ff", cursor: "pointer" }}
                icon={<UserOutlined />}
              />
            </Dropdown>
            <Link to="/cart" style={{ display: "inline-block" }}>
              <Badge count={2} size="small" offset={[0, 6]}>
                <ShoppingCartOutlined
                  style={{ fontSize: 20, color: "#fff", cursor: "pointer" }}
                />
              </Badge>
            </Link>
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="md:hidden"
              style={{ color: "#fff" }}
            />
          </Space>
        </Col>
      </Row>
    </Header>
  );
}
