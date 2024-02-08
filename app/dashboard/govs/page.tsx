"use client";
import { DeleteReq, GetReq, PatchReq, PostReq } from "../../api/api";
import { StatusSuccessCodes } from "../../api/successStatus";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  message,
} from "antd/lib";
import Table, { ColumnsType } from "antd/lib/table";
import { Fragment, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdModeEditOutline } from "react-icons/md";

export default function Govs() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [GovForm] = Form.useForm();
  const [isGovModalOpen, setIsGovModalOpen] = useState<boolean>(false);
  const [govEdit, setGovEdit] = useState<any>(false);
  const [list, setList] = useState<any[] | []>([]);
  const [govId, setGovId] = useState<any>("");
  const [govsList, setGovsList] = useState<any>([]);

  const [unitForm] = Form.useForm();
  const [isUnitModalOpen, setIsUnitModalOpen] = useState<boolean>(false);
  const [unitEdit, setUnitEdit] = useState<any>(false);
  const [UnitId, setUnitId] = useState<any>("");

  const columns: ColumnsType<any> = [
    {
      title: "Governorate",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Edit",
      key: "edit",
      render: (_: {}, record: { id: number; name: string }) => (
        <MdModeEditOutline
          onClick={() => {
            editGovHandler(record);
          }}
          className="cursor-pointer "
          size={24}
          color="rgb(34, 197, 94)"
        />
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_: {}, record: { id: number }) => (
        <Popconfirm
          title="Delete Record"
          description="Please Confirm you want to delete This Record"
          onConfirm={() => {
            deleteGovHandler(record);
          }}
          okText="Delete"
          cancelText="Cancel"
        >
          <FaTrash
            className="cursor-pointer"
            size={24}
            color="rgb(239, 68, 68)"
          />
        </Popconfirm>
      ),
    },
  ];

  function editGovHandler(record: any) {
    setIsGovModalOpen(true);
    GovForm.setFieldsValue({
      name: record.name,
    });
    setGovEdit(true);
    setGovId(record.id);
  }

  function deleteGovHandler(record: any) {
    setIsLoading(true);
    DeleteReq(`governorates/${record.id}/`).then((res: any) => {
      if (StatusSuccessCodes.includes(res.status)) {
        setIsLoading(false);
        message.success("Record Deleted Successfully");
        getGovsList();
      } else {
        setIsLoading(false);
        res?.errors?.forEach((err: any) => {
          message.error(`${err?.attr + ":" + err?.detail} `);
        });
      }
    });
  }

  const nestedTableColumns: ColumnsType<any> = [
    {
      title: "Licensing Unit",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "created_at",
      render: (_, { created_at }) =>
        created_at
          ? new Date(created_at).toLocaleString("en", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      title: "Updated At",
      key: "updatedAt",
      dataIndex: "updated_at",
      render: (_, { updated_at }) =>
        updated_at
          ? new Date(updated_at).toLocaleString("en", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      title: "Edit",
      key: "edit",
      render: (_: {}, record: { id: number; name: string }) => (
        <MdModeEditOutline
          onClick={() => {
            editUnitHandler(record);
          }}
          className="cursor-pointer "
          size={24}
          color="rgb(34, 197, 94)"
        />
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_: {}, record: { id: number }) => (
        <Popconfirm
          title="Delete Record"
          description="Please Confirm you want to delete This Record"
          onConfirm={() => {
            deleteUnitHandler(record);
          }}
          okText="Delete"
          cancelText="Cancel"
        >
          <FaTrash
            className="cursor-pointer"
            size={24}
            color="rgb(239, 68, 68)"
          />
        </Popconfirm>
      ),
    },
  ];
  function editUnitHandler(record: any) {
    setIsUnitModalOpen(true);
    unitForm.setFieldsValue({
      name: record.name,
      governorate: record.governorate,
    });
    setUnitEdit(true);
    setUnitId(record.id);
  }

  function deleteUnitHandler(record: any) {
    setIsLoading(true);
    DeleteReq(`licensing-units/${record.id}/`).then((res: any) => {
      if (StatusSuccessCodes.includes(res.status)) {
        setIsLoading(false);
        message.success("Record Deleted Successfully");
        getGovsList();
      } else {
        setIsLoading(false);
        res?.errors?.forEach((err: any) => {
          message.error(`${err?.attr + ":" + err?.detail} `);
        });
      }
    });
  }

  useEffect(() => {
    getGovsList();
  }, []);

  function closeModal() {
    GovForm.resetFields();
    setIsGovModalOpen(false);
    setGovEdit(false);
    setGovId("");

    unitForm.resetFields();
    setIsUnitModalOpen(false);
    setUnitEdit(false);
    setUnitId("");
  }
  function addEditGov(values: any) {
    setIsLoading(true);
    if (govEdit) {
      PatchReq(`governorates/${govId}/`, values).then((res) => {
        if (StatusSuccessCodes.includes(res.status)) {
          setIsLoading(false);
          setIsGovModalOpen(false);
          message.success("تم تعديل المحافظة بنجاح");
          setGovId("");
          setGovEdit(false);
          getGovsList();
        } else {
          setIsLoading(false);
          res?.errors?.forEach((err: any) => {
            message.error(`${err?.attr + ":" + err?.detail} `);
          });
        }
      });
    } else {
      PostReq(`governorates/`, values).then((res) => {
        if (StatusSuccessCodes.includes(res.status)) {
          message.success("Governorate Added Successfully");
          setIsLoading(false);
          setIsGovModalOpen(false);
          getGovsList();
        } else {
          setIsLoading(false);
          res?.errors?.forEach((err: any) => {
            message.error(`${err?.attr + ":" + err?.detail} `);
          });
        }
      });
    }
  }

  function addEditUnit(values: any) {
    setIsLoading(true);
    if (unitEdit) {
      PatchReq(`licensing-units/${UnitId}/`, values).then((res) => {
        if (StatusSuccessCodes.includes(res.status)) {
          setIsLoading(false);
          setIsUnitModalOpen(false);
          message.success("تم تعديل وحدة المرور بنجاح");
          setUnitId("");
          setUnitEdit(false);
          getGovsList();
        } else {
          setIsLoading(false);
          res?.errors?.forEach((err: any) => {
            message.error(`${err?.attr + ":" + err?.detail} `);
          });
        }
      });
    } else {
      PostReq(`licensing-units/`, values).then((res) => {
        if (StatusSuccessCodes.includes(res.status)) {
          message.success("Licensing Unit Added Successfully");
          setIsLoading(false);
          setIsUnitModalOpen(false);
          getGovsList();
        } else {
          setIsLoading(false);
          res?.errors?.forEach((err: any) => {
            message.error(`${err?.attr + ":" + err?.detail} `);
          });
        }
      });
    }
  }

  function getGovsList() {
    setIsLoading(true);
    GetReq("governorates/").then((res) => {
      if (StatusSuccessCodes.includes(res?.status)) {
        setList(res?.data);
        setGovsList(
          res?.data.map((gov: { name: string; id: number }) => (
            <Select.Option key={gov.name} value={gov.id}>
              {gov.name}
            </Select.Option>
          ))
        );
        setIsLoading(false);
      } else {
        setIsLoading(false);
        res?.errors?.forEach((err: any) => {
          message.error(`${err?.attr + ":" + err?.detail} `);
        });
      }
    });
  }

  function addGov() {
    GovForm.resetFields();
    setIsGovModalOpen(true);
  }

  function addUnit() {
    unitForm.resetFields();
    setIsUnitModalOpen(true);
  }

  return (
    <div className="bg-[#f1f5f9] border rounded-lg shadow-sm p-5">
      <div>
        <h3 className="flex text-black justify-start py-2 text-left w-full text-3xl font-bold">
          Governorates & Licensing Units
        </h3>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-row justify-end m-3">
        <Button size={"large"} shape="round" className="mr-5" onClick={addGov}>
          Add Governorate
        </Button>
        <Button size={"large"} shape="round" className="mr-5" onClick={addUnit}>
          Add Licensing Unit
        </Button>
      </div>
      <div>
        <div className="w-full max-h-screen overflow-x-scroll lg:overflow-x-auto md:overflow-x-scroll sm:overflow-x-scroll">
          <Table
            scroll={{ x: 0 }}
            rowKey={"id"}
            columns={columns}
            dataSource={list}
            expandable={{
              expandedRowRender: (record) => (
                <Table
                  className=" p-5"
                  scroll={{ x: 0 }}
                  rowKey={"id"}
                  columns={nestedTableColumns}
                  dataSource={record.licensing_units}
                />
              ),
            }}
          />
        </div>
      </div>
      <Modal
        title={govEdit ? " Edit Governorate" : "Add Governorate"}
        open={isGovModalOpen}
        footer={null}
        onCancel={closeModal}
      >
        <Form
          autoComplete="off"
          form={GovForm}
          layout="vertical"
          onFinish={addEditGov}
        >
          <div className="grid grid-cols-1 gap-5">
            <Form.Item
              name="name"
              label="Governorate:"
              rules={[{ required: true }, { type: "string" }]}
            >
              <Input placeholder="Governorate" autoComplete="off" />
            </Form.Item>
          </div>
          <div className="flex justify-end  ">
            <Form.Item>
              <Button
                size={"large"}
                shape="round"
                className="mr-5"
                htmlType="submit"
              >
                {govEdit ? "Edit Governorate " : "Add Governorate"}
              </Button>
              <Button size={"large"} shape="round" onClick={closeModal}>
                Cancel
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        title={unitEdit ? " Edit Licensing Unit" : "Add Licensing Unit"}
        open={isUnitModalOpen}
        footer={null}
        onCancel={closeModal}
      >
        <Form
          autoComplete="off"
          form={unitForm}
          layout="vertical"
          onFinish={addEditUnit}
        >
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="name"
              label="Unit Name:"
              rules={[{ required: true }]}
            >
              <Input placeholder="Unit Name" autoComplete="off" />
            </Form.Item>

            <Form.Item
              name="governorate"
              label="Governorate:"
              rules={[{ required: true }]}
            >
              <Select placeholder="Choose Governorate">{govsList}</Select>
            </Form.Item>
          </div>
          <div className="flex justify-end  ">
            <Form.Item>
              <Button
                size={"large"}
                shape="round"
                className="mr-5"
                htmlType="submit"
              >
                {unitEdit ? "Edit Licensing Unit " : "Add Licensing Unit "}
              </Button>
              <Button size={"large"} shape="round" onClick={closeModal}>
                Cancel
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
