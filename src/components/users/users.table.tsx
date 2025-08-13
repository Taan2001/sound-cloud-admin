import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";
// import "../../styles/users.css";

export interface IUsers {
  email: string;
  name: string;
  role: string;
  _id: string;
  password: string;
  address: string;
  gender: string;
  age: string;
}

const UsersTable = () => {
  const [listUsers, setListUsers] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [updateData, setUpdateData] = useState<null | IUsers>(null);

  const accessToken = localStorage.getItem("accessToken") as string;

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 3,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const getData = async () => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const d = await res1.json();

    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }

    setListUsers(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  const confirm = async (user: IUsers) => {
    const res1 = await fetch(`http://localhost:8000/api/v1/users/${user._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const d = await res1.json();

    if (d.data) {
      await getData();
      notification.success({
        message: "Xóa thành công.",
      });
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
  };

  const columns: ColumnsType<IUsers> = [
    {
      title: "Email",
      dataIndex: "email",
      render: (value, record) => {
        return <Link to={`/${record.email}`}>{record.email}</Link>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      render: (value, record) => {
        return (
          <div>
            <Button
              onClick={() => {
                setUpdateData(record);
                setIsUpdateModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the user"
              description={`Are you sure to delete this user. name: ${record.name}?`}
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ marginLeft: "20px" }} danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleOnChange = (page: number, pageSize: number) => {
    setMeta((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Table Users</h2>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add new
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={listUsers}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) =>
            handleOnChange(page, pageSize),
          showSizeChanger: true,
        }}
      />
      <CreateUserModal
        accessToken={accessToken}
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <UpdateUserModal
        accessToken={accessToken}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        updateData={updateData}
        setUpdateData={setUpdateData}
      />
    </div>
  );
};

export default UsersTable;
