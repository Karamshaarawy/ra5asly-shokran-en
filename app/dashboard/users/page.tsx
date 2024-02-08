"use client";
import { DeleteReq, GetReq, PatchReq, PostReq } from "../../api/api";
import { StatusSuccessCodes } from "../../api/successStatus";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  message,
} from "antd/lib";
import { ColumnsType } from "antd/lib/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<any[] | []>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userForm] = Form.useForm();
  const [edit, setEdit] = useState<any>(false);
  const [id, setId] = useState<any>("");
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (_, { name }) => (name ? name : "-"),
    },
    {
      title: "User Name",
      key: "username",
      dataIndex: "username",
      render: (_, { username }) => (username ? username : "-"),
    },
    {
      title: "First Name",
      key: "firstName",
      dataIndex: "first_name",
      render: (_, { first_name }) => (first_name ? first_name : "-"),
    },
    {
      title: "Last Name",
      key: "lastName",
      dataIndex: "last_name",
      render: (_, { last_name }) => (last_name ? last_name : "-"),
    },
    {
      title: "Phone",
      key: "phone",
      dataIndex: "phone",
      render: (_, { phone }) => (phone ? phone : "-"),
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      render: (_, { email }) => (email ? email : "-"),
    },
    {
      title: "Super User",
      key: "superUser",
      dataIndex: "is_superuser",
      render: (_, { is_superuser }) => (is_superuser ? "yes" : "No"),
    },
    {
      title: "Staff",
      key: "isStaff",
      dataIndex: "is_staff",
      render: (_, { is_staff }) => (is_staff ? "Yes" : "No"),
    },
    {
      title: "Status",
      key: "isActive",
      dataIndex: "is_active",
      render: (_, { is_active }) => (is_active ? "Active" : "InActive"),
    },
    // { title: "Password", key: "password", dataIndex: "password" },
    {
      title: "Last Login",
      key: "lastLogin",
      dataIndex: "last_login",
      render: (_, { last_login }) =>
        last_login
          ? new Date(last_login).toLocaleString("en", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
    },
    {
      title: "Joind At",
      key: "dateJoined",
      dataIndex: "date_joined",
      render: (_, { date_joined }) =>
        date_joined
          ? new Date(date_joined).toLocaleString("en", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
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
      title: "Groups",
      key: "groups",
      dataIndex: "groups",
      render: (_, { groups }) => (groups.length > 0 ? groups : "-"),
    },
    {
      title: "Permissions",
      key: "userPermission",
      dataIndex: "user_permissions",
      render: (_, { user_permissions }) =>
        user_permissions.length > 0 ? user_permissions : "-",
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
          okButtonProps={{
            style: { backgroundColor: "#20A7A0", color: "#ffffffd4" },
          }}
        >
          <FaTrash
            className="cursor-pointer text-red-600"
            size={24}
            color="rgb(239, 68, 68)"
          />
        </Popconfirm>
      ),
    },
  ];

  useEffect(() => {
    getUsersList("");
  }, []);

  function getUsersList(values: any) {
    let url = `users/?`;
    if (typeof values !== "string") {
      values.forEach((value: any, key: any) => (url += `&${key}=${value}`));
    }
    setIsLoading(true);
    GetReq(url).then((res) => {
      if (StatusSuccessCodes.includes(res?.status)) {
        setUsersList(res?.data?.results);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        res?.errors?.forEach((err: any) => {
          message.error(`${err?.attr + ":" + err?.detail} `);
        });
      }
    });
  }

  function deleteRowHandler(record: any) {
    setIsLoading(true);
    DeleteReq(`users/${record.id}/`).then((res: any) => {
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

  function editRowHandler(record: any) {
    console.log(record);
    setIsModalOpen(true);
    userForm.setFieldsValue({
      name: record.name,
      username: record.username,
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      phone: record.phone,
      password: record.password,
      is_superuser: record.is_superuser,
      is_staff: record.is_staff,
      is_active: record.is_active,
      groups: record.groups,
      user_permission: record.user_permission,
    });
    setEdit(true);
    setId(record.id);
  }

  function addUserModal() {
    userForm.resetFields();
    setIsModalOpen(true);
  }
  function addEditUser(values: any) {
    setIsLoading(true);
    if (edit) {
      PatchReq(`users/${id}/`, values).then((res) => {
        if (StatusSuccessCodes.includes(res.status)) {
          setIsLoading(false);
          setIsModalOpen(false);
          message.success("User Editted Successfully");
          setId("");
          setEdit(false);
          getUsersList("");
        } else {
          setIsLoading(false);
          res?.errors?.forEach((err: any) => {
            message.error(`${err?.attr + ":" + err?.detail} `);
          });
        }
      });
    } else {
      PostReq(`users/`, values).then((res) => {
        if (StatusSuccessCodes.includes(res.status)) {
          message.success("User Added Successfully");
          getUsersList("");
          setIsLoading(false);
          setIsModalOpen(false);
        } else {
          setIsLoading(false);
          res?.errors?.forEach((err: any) => {
            message.error(`${err?.attr + ":" + err?.detail} `);
          });
        }
      });
    }
  }

  function closeModal() {
    userForm.resetFields();
    setIsModalOpen(false);
    setEdit(false);
    setId("");
  }
  function search(values: any) {
    getUsersList(values);
  }
  return (
    <Fragment>
      <div className="bg-[#f1f5f9] border rounded-lg shadow-sm p-5">
        <div id="title ">
          <h3 className="flex justify-start py-2 text-left w-full text-black text-3xl font-bold">
            Users
          </h3>
        </div>

        <div className="flex  justify-end">
          <Button
            size={"large"}
            shape="round"
            className="m-3"
            onClick={addUserModal}
          >
            Add User
          </Button>
        </div>
        <Suspense>
          <Search getData={search} />
        </Suspense>
        <div className="w-full max-h-screen overflow-x-scroll lg:overflow-x-auto md:overflow-x-scroll sm:overflow-x-scroll">
          <Table
            dataSource={usersList}
            rowKey={"id"}
            columns={columns}
            scroll={{ x: 0 }}
            loading={isLoading}
          />
        </div>
        <Modal
          title={edit ? "Edit User" : "Add User"}
          open={isModalOpen}
          footer={null}
          onCancel={closeModal}
        >
          <Form
            autoComplete="off"
            form={userForm}
            layout="vertical"
            onFinish={addEditUser}
          >
            <div className="grid grid-cols-2 gap-5">
              <Form.Item name="name" label="Name:" rules={[{ required: true }]}>
                <Input placeholder="Name" autoComplete="off" />
              </Form.Item>

              <Form.Item
                name="username"
                label="User Name:"
                rules={[{ required: true }]}
              >
                <Input placeholder="User Name" />
              </Form.Item>

              <Form.Item name="first_name" label="First Name:">
                <Input placeholder="First Name" />
              </Form.Item>

              <Form.Item name="last_name" label="Last Name:">
                <Input placeholder="Last Name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email:"
                rules={[{ required: true }]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone:"
                rules={[{ required: true }]}
              >
                <Input placeholder="Phone" />
              </Form.Item>

              <Form.Item
                label="Password:"
                name="password"
                rules={[{ required: true }]}
              >
                <Input.Password placeholder="password" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-3">
              <Form.Item
                name="is_superuser"
                // label="Is Admin"
                valuePropName="checked"
              >
                <Checkbox>Super User</Checkbox>
              </Form.Item>

              <Form.Item
                name="is_staff"
                //  label="Is Staff"
                valuePropName="checked"
              >
                <Checkbox defaultChecked={false}>Staff</Checkbox>
              </Form.Item>

              <Form.Item
                name="is_active"
                valuePropName="checked"
                // label="Is Active"
              >
                <Checkbox>Active</Checkbox>
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
                  {edit ? "Edit User " : "Add User"}
                </Button>
                <Button size={"large"} shape="round" onClick={closeModal}>
                  Cancel
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </div>
    </Fragment>
  );
}

function Search(props: any) {
  const getData = props.getData;
  const searchParams = useSearchParams();
  const [searchForm] = Form.useForm();
  const params = new URLSearchParams(searchParams);
  const { replace } = useRouter();
  const pathname = usePathname();
  // const { RangePicker } = DatePicker;

  const onReset = () => {
    searchForm.resetFields();
    params.forEach((value, key) => params.delete(`${key}`));
    replace(`${pathname}`);
    getData(params);
  };

  function onFinish(values: any) {
    // let from_date = 0;
    // let to_date = 0;
    // if (values.date) {
    //   from_date = Date.parse(values.date[0]);
    //   to_date = Date.parse(values.date[1]);
    //   params.set("from_date", from_date.toString());
    //   params.set("to_date", to_date.toString());
    // } else {
    //   params.delete("from_date");
    //   params.delete("to_date");
    // }
    if (values.search) {
      params.set("search", values.search);
    } else {
      params.delete("search");
    }

    if (values.is_active) {
      params.set("is_active", values.is_active);
    } else {
      params.delete("is_active");
    }
    if (values.is_staff) {
      params.set("is_staff", values.is_staff);
    } else {
      params.delete("is_staff");
    }

    // if (values.vip_assistance) {
    //   params.set("vip_assistance", values.vip_assistance);
    // } else {
    //   params.delete("vip_assistance");
    // }

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
      {/* <Form.Item className="w-[100%]" name="date">
        <RangePicker className="h-[50px]" format={"MM-DD-YYYY"} />
      </Form.Item> */}
      <Form.Item name="is_active" className="w-[100%]">
        <Select placeholder="Status" className="h-[50px]">
          <Select.Option key="active" value="true">
            Active
          </Select.Option>
          <Select.Option key="inactive" value="false">
            InActive
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item className="w-[100%]" name="is_staff">
        <Select placeholder="Staff" className="h-[50px]">
          <Select.Option key="yes" value="true">
            Yes
          </Select.Option>
          <Select.Option key="no" value="false">
            No
          </Select.Option>
        </Select>
      </Form.Item>
      {/* <Form.Item className="w-[100%]" name="installment">
        <Select placeholder="Installment" className="h-[50px]">
          <Select.Option key="yes" value="true">
            Yes
          </Select.Option>
          <Select.Option key="no" value="false">
            No
          </Select.Option>
        </Select>
      </Form.Item> */}

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
          type="default"
          htmlType="button"
          onClick={onReset}
          shape="round"
          style={{ background: "#f1f5f9" }}
          className="font-semibold flex items-center "
        >
          Reset
        </Button>
      </div>
    </Form>
  );
}
