"use client";
import { DeleteReq, GetReq } from "../../api/api";
import { StatusSuccessCodes } from "../../api/successStatus";
import {
  Popconfirm,
  message,
  Image,
  DatePicker,
  Form,
  Button,
  Select,
  Input,
} from "antd/lib";
import Table, { ColumnsType } from "antd/lib/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";

export default function CarLicenses() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[] | []>([]);

  const columns: ColumnsType<any> = [
    {
      title: "User",
      key: "user",
      dataIndex: "user",
      render: (_, { user }) => (user ? user : "-"),
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
      title: "Status",
      key: "status",
      render: (_, { status }) => (status ? status.replace("_", " ") : "-"),
    },
    {
      title: "Needs Check",
      key: "needs_check",
      dataIndex: "needs_check",
      render: (_, needs_check) => (needs_check == true ? "Yes" : "No"),
    },
    {
      title: "Renewal Duration",
      key: "renewal_duration",
      dataIndex: "renewal_duration",
    },
    {
      title: "Visit Date",
      key: "visit_date",
      dataIndex: "visit_date",
      render: (_, { visit_date }) =>
        visit_date
          ? new Date(visit_date).toLocaleString("en", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      title: "Visit Slot",
      key: "visit_slot",
      dataIndex: "visit_slot",
    },
    {
      title: "VIP Assistance",
      key: "vip_assistance",
      dataIndex: "vip_assistance",
    },
    {
      title: "Installment",
      key: "installment",
      dataIndex: "installment",
      render: (_, installment) => (installment === true ? "Yes" : "No"),
    },
    {
      title: "New Car",
      key: "is_new_car",
      dataIndex: "is_new_car",
      render: (_, is_new_car) => (is_new_car === true ? "Yes" : "No"),
    },
    {
      title: "Contract Image",
      key: "contract",
      dataIndex: "contract",
      render: (_, record) => (
        <Image
          alt="Contract Image"
          width={70}
          src={record.license_id_image}
          fallback="/images/no-preview.jpeg"
        />
      ),
    },
    {
      title: "License Image",
      key: "license_id_image",
      dataIndex: "license_id_image",
      render: (_, record) => (
        <Image
          alt="License Image"
          width={70}
          src={record.license_id_image}
          fallback="/images/no-preview.jpeg"
        />
      ),
    },
    {
      title: "National Id Image",
      key: "national_id_image",
      dataIndex: "national_id_image",
      render: (_, record) => (
        <Image
          alt="National Id Image"
          width={70}
          src={record.national_id_image}
          fallback="/images/no-preview.jpeg"
        />
      ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Licensing Unit",
      key: "licensing_unit",
      dataIndex: ["licensing_unit", "name"],
    },

    {
      title: "Rating",
      key: "rating",
      dataIndex: "rating",
    },

    {
      title: "Delete",
      key: "delete",
      render: (_: {}, record: { id: number }) => (
        <Popconfirm
          title="Delete Record"
          description="Please Confirm you want to delete This Record"
          onConfirm={() => {
            deleteRowHandler(record);
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

  function deleteRowHandler(record: any) {
    setIsLoading(true);
    DeleteReq(`car-license/${record.id}/`).then((res: any) => {
      if (StatusSuccessCodes.includes(res.status)) {
        setIsLoading(false);
        message.success("Record Deleted Successfully");
      } else {
        setIsLoading(false);
        res?.errors?.forEach((err: any) => {
          message.error(`${err?.attr + ":" + err?.detail} `);
        });
      }
    });
  }
  useEffect(() => {
    getData("");
  }, []);

  function getData(values: any) {
    let url = `car-license/?`;
    if (typeof values !== "string") {
      values.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    }
    setIsLoading(true);
    GetReq(url).then((res) => {
      if (StatusSuccessCodes.includes(res?.status)) {
        setData(res?.data?.results);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        for (let key in res) {
          message.open({
            type: "error",
            content: res[key][0],
          });
        }
      }
    });
  }

  function search(values: any) {
    getData(values);
  }

  return (
    <div>
      <div>
        <div>
          <h3 className="flex justify-start py-5 text-black text-left w-full text-3xl font-bold">
            Car Licenses
          </h3>
        </div>
        <Suspense>
          <Search getData={search} />
        </Suspense>
        <div className="w-full max-h-screen overflow-x-scroll lg:overflow-x-auto md:overflow-x-scroll sm:overflow-x-scroll">
          <Table
            loading={isLoading}
            rowKey={"id"}
            scroll={{ x: 0 }}
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
    </div>
  );
}

function Search(props: any) {
  const getData = props.getData;
  const searchParams = useSearchParams();
  const [searchForm] = Form.useForm();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  const { RangePicker } = DatePicker;

  const onReset = () => {
    searchForm.resetFields();
    params.forEach((value, key) => params.delete(`${key}`));
    replace(`${pathname}`);
    getData(params);
  };

  function onFinish(values: any) {
    let from_date = 0;
    let to_date = 0;
    if (values.date) {
      from_date = Date.parse(values.date[0]);
      to_date = Date.parse(values.date[1]);
      params.set("from_date", from_date.toString());
      params.set("to_date", to_date.toString());
    } else {
      params.delete("from_date");
      params.delete("to_date");
    }
    if (values.search) {
      params.set("search", values.search);
    } else {
      params.delete("search");
    }

    if (values.status) {
      params.set("status", values.status);
    } else {
      params.delete("status");
    }
    if (values.needs_check) {
      params.set("needs_check", values.needs_check);
    } else {
      params.delete("needs_check");
    }
    if (values.is_new_car) {
      params.set("is_new_car", values.is_new_car);
    } else {
      params.delete("is_new_car");
    }
    if (values.installment) {
      params.set("installment", values.installment);
    } else {
      params.delete("installment");
    }

    if (values.vip_assistance) {
      params.set("vip_assistance", values.vip_assistance);
    } else {
      params.delete("vip_assistance");
    }

    replace(`${pathname}?${params.toString()}`);
    getData(params);
  }

  return (
    <Form
      form={searchForm}
      className={
        "gap-3 mb-5 items-baseline flex flex-col md:flex-row lg:flex-row"
      }
      onFinish={onFinish}
      // layout="inline"
    >
      <Form.Item
        name="search"
        className="w-[100%]"
        rules={[
          {
            validator(_, value) {
              const spaceStart = value?.startsWith(" ");
              const spaceEnd = value?.endsWith(" ");
              if (spaceStart) {
                return Promise.reject("Must not starts with space");
              } else if (spaceEnd) {
                return Promise.reject("Must not ended with space");
              } else {
                return Promise.resolve();
              }
            },
          },
        ]}
      >
        <Input
          type="text"
          id="name"
          placeholder="search . . ."
          className="h-[50px]"
        />
      </Form.Item>
      <Form.Item className="w-[100%]" name="date">
        <RangePicker className="h-[50px]" format={"MM-DD-YYYY"} />
      </Form.Item>
      <Form.Item name="status" className="w-[100%]">
        <Select placeholder="Status" className="h-[50px]">
          , PENDING, DONE, REJECTED
          <Select.Option key="WAITINGAPPROVAL" value="WAITING_APPROVAL">
            Waiting Approval
          </Select.Option>
          <Select.Option key="PENDING" value="PENDING">
            Pending
          </Select.Option>
          <Select.Option key="DONE" value="DONE">
            Done
          </Select.Option>
          <Select.Option key="REJECTED" value="REJECTED">
            Rejected
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item className="w-[100%]" name="vip_assistance">
        <Select placeholder="VIP Assistance" className="h-[50px]">
          <Select.Option key="yes" value="true">
            Yes
          </Select.Option>
          <Select.Option key="no" value="false">
            No
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item className="w-[100%]" name="needs_check">
        <Select placeholder="Needs Check" className="h-[50px]">
          <Select.Option key="yes" value="true">
            Yes
          </Select.Option>
          <Select.Option key="no" value="false">
            No
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item className="w-[100%]" name="is_new_car">
        <Select placeholder="New Car" className="h-[50px]">
          <Select.Option key="yes" value="true">
            Yes
          </Select.Option>
          <Select.Option key="no" value="false">
            No
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item className="w-[100%]" name="installment">
        <Select placeholder="Installment" className="h-[50px]">
          <Select.Option key="yes" value="true">
            Yes
          </Select.Option>
          <Select.Option key="no" value="false">
            No
          </Select.Option>
        </Select>
      </Form.Item>

      <div className="flex flex-row gap-5 justify-between">
        <Button
          size={"large"}
          htmlType="submit"
          shape="round"
          style={{ background: "#f1f5f9" }}
          className="font-semibold flex items-center "
        >
          Apply
        </Button>
        <Button
          size={"large"}
          shape="round"
          type="default"
          htmlType="button"
          onClick={onReset}
          style={{ background: "#f1f5f9" }}
          className="font-semibold flex items-center "
        >
          Reset
        </Button>
      </div>
    </Form>
  );
}
