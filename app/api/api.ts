"use client";
import { message } from "antd/lib";
import axios from "axios";
import { StatusSuccessCodes } from "./successStatus";
const baseUrl = "https://amrtarkhan.pythonanywhere.com/";

export function setAuthorizationToken(token?: string) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return;
  }
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("currentUser") as string);
    const userToken = user?.access;
    if (userToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    } else {
      axios.defaults.headers.common["Authorization"] = null;
    }
  }
  return;
}
setAuthorizationToken();

function handelBaseUrl(path: string) {
  if (path.includes("auth")) {
    return baseUrl + path;
  } else {
    return `${baseUrl}api/v1/${path}`;
  }
}

export function handelErrors(err: any) {
  console.log(err);
  if (err.response?.status == 404) {
    //window.location.href = "/404";
  } else if (
    err.response?.data?.detail === "not_authenticated" ||
    err.response?.data?.detail === "token_not_valid" ||
    err.response?.data?.detail === "authentication_failed"
  ) {
    localStorage.removeItem("currentUser");
    window.location.href = "/auth/login";
  }
  return err.response?.data;
}

export function GetReq(path: string) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .get(handelBaseUrl(path))
    .catch(handelErrors);
  return res;
}

export function GetByIdReq(path: string) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .get(handelBaseUrl(path))
    .catch(handelErrors);

  return res;
}

export function PostReq(path: string, body: any) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .post(handelBaseUrl(path), body)
    .catch(handelErrors);
  return res;
}

export function PutReq(path: string, body: any) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .put(handelBaseUrl(path), body)
    .catch(handelErrors);

  return res;
}

export function PatchReq(path: string, body: any) {
  setAuthorizationToken();
  const res = axios
    .create({ baseURL: baseUrl })
    .patch(handelBaseUrl(path), body)
    .catch(handelErrors);
  return res;
}

export function DeleteReq(path: string) {
  const res = axios
    .create({ baseURL: baseUrl })
    .delete(handelBaseUrl(path))
    .catch(handelErrors);

  return res;
}
