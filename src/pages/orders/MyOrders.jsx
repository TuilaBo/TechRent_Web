// src/pages/orders/MyOrders.jsx
import React, { useMemo, useState } from "react";
import {
  Table, Tag, Typography, Input, DatePicker, Space, Button,
  Dropdown, Menu, Tooltip, message, Drawer, List, Descriptions, Avatar, Empty, Divider
} from "antd";
import {
  SearchOutlined, FilterOutlined, EyeOutlined,
  CreditCardOutlined, StopOutlined, ReloadOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// ---- Mock data (thay bằng API thật) ----
const MOCK = [
  {
    id: "TR-241001-023",
    createdAt: "2025-10-01T11:45:00Z",
    items: [
      { name: "DJI Mini 4 Pro", qty: 1, image: "https://images.unsplash.com/photo-1617814075185-99b7e8f1ce95?q=80&w=600&auto=format&fit=crop" },
    ],
    days: 1,
    total: 800000,
    orderStatus: "active",
    paymentStatus: "paid",
    contractUrl: "https://example.com/contracts/TR-241001-023.pdf",
  },
  {
    id: "TR-240927-004",
    createdAt: "2025-09-27T09:00:00Z",
    items: [
      { name: "Sony A7 IV", qty: 1, image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=600&auto=format&fit=crop" },
    ],
    days: 2,
    total: 1600000,
    orderStatus: "cancelled",
    paymentStatus: "refunded",
    cancelReason: "Khách yêu cầu hủy do thay đổi lịch.",
    contractUrl: "https://example.com/contracts/TR-240927-004.pdf",
  },
  {
    id: "TR-240920-017",
    createdAt: "2025-09-20T14:10:00Z",
    items: [
      { name: "Meta Quest 3", qty: 1, image: "https://images.unsplash.com/photo-1707831960905-9df58c93b928?q=80&w=600&auto=format&fit=crop" },
    ],
    days: 7,
    total: 4900000,
    orderStatus: "pending",
    paymentStatus: "unpaid",
    contractUrl: "https://example.com/contracts/TR-240920-017.pdf",
  },
  {
    id: "TR-240918-001",
    createdAt: "2025-09-18T10:25:00Z",
    items: [
      { name: 'Playstation 5 + TV 55" 4K', qty: 1, image: "https://images.unsplash.com/photo-1606813907291-76b553ee8a87?q=80&w=600&auto=format&fit=crop" },
      { name: "Tay cầm DualSense", qty: 1, image: "https://images.unsplash.com/photo-1619690141313-b01f1d95d1a8?q=80&w=600&auto=format&fit=crop" },
    ],
    days: 3,
    total: 3000000,
    orderStatus: "confirmed",
    paymentStatus: "paid",
    contractUrl: "https://example.com/contracts/TR-240918-001.pdf",
  },
];

const ORDER_STATUS_MAP = {
  pending:   { label: "Chờ xác nhận", color: "default" },
  confirmed: { label: "Đã xác nhận",  color: "blue"    },
  delivering:{ label: "Đang giao",    color: "cyan"    },
  active:    { label: "Đang thuê",    color: "gold"    },
  returned:  { label: "Đã trả",       color: "green"   },
  cancelled: { label: "Đã hủy",       color: "red"     },
};

const PAYMENT_STATUS_MAP = {
  unpaid:   { label: "Chưa thanh toán",      color: "volcano"  },
  paid:     { label: "Đã thanh toán",        color: "green"    },
  refunded: { label: "Đã hoàn tiền",         color: "geekblue" },
  partial:  { label: "Thanh toán một phần",  color: "purple"   },
};

function formatVND(n) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function calcEndDate(startIso, days) {
  const start = new Date(startIso);
  const end = new Date(start);
  end.setDate(end.getDate() + (days || 0));
  return end;
}

export default function MyOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const data = useMemo(() => {
    let rows = [...MOCK];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.items.some((it) => it.name.toLowerCase().includes(q))
      );
    }
    if (statusFilter) rows = rows.filter((r) => r.orderStatus === statusFilter);
    if (dateRange?.length === 2) {
      const [s, e] = dateRange;
      const start = s.startOf("day").toDate().getTime();
      const end = e.endOf("day").toDate().getTime();
      rows = rows.filter((r) => {
        const t = new Date(r.createdAt).getTime();
        return t >= start && t <= end;
      });
    }
    return rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [search, statusFilter, dateRange]);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Đã tải lại danh sách đơn.");
    }, 600);
  };

  const showDetail = (record) => {
    setCurrent(record);
    setDetailOpen(true);
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 150,
      render: (v) => <Text strong>{v}</Text>,
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Sản phẩm",
      key: "items",
      width: 360,
      render: (_, r) => {
        const first = r.items[0];
        const extra = r.items.length > 1 ? ` +${r.items.length - 1} mục` : "";
        return (
          <Space>
            <Avatar shape="square" size={56} src={first?.image} />
            <div>
              <div style={{ fontWeight: 600, lineHeight: 1.2 }}>{first?.name}</div>
              <Text type="secondary">SL: {first?.qty}{extra}</Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (v) => formatDateTime(v),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Số ngày",
      dataIndex: "days",
      key: "days",
      align: "center",
      width: 100,
      sorter: (a, b) => a.days - b.days,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "right",
      width: 140,
      render: (v) => <Text strong>{formatVND(v)}</Text>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 140,
      render: (s) => <Tag color={ORDER_STATUS_MAP[s].color}>{ORDER_STATUS_MAP[s].label}</Tag>,
      filters: Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => ({ text: label, value })),
      onFilter: (v, r) => r.orderStatus === v,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 170,
      render: (s) => <Tag color={PAYMENT_STATUS_MAP[s].color}>{PAYMENT_STATUS_MAP[s].label}</Tag>,
      filters: Object.entries(PAYMENT_STATUS_MAP).map(([value, { label }]) => ({ text: label, value })),
      onFilter: (v, r) => r.paymentStatus === v,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 230,
      render: (_, r) => {
        const canPay = r.paymentStatus === "unpaid" && r.orderStatus !== "cancelled";
        const canCancel = ["pending", "confirmed"].includes(r.orderStatus);
        return (
          <Space>
            <Button shape="round" onClick={() => showDetail(r)} icon={<EyeOutlined />}>
              Xem
            </Button>
            <Button
              shape="round"
              type="primary"
              ghost
              disabled={!canPay}
              icon={<CreditCardOutlined />}
              onClick={() => message.info(`Thanh toán đơn ${r.id}`)}
            >
              Thanh toán
            </Button>
            <Button
              shape="round"
              danger
              ghost
              disabled={!canCancel}
              icon={<StopOutlined />}
              onClick={() => message.warn(`Yêu cầu hủy đơn ${r.id}`)}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          height: "calc(100vh - var(--stacked-header,128px))",
          marginTop: "-24px",
          marginBottom: "-24px",
          background: "#fff",
        }}
      >
        <div className="h-full flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Title level={3} style={{ margin: 0 }}>Đơn thuê của tôi</Title>
            <Text type="secondary">Theo dõi trạng thái đơn, thanh toán và tải hợp đồng.</Text>
          </div>

          <div className="flex items-center justify-between pb-2">
            <Space wrap>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Tìm theo mã đơn, tên thiết bị…"
                style={{ width: 300 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <RangePicker onChange={setDateRange} />
              <Dropdown
                trigger={["click"]}
                overlay={
                  <Menu
                    onClick={({ key }) => setStatusFilter(key === "all" ? undefined : key)}
                    items={[
                      { key: "all", label: "Tất cả trạng thái" },
                      ...Object.entries(ORDER_STATUS_MAP).map(([k, v]) => ({ key: k, label: v.label })),
                    ]}
                  />
                }
              >
                <Button shape="round" icon={<FilterOutlined />}>
                  {statusFilter ? `Lọc: ${ORDER_STATUS_MAP[statusFilter].label}` : "Lọc trạng thái"}
                </Button>
              </Dropdown>
              <Button shape="round" icon={<ReloadOutlined />} onClick={refresh} loading={loading}>
                Tải lại
              </Button>
            </Space>
          </div>

          <div className="flex-1 min-h-0 overflow-auto pb-3">
            {data.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <Empty description="Chưa có đơn nào" />
              </div>
            ) : (
              <Table
                rowKey="id"
                columns={columns}
                dataSource={data}
                loading={loading}
                size="middle"
                bordered={false}
                className="rounded-xl shadow-sm"
                sticky
                pagination={{ pageSize: 8, showSizeChanger: true, position: ["bottomRight"] }}
                scroll={{ x: 1024 }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Drawer chi tiết đơn */}
      <Drawer
        title={current ? `Chi tiết đơn ${current.id}` : "Chi tiết đơn"}
        width={720}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      >
        {current && (
          <>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Trạng thái đơn">
                <Tag color={ORDER_STATUS_MAP[current.orderStatus].color}>
                  {ORDER_STATUS_MAP[current.orderStatus].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={PAYMENT_STATUS_MAP[current.paymentStatus].color}>
                  {PAYMENT_STATUS_MAP[current.paymentStatus].label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {formatDateTime(current.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian thuê">
                {(() => {
                  const end = calcEndDate(current.createdAt, current.days);
                  return `${formatDateTime(current.createdAt)}  →  ${end.toLocaleString("vi-VN", {
                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })} (${current.days} ngày)`;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền thuê">
                <Text strong>{formatVND(current.total)}</Text>
              </Descriptions.Item>
              {current.orderStatus === "cancelled" && (
                <Descriptions.Item label="Lý do hủy">
                  <Text type="danger">{current.cancelReason || "—"}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Title level={5} style={{ marginTop: 0 }}>Thiết bị thuê</Title>
            <List
              itemLayout="horizontal"
              dataSource={current.items}
              renderItem={(it) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar shape="square" size={64} src={it.image} />}
                    title={<Text strong>{it.name}</Text>}
                    description={<Text type="secondary">Số lượng: {it.qty}</Text>}
                  />
                </List.Item>
              )}
            />

            <Space style={{ marginTop: 12 }}>
              <Button
                type="primary"
                onClick={() => {
                  if (current.contractUrl) window.open(current.contractUrl, "_blank");
                  else message.info("Chưa có hợp đồng cho đơn này.");
                }}
              >
                Tải hợp đồng thuê
              </Button>
            </Space>
          </>
        )}
      </Drawer>

      <style>{`
        .ant-table-wrapper.rounded-xl .ant-table {
          border-radius: 14px;
        }
        .ant-table-wrapper.rounded-xl .ant-table-container table > tbody > tr:hover > td {
          background: #fafcff;
        }
      `}</style>
    </>
  );
}
