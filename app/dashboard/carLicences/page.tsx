"use client";
import TextArea from "antd/es/input/TextArea";
import { DeleteReq, GetReq, PatchReq } from "../../api/api";
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
  Modal,
  Tooltip,
  Rate,
} from "antd/lib";
import Table, { ColumnsType } from "antd/lib/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { MdModeEditOutline } from "react-icons/md";

export default function CarLicenses() {
  const searchParams = useSearchParams();
  const [searchForm] = Form.useForm();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  const { RangePicker } = DatePicker;
  const [id, setId] = useState<any>("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [userForm] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[] | []>([]);

  const columns: ColumnsType<any> = [
    {
      title: "User",
      key: "user",
      dataIndex: ["user", "name"],
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
      render: (_, { visit_slot }) => (visit_slot ? visit_slot : "-"),
    },
    {
      title: "VIP Assistance",
      key: "vip_assistance",
      render: (_, { vip_assistance }) =>
        vip_assistance === true ? "Yes" : "No",
    },
    {
      title: "Installment",
      key: "installment",
      render: (_, { installment }) => (installment === true ? "Yes" : "No"),
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
      render: (_, record) =>
        record.contract ? (
          <Image
            alt="Contract Image"
            width={70}
            src={record.license_id_image}
            fallback="/images/no-preview.jpeg"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "License Image",
      key: "license_id_image",
      dataIndex: "license_id_image",
      render: (_, record) =>
        record.license_id_image ? (
          <Image
            alt="License Image"
            width={70}
            src={record.license_id_image}
            fallback="/images/no-preview.jpeg"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "National Id Image",
      key: "national_id_image",
      dataIndex: "national_id_image",
      render: (_, record) =>
        record.national_id_image ? (
          <Image
            alt="National Id Image"
            width={70}
            src={record.national_id_image}
            fallback="/images/no-preview.jpeg"
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (_, { price }) => (price ? price : "-"),
    },
    {
      title: "Licensing Unit",
      key: "licensing_unit",
      dataIndex: ["licensing_unit", "name"],
    },
    {
      title: "Notes",
      key: "notes",
      dataIndex: "notes",
    },
    {
      title: "Rating",
      key: "rating",
      dataIndex: ["rating", "rating"],
    },
    {
      title: "Rating Comment",
      key: "rating",
      dataIndex: ["rating", "comment"],
    },
    {
      title: "Edit",
      key: "edit",
      render: (_: {}, record: { id: number }) => (
        <MdModeEditOutline
          onClick={() => {
            editRowHandler(record);
          }}
          className="cursor-pointer text-sky-600"
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

  function editRowHandler(record: any) {
    setIsEditModalOpen(true);
    userForm.setFieldsValue({ status: record.status, price: record.price });
    setId(record.id);
  }

  function deleteRowHandler(record: any) {
    setIsLoading(true);
    DeleteReq(`car-license/${record.id}/`).then((res: any) => {
      if (StatusSuccessCodes.includes(res.status)) {
        setIsLoading(false);
        message.success("Record Deleted Successfully");
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
  useEffect(() => {
    getData();
  }, []);

  function getData(values: any = "") {
    let url = `car-license/?`;
    params.forEach((value: any, key: any) => (url += `&${key}=${value}`));
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

  // function search(values: any) {
  //   getData(values);
  // }

  function closeModal() {
    userForm.resetFields();
    setIsEditModalOpen(false);
    setId("");
  }

  function editLicense(values: any) {
    PatchReq(`car-license/${id}/`, values).then((res) => {
      if (StatusSuccessCodes.includes(res?.status)) {
        message.success("Updated Successfully");
        setIsLoading(false);
        getData();
        closeModal();
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

  function searchChange(event: any) {
    if (event.target.value.length === 0) {
      onReset();
    }
  }
  const onReset = () => {
    params.has("search") && params.delete("search");
    params.has("to_date") && params.delete("to_date");
    params.has("from_date") && params.delete("from_date");
    params.has("status") && params.delete("status");
    params.has("needs_check") && params.delete("needs_check");
    params.has("is_new_car") && params.delete("is_new_car");
    params.has("vip_assistance") && params.delete("vip_assistance");
    params.has("installment") && params.delete("installment");
    replace(`${pathname}`);
    searchForm.resetFields();

    getData();
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
    <div>
      <div className="bg-[#f1f5f9] border rounded-lg shadow-sm p-5">
        <div>
          <h3 className="flex justify-start py-5 text-black text-left w-full text-3xl font-bold">
            Car Licenses
          </h3>
        </div>
        {/* <Suspense>
          <Search getData={search} />
        </Suspense> */}
        <Form
          form={searchForm}
          className={
            "gap-3 mb-5 items-baseline flex flex-col md:flex-row lg:flex-row"
          }
          onFinish={onFinish}
          onChange={searchChange}
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
              <Select.Option key="CANCELLED" value="CANCELLED">
                Cancelled
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
      <Modal
        title={"Edit"}
        open={isEditModalOpen}
        footer={null}
        onCancel={closeModal}
      >
        <Form
          autoComplete="off"
          form={userForm}
          layout="vertical"
          onFinish={editLicense}
        >
          <div className="grid grid-cols-2 gap-5">
            <Form.Item
              name="status"
              label="Status:"
              rules={[{ required: true }]}
            >
              <Select placeholder="Status" className="h-[50px]">
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
                <Select.Option key="CANCELLED" value="CANCELLED">
                  Cancelled
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="price" label="price:" rules={[{ required: true }]}>
              <Input
                className="h-[50px]"
                placeholder="price"
                min={0}
                type="number"
              />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Notes:">
            <TextArea placeholder="Notes" />
          </Form.Item>

          <div className="flex justify-end  ">
            <Form.Item>
              <Button
                size={"large"}
                shape="round"
                className="mr-5"
                htmlType="submit"
              >
                Apply
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

function Search(props: any) {
  const getData = props.getData;
  const searchParams = useSearchParams();
  const [searchForm] = Form.useForm();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  const { RangePicker } = DatePicker;

  function searchChange(event: any) {
    if (event.target.value.length === 0) {
      onReset();
    }
  }
  const onReset = () => {
    searchForm.resetFields();
    params.forEach((value, key) => params.delete(`${key}`));
    replace(`${pathname}`);
    getData();
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
      onChange={searchChange}
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
          <Select.Option key="CANCELLED" value="CANCELLED">
            Cancelled
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
