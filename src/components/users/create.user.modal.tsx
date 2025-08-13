import {
  Modal,
  Input,
  notification,
  Form,
  Checkbox,
  Select,
  InputNumber,
} from "antd";

interface IProps {
  accessToken: string;
  getData: () => Promise<void>;
  setIsCreateModalOpen: (is: boolean) => void;
  isCreateModalOpen: boolean;
}

const CreateUserModal = ({
  accessToken,
  getData,
  isCreateModalOpen,
  setIsCreateModalOpen,
}: IProps) => {
  const [form] = Form.useForm();

  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    const { name, email, password, age, gender, role, address } = values;

    const data = { name, email, password, age, gender, role, address };

    const res = await fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...data }),
    });

    const d = await res.json();

    if (d.data) {
      await getData();
      notification.success({
        message: "Tạo mới user thành công",
      });
      handleCloseCreateModal();
    } else {
      notification.error({
        description: JSON.stringify(d.message),
        message: "Có lỗi xảy ra",
      });
    }
  };

  return (
    <Modal
      title="Add new user"
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
    >
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        form={form}
      >
        <Form.Item
          style={{ marginBottom: "8px" }}
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "8px" }}
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "8px" }}
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "8px" }}
          label="Age"
          name="age"
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "8px" }}
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "8px" }}
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please input your gender!" }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
            options={[
              { value: "MALE", label: "male" },
              { value: "FEMALE", label: "female" },
              { value: "OTHER", label: "other" },
            ]}
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: "8px" }}
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please input your role!" }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            allowClear
            options={[
              { value: "USER", label: "User" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
