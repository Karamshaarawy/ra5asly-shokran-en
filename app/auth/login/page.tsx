"use client";
import { PostReq } from "@/app/api/api";
import { StatusSuccessCodes } from "@/app/api/successStatus";
import { Button, Form, Input, Skeleton, message } from "antd/lib";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
export default function LoginPage() {
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("currentUser");
      if (isAuth !== null) {
        router.push("/dashboard/carLicences");
      }
    }
  }, [router]);

  function login(values: any) {
    setLoading(true);
    PostReq(`auth/login/`, values).then((res) => {
      if (StatusSuccessCodes.includes(res.status)) {
        localStorage.setItem("currentUser", JSON.stringify(res?.data));
        router.push("../../dashboard/carLicences");
        setLoading(false);
      } else {
        setLoading(false);
        for (let key in res) {
          message.open({
            type: "error",
            content: res[key][0],
          });
        }
      }
    });
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 h-screen bg-white">
        <div className="md:flex md:items-center md:justify-end w-full bg-white sm:w-auto md:h-full md:w-1/3 py-8 px-4 sm:p-12 md:p-16 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none sm:bg-card">
          <div className="w-full max-w-80 sm:w-80 mx-auto sm:mx-0">
            <div className="w-auto">
              {/* <Image
              className="w-full"
              src="/images/logo-text.png"
              alt="Picture of the author"
              width={200}
              height={50}
            /> */}
            </div>
            <div className="mt-8 text-4xl font-extrabold tracking-tight leading-tight">
              Rakhasly Shokran.
              <br />
              Sign in
            </div>
            <Form
              className="mt-8"
              layout="vertical"
              name="control-hooks"
              onFinish={login}
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input style={{ backgroundColor: "white", color: "black" }} />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.Password
                  style={{ backgroundColor: "white", color: "black" }}
                />
              </Form.Item>
              <Form.Item className="flex flex-row justify-center">
                {!isLoading ? (
                  <Button
                    className="flex justify-center align-middle w-60"
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    size="large"
                    style={
                      {
                        // backgroundColor: "#20A7A0",
                        // borderColor: "#20A7A0",
                      }
                    }
                  >
                    Sign In
                  </Button>
                ) : (
                  <Skeleton.Button
                    active={true}
                    size="large"
                    shape="round"
                    block={true}
                  />
                )}
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="relative hidden md:flex flex-auto items-center justify-center w-1/4 h-full p-16 lg:px-28 overflow-hidden bg-no-repeat bg-center  bg-contain bg-[url('/images/log-in-bg.png')] dark:border-l"></div>
      </div>
    </div>
  );
}
