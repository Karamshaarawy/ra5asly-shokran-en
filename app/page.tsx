"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const isAuth = localStorage.getItem("currentUser");
      const permissionList = localStorage.getItem("permissionList");
      if (isAuth == null || permissionList == null) {
        router.push("/auth/login");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") as string
      );
      const isAuth = currentUser?.access;
      if (isAuth) {
        router.push("/dashboard/carLicences");
      } else {
        localStorage.clear();
        router.push("/auth/login");
      }
    }
  }, [router]);
}
