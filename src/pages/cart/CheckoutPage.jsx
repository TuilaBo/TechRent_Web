// src/pages/checkout/CheckoutPage.jsx
import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Breadcrumb,
  Card,
  Form,
  Input,
  Select,
  Radio,
  Button,
  Divider,
  List,
  Avatar,
  Badge,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// --- MOCK giỏ hàng: thay bằng state/Redux/API của bạn ---
const CART = [
  {
    id: "chair-sim",
    name: "Cho thuê bộ Ghế Lái Xe Giả Lập",
    note: "Kèm màn hình 32inch 4K / 1 ngày",
    image:
      "https://images.unsplash.com/photo-1584156584582-461f6ec49a2b?q=80&w=1200&auto=format&fit=crop",
    dailyPrice: 2500000,
    days: 1,
    qty: 1,
  },
];

// --- MOCK địa lý tối giản (có thể thay bằng API tỉnh/TP) ---
const PROVINCES = [
  { value: "HCM", label: "TP. Hồ Chí Minh" },
  { value: "HN", label: "Hà Nội" },
  { value: "DN", label: "Đà Nẵng" },
];

const DISTRICTS = {
  HCM: [
    { value: "Q1", label: "Quận 1" },
    { value: "Q3", label: "Quận 3" },
    { value: "BT", label: "Bình Thạnh" },
  ],
  HN: [
    { value: "HK", label: "Hoàn Kiếm" },
    { value: "CG", label: "Cầu Giấy" },
  ],
  DN: [
    { value: "HC", label: "Hải Châu" },
    { value: "ST", label: "Sơn Trà" },
  ],
};

const WARDS = {
  Q1: [
    { value: "PBenNghe", label: "Phường Bến Nghé" },
    { value: "PBenThanh", label: "Phường Bến Thành" },
  ],
  Q3: [
    { value: "PWard6", label: "Phường 6" },
    { value: "PWard7", label: "Phường 7" },
  ],
  BT: [
    { value: "P22", label: "Phường 22" },
    { value: "PWard1", label: "Phường 1" },
  ],
  HK: [
    { value: "PHangTrong", label: "Phường Hàng Trống" },
    { value: "PTrangTien", label: "Phường Tràng Tiền" },
  ],
  CG: [
    { value: "PDichVong", label: "Phường Dịch Vọng" },
    { value: "PDichVongHau", label: "Phường Dịch Vọng Hậu" },
  ],
  HC: [
    { value: "PThachThang", label: "Phường Thạch Thang" },
    { value: "PHaiChauI", label: "Phường Hải Châu I" },
  ],
  ST: [
    { value: "PAnHaiBac", label: "Phường An Hải Bắc" },
    { value: "PAnHaiDong", label: "Phường An Hải Đông" },
  ],
};

