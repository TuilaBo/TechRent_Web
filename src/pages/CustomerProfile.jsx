// src/pages/profile/CustomerProfile.jsx
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Descriptions,
  Tag,
  Button,
  Space,
  Form,
  Input,
  message,
  Alert,
} from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
  EditOutlined,
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  IdcardOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

/** Mock customer – sau nối API thay ở đây */
const MOCK_CUSTOMER = {
  customerID: "CUS-000123",
  email: "user@example.com",
  phone: "0912345678",
  fullName: "Nguyễn Văn A",
  createdAt: "2025-09-20 10:30",
  status: "active",
  shippingAddress: "12 Nguyễn Trãi, P.Bến Thành, Q.1, TP.HCM",
  // KYC status: unverified | pending | verified
  kycStatus: "unverified",
};

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(MOCK_CUSTOMER);
  const [form] = Form.useForm();

  const onSave = (vals) => {
    const payload = {
      ...customer,
      fullName: vals.fullName?.trim(),
      phone: vals.phone?.trim(),
      shippingAddress: vals.shippingAddress?.trim(),
    };
    setCustomer(payload);
    message.success("Đã lưu thông tin hồ sơ (UI).");
  };

  const kycBlock = (() => {
    switch (customer.kycStatus) {
      case "verified":
        return (
          <Alert
            type="success"
            showIcon
            message={
              <Space>
                <CheckCircleTwoTone twoToneColor="#52c41a" />
                <Text strong>Đã xác thực KYC</Text>
              </Space>
            }
            description="Tài khoản của bạn đã được xác minh, có thể thuê thiết bị không giới hạn theo chính sách."
          />
        );
      case "pending":
        return (
          <Alert
            type="info"
            showIcon
            message={
              <Space>
                <SafetyCertificateOutlined />
                <Text strong>Yêu cầu KYC đang được duyệt</Text>
              </Space>
            }
            description="Chúng tôi sẽ phản hồi sớm nhất trong giờ làm việc."
          />
        );
      default:
        return (
          <Alert
            type="warning"
            showIcon
            message={
              <Space>
                <ExclamationCircleTwoTone twoToneColor="#faad14" />
                <Text strong>Chưa xác thực KYC</Text>
              </Space>
            }
            description={
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                <Text>
                  Bạn cần hoàn tất xác minh danh tính để tiếp tục thuê thiết bị có giá trị cao.
                </Text>
                <Button type="primary" icon={<IdcardOutlined />}>
                  <Link to="/kyc">Xác thực ngay</Link>
                </Button>
              </Space>
            }
          />
        );
    }
  })();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Row gutter={[16, 16]}>
          {/* Thông tin cơ bản */}
          <Col xs={24} lg={14}>
            <Card
              className="rounded-xl"
              title={
                <Space>
                  <UserOutlined />
                  <span>Hồ sơ khách hàng</span>
                </Space>
              }
              bodyStyle={{ padding: 18 }}
            >
              <Descriptions
                column={1}
                size="middle"
                colon
                labelStyle={{ width: 160 }}
                items={[
            
                  {
                    key: "email",
                    label: "Email",
                    children: (
                      <Space>
                        <MailOutlined />
                        <Text>{customer.email}</Text>
                      </Space>
                    ),
                  },
                  {
                    key: "created",
                    label: "Ngày tạo",
                    children: <Text>{customer.createdAt}</Text>,
                  },
                ]}
              />
            </Card>

            {/* Sửa thông tin liên hệ */}
            <Card
              className="rounded-xl mt-3"
              title={
                <Space>
                  <EditOutlined />
                  <span>Chỉnh sửa thông tin</span>
                </Space>
              }
              bodyStyle={{ padding: 18 }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onSave}
                initialValues={{
                  fullName: customer.fullName,
                  phone: customer.phone,
                  shippingAddress: customer.shippingAddress,
                }}
                requiredMark={false}
              >
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^(0|\+84)\d{9,10}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="09xx xxx xxx" />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ giao hàng"
                  name="shippingAddress"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    prefix={<HomeOutlined />}
                  />
                </Form.Item>

                <Space>
                  <Button type="primary" htmlType="submit">
                    Lưu thay đổi
                  </Button>
                  <Button htmlType="button" onClick={() => form.resetFields()}>
                    Hủy
                  </Button>
                </Space>
              </Form>
            </Card>
          </Col>

          {/* Khối KYC + ghi chú */}
          <Col xs={24} lg={10}>
            <Card
              className="rounded-xl"
              title={
                <Space>
                  <SafetyCertificateOutlined />
                  <span>Trạng thái KYC</span>
                </Space>
              }
              bodyStyle={{ padding: 18 }}
            >
              {kycBlock}
            </Card>

            <Card className="rounded-xl mt-3" bodyStyle={{ padding: 18 }}>
              <Title level={5} style={{ marginTop: 0 }}>
                Ghi chú
              </Title>
              <Paragraph type="secondary">
                • Thông tin hồ sơ dùng để xuất hợp đồng và giao/thu hồi thiết bị.
                <br />• Nếu bạn thay đổi địa chỉ nhận hàng, vui lòng cập nhật trước
                khi đặt đơn mới.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
