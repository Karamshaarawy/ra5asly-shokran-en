"use client";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, Tooltip } from "antd";
import Image from "next/image";
import { Badge, Dropdown, Space } from "antd/lib";
import { Footer, Header } from "antd/lib/layout/layout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import {
  FaCarSide,
  FaExpandArrowsAlt,
  FaIdCard,
  FaUserCircle,
} from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import {
  MdCircleNotifications,
  MdContacts,
  MdDashboard,
  MdDirectionsCar,
  MdLocalAirport,
  MdOutlineDeliveryDining,
  MdOutlineLocalPolice,
  MdOutlineMenuOpen,
  MdOutlineSecurity,
} from "react-icons/md";
import { LuLogOut } from "react-icons/lu";

interface LayoutProviderProps {
  children: React.ReactNode;
}
export default function AppLayout({ children }: LayoutProviderProps) {
  const router = useRouter();
  const { Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const pathname = usePathname();

  const navBarItems = [
    {
      key: "dashboard",
      label: (
        <Link href="/dashboard/govs" className="flex h-48px  items-center">
          <Space>
            <MdOutlineLocalPolice size={16} />
            Governrates & Licensing Units
          </Space>
        </Link>
      ),
    },
    {
      key: "Users",
      label: (
        <Link href="/dashboard/users" className="flex h-48px  items-center">
          <Space>
            <FaUsersLine size={16} />
            Users
          </Space>
        </Link>
      ),
    },
    {
      key: "driversLicenses",
      label: (
        <Link
          href="/dashboard/driverLicenses"
          className="flex h-48px  items-center"
        >
          <Space>
            <FaIdCard size={16} /> Drivers Licenses
          </Space>
        </Link>
      ),
    },
    {
      key: "carLicenses",
      label: (
        <Link
          href="/dashboard/carLicences"
          className="flex h-48px  items-center"
        >
          <Space>
            <FaCarSide size={16} />
            Car Licenses
          </Space>
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <Space onClick={logout}>
          <LuLogOut size={16} />
          Logout
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("currentUser")
    ) {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") as string
      );
    } else {
      router.push("/auth/login");
    }
  }, [pathname]);

  function logout() {
    localStorage.removeItem("currentUser");
    router.push("/auth/login");
  }
  return (
    <>
      {pathname.includes("dashboard") ? (
        <Layout>
          <Header className="bg-white flex flex-row justify-between w-full h-[50px] py-[2px] px-[50px]">
            <Link href="/dashboard" className="flex">
              <Image
                className="cursor-pointer"
                src="/R.png"
                alt="Logo image"
                width={45}
                height={45}
              />
            </Link>
            <h3 className=" ml-2 flex justify-start py-2 text-left w-full text-3xl font-bold">
              Ra5asly Shokran
            </h3>
          </Header>
          <Header className=" bg-white flex flex-row items-center h-[64px] py-[2px]">
            <Menu
              className="flex flex-row w-full"
              mode="horizontal"
              items={navBarItems}
              style={{ flex: 1, minWidth: 0 }}
            />
          </Header>
          <Content
            className="bg-[#e2e8f0] "
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: "91vh",
              borderRadius: "8px",
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ra5saly Shokran © {new Date().getFullYear()}
          </Footer>
        </Layout>
      ) : (
        children
      )}
    </>
  );
}