function formatVND(n) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [shippingMethod, setShippingMethod] = useState("delivery"); // delivery | pickup
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null); // {code, amount}

  // Tính tiền
  const totals = useMemo(() => {
    const subtotal = CART.reduce(
      (sum, it) => sum + it.dailyPrice * it.days * it.qty,
      0
    );

    // Phí vận chuyển mẫu:
    // - Nhận tại cửa hàng: 0
    // - Giao nội thành HCM/HN/ĐN: 50k
    // - Khác: 80k (vì mock nên chỉ 3 TP → mặc định 50k)
    let shipping = shippingMethod === "pickup" ? 0 : 50000;

    const discount = couponApplied?.amount || 0;

    const grand = Math.max(0, subtotal + shipping - discount);

    return { subtotal, shipping, discount, grand };
  }, [shippingMethod, couponApplied]);

  const applyCoupon = () => {
    if (!coupon) return;
    // MOCK: nếu mã "GIAM100K" thì giảm 100k
    if (coupon.trim().toUpperCase() === "GIAM100K") {
      setCouponApplied({ code: "GIAM100K", amount: 100000 });
      message.success("Áp dụng mã giảm giá thành công.");
    } else {
      setCouponApplied(null);
      message.warning("Mã giảm giá không hợp lệ.");
    }
  };

  const onFinish = (values) => {
    // Gom dữ liệu & điều hướng tới trang chọn phương thức thanh toán
    const payload = {
      contact: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
      },
      shipping: {
        method: shippingMethod,
        address:
          shippingMethod === "delivery"
            ? {
                addressLine: values.address,
                province: values.province,
                district: values.district,
                ward: values.ward,
              }
            : null,
      },
      cart: CART,
      totals,
      coupon: couponApplied,
    };

    console.log("Checkout payload:", payload);
    message.success("Thông tin giao hàng đã lưu. Chuyển tới thanh toán…");
    // TODO: navigate tới /payment và truyền state/payload
    navigate("/payment", { state: payload });
  };

  const provinceValue = Form.useWatch("province", form);
  const districtValue = Form.useWatch("district", form);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb
          items={[
            { title: <Link to="/cart">Giỏ hàng</Link> },
            { title: "Thông tin giao hàng" },
            { title: "Phương thức thanh toán" },
          ]}
          className="mb-2"
        />

        <Row gutter={[24, 24]}>
          {/* LEFT: Form giao hàng */}
          <Col xs={24} lg={14}>
            <Title level={2} style={{ marginBottom: 16 }}>
              Thuê Nhanh
            </Title>

            <Card bordered className="rounded-xl" bodyStyle={{ padding: 20 }}>
              <Title level={4} style={{ marginTop: 0 }}>
                Thông tin giao hàng
              </Title>


              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ fullName: "", email: "", phone: "" }}
                requiredMark={false}
              >
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Row gutter={12}>
                  <Col xs={24} md={14}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input placeholder="you@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={10}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                        {
                          pattern: /^(0|\+84)\d{9,10}$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      ]}
                    >
                      <Input placeholder="09xx xxx xxx" />
                    </Form.Item>
                  </Col>
                </Row>

                <Card
                  type="inner"
                  title={
                    <Radio.Group
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    >
                      <Radio value="delivery">Giao tận nơi</Radio>
                      <Radio value="pickup">Nhận tại cửa hàng</Radio>
                    </Radio.Group>
                  }
                  className="rounded-lg"
                  bodyStyle={{ paddingTop: 12 }}
                >
                  {shippingMethod === "delivery" ? (
                    <>
                      <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                          { required: true, message: "Vui lòng nhập địa chỉ" },
                        ]}
                      >
                        <Input placeholder="Số nhà, đường..." />
                      </Form.Item>

                      <Row gutter={12}>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Tỉnh / thành"
                            name="province"
                            rules={[
                              { required: true, message: "Chọn tỉnh / thành" },
                            ]}
                          >
                            <Select
                              placeholder="Chọn tỉnh / thành"
                              options={PROVINCES}
                              allowClear
                              onChange={() =>
                                form.setFieldsValue({
                                  district: undefined,
                                  ward: undefined,
                                })
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Quận / huyện"
                            name="district"
                            rules={[
                              { required: true, message: "Chọn quận / huyện" },
                            ]}
                          >
                            <Select
                              placeholder="Chọn quận / huyện"
                              options={DISTRICTS[provinceValue] || []}
                              disabled={!provinceValue}
                              allowClear
                              onChange={() =>
                                form.setFieldsValue({ ward: undefined })
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label="Phường / xã"
                            name="ward"
                            rules={[
                              { required: true, message: "Chọn phường / xã" },
                            ]}
                          >
                            <Select
                              placeholder="Chọn phường / xã"
                              options={WARDS[districtValue] || []}
                              disabled={!districtValue}
                              allowClear
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <div>
                      <Text type="secondary">
                        Vui lòng đến cửa hàng TechRent (Quận 1, TP.HCM) để nhận
                        thiết bị. Chúng tôi sẽ liên hệ xác nhận thời gian.
                      </Text>
                    </div>
                  )}
                </Card>

                <div className="mt-4">
                  <Button type="primary" size="large" htmlType="submit" block>
                    Tiếp tục đến phương thức thanh toán
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          {/* RIGHT: Tóm tắt đơn hàng */}
          <Col xs={24} lg={10}>
            <Card
              bordered
              className="rounded-xl"
              style={{
                position: "sticky",
                top: "calc(var(--stacked-header,0px) + 16px)",
              }}
              bodyStyle={{ padding: 16 }}
            >
              <List
                itemLayout="horizontal"
                dataSource={CART}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge count={item.qty} size="small">
                          <Avatar
                            shape="square"
                            size={56}
                            src={item.image}
                            alt={item.name}
                          />
                        </Badge>
                      }
                      title={
                        <div className="flex justify-between gap-2">
                          <span style={{ fontWeight: 500 }}>{item.name}</span>
                          <span>
                            {formatVND(item.dailyPrice * item.days * item.qty)}
                          </span>
                        </div>
                      }
                      description={<Text type="secondary">{item.note}</Text>}
                    />
                  </List.Item>
                )}
              />

              <Divider />

              <div className="flex gap-2">
                <Input
                  placeholder="Mã giảm giá"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <Button onClick={applyCoupon}>Sử dụng</Button>
              </div>

              <Divider />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text>Tạm tính</Text>
                  <Text strong>{formatVND(totals.subtotal)}</Text>
                </div>
                <div className="flex justify-between">
                  <Text>Phí vận chuyển</Text>
                  <Text strong>
                    {totals.shipping ? formatVND(totals.shipping) : "—"}
                  </Text>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between">
                    <Text>Giảm giá ({couponApplied?.code})</Text>
                    <Text strong>-{formatVND(totals.discount)}</Text>
                  </div>
                )}
              </div>

              <Divider />

              <div className="flex justify-between items-center">
                <Title level={4} style={{ margin: 0 }}>
                  Tổng cộng
                </Title>
                <Title level={3} style={{ margin: 0, color: "#ff4d4f" }}>
                  {formatVND(totals.grand)}
                </Title>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
