"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const isAuth = localStorage.getItem("currentUser");
      if (isAuth == null) {
        router.push("/auth/login");
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);
  return <></>;
}
