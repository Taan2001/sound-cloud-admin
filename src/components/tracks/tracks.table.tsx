import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";

export interface ITrack {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  trackUrl: string;
  countLike: string;
  countPlay: string;
}

const TracksTable = () => {
  const [listTracks, setListTracks] = useState([]);

  const accessToken = localStorage.getItem("accessToken") as string;

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  });

  useEffect(() => {
    getData();
  }, [meta.current, meta.pageSize]);

  const getData = async () => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
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

    setListTracks(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  const confirm = async (track: ITrack) => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/tracks/${track._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

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

  const columns: ColumnsType<ITrack> = [
    {
      title: "STT",
      dataIndex: "_id",
      render: (value, record, index) => {
        return <>{(meta.current - 1) * meta.pageSize + index + 1}</>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Track URL",
      dataIndex: "trackUrl",
    },
    {
      title: "Uploader",
      dataIndex: ["uploader", "name"],
    },
    {
      title: "Actions",
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              title="Delete the track"
              description={`Are you sure to delete this track. name: ${record.title}?`}
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
        <h2>Table Tracks</h2>
      </div>
      <Table
        columns={columns}
        dataSource={listTracks}
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
    </div>
  );
};

export default TracksTable;
