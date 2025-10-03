// src/pages/kyc/KycPage.jsx
import React, { useState } from "react";
import {
  Steps,
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Result,
} from "antd";
import {
  UserOutlined,
  IdcardOutlined,
  CheckCircleTwoTone,
  InboxOutlined,
  CameraOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

export default function KycPage() {
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();

  // chỉ để hiển thị UI upload (không upload lên server)
  const [front, setFront] = useState([]);
  const [back, setBack] = useState([]);
  const [selfie, setSelfie] = useState([]);
  const [done, setDone] = useState(false);

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Title level={2} style={{ marginBottom: 8 }}>
          Xác minh danh tính (KYC)
        </Title>
        <Text type="secondary">
          Hoàn tất các bước sau để xác minh tài khoản và tiếp tục thuê thiết bị.
        </Text>

        <Card className="rounded-xl mt-4" bodyStyle={{ padding: 20 }}>
          <Steps
            current={step}
            items={[
              { title: "Thông tin", icon: <UserOutlined /> },
              { title: "Tải giấy tờ", icon: <IdcardOutlined /> },
              { title: "Xác nhận", icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> },
            ]}
            responsive
            size="small"
            style={{ marginBottom: 16 }}
          />

          {/* BƯỚC 1: THÔNG TIN */}
          {step === 0 && (
            <Form form={form} layout="vertical" requiredMark={false}>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Họ và tên" name="fullName">
                    <Input placeholder="Nguyễn Văn A" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Số giấy tờ" name="idNumber">
                    <Input placeholder="CCCD/CMND/Passport" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Loại giấy tờ" name="idType" initialValue="cccd">
                    <Select>
                      <Option value="cccd">Căn cước công dân</Option>
                      <Option value="cmnd">Chứng minh nhân dân</Option>
                      <Option value="passport">Hộ chiếu</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Ngày sinh" name="dob">
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Ngày cấp" name="issueDate">
                    <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Địa chỉ (trên giấy tờ)" name="address">
                <Input placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
              </Form.Item>

              <Space>
                <Button type="primary" onClick={next}>
                  Tiếp tục
                </Button>
              </Space>
            </Form>
          )}

          {/* BƯỚC 2: UPLOAD GIẤY TỜ */}
          {step === 1 && (
            <>
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Text strong className="block mb-2">Mặt trước</Text>
                  <Dragger
                    multiple={false}
                    fileList={front}
                    beforeUpload={() => false} // UI-only
                    onChange={({ fileList }) => setFront(fileList.slice(-1))}
                    accept=".jpg,.jpeg,.png,.webp"
                    listType="picture-card"
                  >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Kéo thả hoặc bấm để chọn</p>
                    <p className="ant-upload-hint">1 ảnh</p>
                  </Dragger>
                </Col>
                <Col xs={24} md={8}>
                  <Text strong className="block mb-2">Mặt sau</Text>
                  <Dragger
                    multiple={false}
                    fileList={back}
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setBack(fileList.slice(-1))}
                    accept=".jpg,.jpeg,.png,.webp"
                    listType="picture-card"
                  >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Kéo thả hoặc bấm để chọn</p>
                    <p className="ant-upload-hint">1 ảnh</p>
                  </Dragger>
                </Col>
                <Col xs={24} md={8}>
                  <Text strong className="block mb-2">Selfie cầm giấy tờ</Text>
                  <Dragger
                    multiple={false}
                    fileList={selfie}
                    beforeUpload={() => false}
                    onChange={({ fileList }) => setSelfie(fileList.slice(-1))}
                    accept=".jpg,.jpeg,.png,.webp"
                    listType="picture-card"
                  >
                    <p className="ant-upload-drag-icon"><CameraOutlined /></p>
                    <p className="ant-upload-text">Kéo thả hoặc bấm để chọn</p>
                    <p className="ant-upload-hint">1 ảnh</p>
                  </Dragger>
                </Col>
              </Row>

              <Space className="mt-2">
                <Button onClick={prev}>Quay lại</Button>
                <Button type="primary" onClick={next}>Tiếp tục</Button>
              </Space>
            </>
          )}

          {/* BƯỚC 3: XÁC NHẬN */}
          {step === 2 && !done && (
            <Row gutter={16}>
              <Col xs={24} md={14}>
                <Card type="inner" title="Xem lại thông tin" className="mb-3">
                  <Row gutter={[8, 8]}>
                    <Col span={8}><Text type="secondary">Họ tên</Text></Col>
                    <Col span={16}><Text strong>{form.getFieldValue("fullName") || "—"}</Text></Col>
                    <Col span={8}><Text type="secondary">Số giấy tờ</Text></Col>
                    <Col span={16}><Text>{form.getFieldValue("idNumber") || "—"}</Text></Col>
                    <Col span={8}><Text type="secondary">Loại giấy tờ</Text></Col>
                    <Col span={16}><Text>{form.getFieldValue("idType") || "—"}</Text></Col>
                    <Col span={8}><Text type="secondary">Ngày sinh</Text></Col>
                    <Col span={16}><Text>{form.getFieldValue("dob")?.format?.("DD/MM/YYYY") || "—"}</Text></Col>
                    <Col span={8}><Text type="secondary">Ngày cấp</Text></Col>
                    <Col span={16}><Text>{form.getFieldValue("issueDate")?.format?.("DD/MM/YYYY") || "—"}</Text></Col>
                    <Col span={8}><Text type="secondary">Địa chỉ</Text></Col>
                    <Col span={16}><Text>{form.getFieldValue("address") || "—"}</Text></Col>
                  </Row>
                </Card>

                <Space>
                  <Button onClick={prev}>Quay lại</Button>
                  <Button type="primary" onClick={() => setDone(true)}>
                    Gửi xác minh
                  </Button>
                </Space>
              </Col>

              <Col xs={24} md={10}>
                <Card type="inner" title="Ảnh đã tải lên">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <Text type="secondary">Mặt trước</Text>
                      {front[0]?.thumbUrl && (
                        <img src={front[0].thumbUrl} alt="front" style={{ width: "100%", borderRadius: 8 }} />
                      )}
                    </div>
                    <div>
                      <Text type="secondary">Mặt sau</Text>
                      {back[0]?.thumbUrl && (
                        <img src={back[0].thumbUrl} alt="back" style={{ width: "100%", borderRadius: 8 }} />
                      )}
                    </div>
                    <div className="col-span-2">
                      <Text type="secondary">Selfie</Text>
                      {selfie[0]?.thumbUrl && (
                        <img src={selfie[0].thumbUrl} alt="selfie" style={{ width: "100%", borderRadius: 8 }} />
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          )}

          {/* HOÀN TẤT (UI) */}
          {done && (
            <Result
              status="success"
              title="Đã gửi thông tin KYC"
              subTitle="Chúng tôi sẽ kiểm tra và phản hồi sớm nhất. Cảm ơn bạn!"
              extra={<Button type="primary" onClick={() => (window.location.href = "/")}>Về trang chủ</Button>}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
