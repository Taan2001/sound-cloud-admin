import { useEffect } from "react";
import { Modal, Input, notification, Form, InputNumber, Select } from "antd";
import { IUsers } from "./users.table.tsx";

interface IProps {
  accessToken: string;
  getData: () => Promise<void>;
  setIsUpdateModalOpen: (is: boolean) => void;
  isUpdateModalOpen: boolean;
  updateData: null | IUsers;
  setUpdateData: (data: null | IUsers) => void;
}

const UpdateUserModal = ({
  accessToken,
  getData,
  isUpdateModalOpen,
  setIsUpdateModalOpen,
  updateData,
  setUpdateData,
}: IProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (updateData) {
      form.setFieldsValue({
        name: updateData.name,
        email: updateData.email,
        age: updateData.age,
        address: updateData.address,
        gender: updateData.gender,
        role: updateData.role,
      });
    }
  }, [updateData]);

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateData(null);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    const { name, email, age, gender, role, address } = values;
    if (updateData) {
      const data = {
        _id: updateData._id,
        name,
        email,
        age,
        gender,
        role,
        address,
      };
      const res = await fetch("http://localhost:8000/api/v1/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const d = await res.json();

      if (d.data) {
        await getData();
        notification.success({
          message: "Cập nhập user thành công.",
        });
        handleCloseUpdateModal();
      } else {
        notification.error({
          description: JSON.stringify(d.message),
          message: "Có lỗi xảy ra",
        });
      }
    }
  };

  return (
    <Modal
      title="Update a user"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseUpdateModal}
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
          rules={[
            {
              required: !!updateData,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password disabled={!!updateData} />
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

export default UpdateUserModal;
