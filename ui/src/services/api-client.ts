import axios, { AxiosRequestConfig } from "axios";
import { BehaviorSubject, Observable, timer, of } from "rxjs";
import {
  map,
  filter,
  delayWhen,
  distinctUntilChanged,
  withLatestFrom,
} from "rxjs/operators";

import { objectize } from "./Reflective";

const ACCEPT_HDR = "Accept";
const APP_JSON_TYPE = "application/json";
const APP_FORM_DATA_TYPE = "multipart/form-data";

export class ApiPath {
  path: string | string[] = "";
  search: { [name: string]: string } = {};
  push(part: string): ApiPath {
    if (!(this.path instanceof Array)) this.path = [];
    this.path.push(part);
    return this;
  }
  isEmpty(): boolean {
    return this.path.length === 0;
  }
  toString(): string {
    return toPathString(this);
  }
}

export function toPathString(path: string | string[] | ApiPath): string {
  let pathStr: string;
  if ((path as any).path != null) {
    const ap = path as ApiPath;
    pathStr = toPathString(ap.path);
    const names = Object.keys(ap.search);
    if (names.length > 0) pathStr += "?";
    pathStr += names.map((p) => p + "=" + ap.search[p]).join("&");
  } else if (typeof path === "string") pathStr = path as string;
  else pathStr = (path as string[]).join("/");
  return pathStr;
}

const axiosConfig: AxiosRequestConfig = {
  headers: {
    ACCEPT_HDR: APP_JSON_TYPE
  }
}

async function request<T = any, R = any>(config: AxiosRequestConfig, constructor?: new () => any): Promise<T | any> {
  const resp = await axios(config);
  if (resp.statusText === "OK") {
    const obj = objectize(resp.data, constructor);
    return Promise.resolve(obj);
  }

  return resp;
};

export async function get<T = any, R = any>(url: string, constructor?: new () => any): Promise<R | any> {
  axiosConfig.method = "GET";
  axiosConfig.url = toPathString(url);
  return await request(axiosConfig, constructor)
};

export async function del<T = string>(url: string): Promise<T | any> {
  axiosConfig.method = "DELETE";
  axiosConfig.url = toPathString(url);
  return request(axiosConfig)
};

export async function put<T = string, R = any>(url: string, data?: any): Promise<R | any> {
  axiosConfig.method = "PUT";
  axiosConfig.url = toPathString(url);
  axiosConfig.data = data;
  return request(axiosConfig)
}

export async function post<T = string, R = any>(url: string, data?: any): Promise<R | any> {
  axiosConfig.method = "POST";
  axiosConfig.url = toPathString(url);
  axiosConfig.headers![ACCEPT_HDR] = APP_FORM_DATA_TYPE
  axiosConfig.data = data;
  return request(axiosConfig)
};

interface ErrorBody {
  [key: string]: any
}

export class HttpError {
  public status: number;
  public message: string;
  public errorBody?: ErrorBody;
  constructor(status: number, message: string, errorBody?: object) {
    this.status = status;
    this.message = message;
    this.errorBody = errorBody;
  }
}

export const online: BehaviorSubject<boolean | null> = new BehaviorSubject<
  boolean | null
>(null);
/** Delays offline emits. */
export const onlineDelayed: Observable<boolean> = online.pipe(
  filter((v) => v != null),
  distinctUntilChanged(),
  delayWhen((v) => (v === false ? timer(500) : of(undefined))),
  withLatestFrom(online),
  map(([off, online]) => (online || off) as boolean)
);