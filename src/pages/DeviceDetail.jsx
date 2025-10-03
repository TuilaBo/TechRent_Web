// src/pages/DeviceDetail.jsx
import React, { useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Breadcrumb,
  Tag,
  Radio,
  Space,
  Divider,
  InputNumber,
  Button,
  Image,
  Tabs,
  Tooltip,
  Rate,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

// Mock data (thay bằng API thật khi bạn có)
const product = {
  id: "ps5-combo-tv",
  name: "Cho thuê combo Playstation 5 kèm TV",
  brand: "Sony",
  sku: "PS5-55-4K-1D-RENT",
  category: "Gaming Console",
  tags: ["4K", "4K 120Hz"],
  rating: 4.8,
  reviews: 126,
  pricePerDay: 1000000, // VND/ngày
  variants: [
    { key: 'PS5 + TV 55" 4K', disabled: false, priceFactor: 1 },
    { key: 'PS5 + TV 75" 4K', disabled: false, priceFactor: 1.4 },
    { key: 'PS5 + TV 98" 4K', disabled: true, priceFactor: 2 },
  ],
  rentalDays: [1, 2, 3, 4, 5, 6, 7, 14, 30],
  images: [
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop",
  ],
  shortDesc:
    "Bộ combo PS5 + TV 4K sẵn sàng cắm là chơi. Hỗ trợ 4K/120Hz, trải nghiệm game mượt mà cho party/teambuilding.",
  longDesc: `Combo bao gồm: Playstation 5 (Digital), 2 tay cầm DualSense, TV 4K, dây HDMI 2.1, dây nguồn, chân đế.
Miễn phí tư vấn setup, hỗ trợ giao lắp tại nội thành. Thiết bị được vệ sinh/QC trước và sau mỗi lượt thuê.`,
  specs: [
    { k: "Độ phân giải", v: "4K (3840x2160) 60/120Hz" },
    { k: "Kết nối", v: "HDMI 2.1, Wi-Fi, Bluetooth" },
    { k: "Phụ kiện", v: "02 tay cầm DualSense, cáp, remote TV" },
  ],
  policy: [
    "Cọc 2–5 triệu tùy gói. Xuất hóa đơn GTGT theo yêu cầu.",
    "Miễn phí đổi thiết bị nếu lỗi do nhà cung cấp.",
    "Bồi thường theo chính sách nếu hư hại/thiếu phụ kiện.",
  ],
};

export default function DeviceDetail() {
  const [variant, setVariant] = useState(product.variants[0].key);
  const [days, setDays] = useState(product.rentalDays[0]);
  const [qty, setQty] = useState(1);

  const currentVariant = useMemo(
    () => product.variants.find((v) => v.key === variant),
    [variant]
  );

  const subtotal = useMemo(() => {
    const factor = currentVariant?.priceFactor ?? 1;
    return Math.round(product.pricePerDay * factor * days * qty);
  }, [days, qty, currentVariant]);

  const formatVND = (n) =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleAddToCart = () => {
    console.log({
      productId: product.id,
      variant,
      days,
      qty,
      subtotal,
    });
    // TODO: gọi API thêm giỏ
  };

  return (
    // KHÔNG padding-top ở đây; LayoutRoot đã chừa chỗ cho header rồi
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumb
          items={[
            { title: <a href="/">Trang chủ</a> },
            { title: <a href="/games">Máy Games</a> },
            { title: product.name },
          ]}
          className="mb-3"
        />

        <Row gutter={[24, 24]}>
          {/* Gallery trái */}
          <Col xs={24} lg={14}>
            <Card bordered className="rounded-xl">
              <Image.PreviewGroup>
                <Row gutter={[12, 12]}>
                  {product.images.map((src, idx) => (
                    <Col span={idx === 0 ? 24 : 12} key={idx}>
                      <div className="overflow-hidden rounded-lg">
                        <Image
                          src={src}
                          alt={`${product.name} ${idx + 1}`}
                          width="100%"
                          height={idx === 0 ? 420 : 220}
                          style={{ objectFit: "cover", borderRadius: 12 }}
                          placeholder
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </Card>
          </Col>

          {/* Panel phải */}
          <Col xs={24} lg={10}>
            <Card
              bordered
              className="rounded-xl"
              style={{ position: "sticky", top: 16 }} // chỉ cách đỉnh 16px
              bodyStyle={{ padding: 20 }}
              actions={[
                <Tooltip title="Yêu thích" key="fav">
                  <HeartOutlined />
                </Tooltip>,
                <Tooltip title="Chia sẻ" key="share">
                  <ShareAltOutlined />
                </Tooltip>,
              ]}
            >
              <div className="mb-2">
                <Title level={3} style={{ marginBottom: 4 }}>
                  {product.name}
                </Title>
                <Text type="secondary">{product.shortDesc}</Text>
              </div>

              <div className="grid grid-cols-2 gap-y-1 text-sm mb-3">
                <Text type="secondary">Thương hiệu:</Text>
                <Text strong>{product.brand}</Text>
                <Text type="secondary">SKU:</Text>
                <Text>{product.sku}</Text>
                <Text type="secondary">Loại sản phẩm:</Text>
                <Text>{product.category}</Text>
                <Text type="secondary">Đánh giá:</Text>
                <span className="inline-flex items-center gap-1">
                  <Rate allowHalf disabled defaultValue={product.rating} />
                  <Text type="secondary">({product.reviews})</Text>
                </span>
              </div>

              <Space size={[8, 8]} wrap className="mb-3">
                {product.tags.map((t) => (
                  <Tag key={t} color="blue">
                    {t}
                  </Tag>
                ))}
              </Space>

              <Divider className="my-3" />

              {/* Giá */}
              <div className="mb-3">
                <Text type="secondary" className="block text-sm">
                  Giá / ngày (theo cấu hình)
                </Text>
                <Title level={3} style={{ color: "#ff4d4f", margin: 0 }}>
                  {formatVND(
                    product.pricePerDay * (currentVariant?.priceFactor ?? 1)
                  )}
                </Title>
              </div>

              {/* Kiểu dáng */}
              <div className="mb-3">
                <Text strong className="block mb-2">
                  Kiểu dáng:
                </Text>
                <Radio.Group
                  onChange={(e) => setVariant(e.target.value)}
                  value={variant}
                >
                  <Space direction="vertical" size={8}>
                    {product.variants.map((v) => (
                      <Radio key={v.key} value={v.key} disabled={v.disabled}>
                        {v.key}
                        {v.disabled && (
                          <Tag color="default" className="ml-2">
                            Hết hàng
                          </Tag>
                        )}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>

              {/* Ngày thuê */}
              <div className="mb-3">
                <Text strong className="block mb-2">
                  Ngày thuê:
                </Text>
                <Radio.Group onChange={(e) => setDays(e.target.value)} value={days}>
                  <Space wrap>
                    {product.rentalDays.map((d) => (
                      <Radio.Button key={d} value={d} className="!mb-2">
                        {d} NGÀY
                      </Radio.Button>
                    ))}
                  </Space>
                </Radio.Group>
              </div>

              {/* Số lượng + thêm giỏ */}
              <div className="mb-3 flex items-center gap-3">
                <InputNumber
                  min={1}
                  value={qty}
                  onChange={(v) => setQty(v || 1)}
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  className="bg-blue-600"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </Button>
                <Text type="secondary" className="ml-auto">
                  Tạm tính: <Text strong>{formatVND(subtotal)}</Text>
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Tabs dưới */}
        <Row gutter={[24, 24]} className="mt-4">
          <Col xs={24} lg={14}>
            <Card bordered className="rounded-xl">
              <Tabs
                defaultActiveKey="desc"
                items={[
                  {
                    key: "desc",
                    label: "Mô tả",
                    children: (
                      <Paragraph style={{ marginBottom: 0, whiteSpace: "pre-line" }}>
                        {product.longDesc}
                      </Paragraph>
                    ),
                  },
                  {
                    key: "spec",
                    label: "Thông số",
                    children: (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.specs.map((s) => (
                          <div
                            key={s.k}
                            className="rounded-lg border border-slate-200 p-3"
                          >
                            <Text type="secondary" className="block">
                              {s.k}
                            </Text>
                            <Text strong>{s.v}</Text>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: "policy",
                    label: "Chính sách",
                    children: (
                      <ul className="list-disc pl-5 space-y-2">
                        {product.policy.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
