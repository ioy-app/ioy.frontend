import Store, { dispatch } from "@/stories";
import { setToken } from "@/stories/login";

import Routes, { apiInstance } from "./routes";

export default async function fetchAPI(
    path: string,
    init?: RequestInit
) {
    const token: string | null = Store.getState()?.login?.token;
    const obj = init || {};

    if (!obj.headers)
        obj.headers = {}
    
    if (token)
      obj.headers.Authorization = `Bearer ${token}`;
        

    if (obj?.headers?.["Content-Type"] == "no-content")
        delete obj.headers["Content-Type"];
    else {
        obj.headers["Content-Type"] = "application/json";
    }

    const result = await apiInstance({
        url: path,
        ...obj
    });

    // if (!result.ok) {

    //     switch(result.status) {
    //         case 404: {
    //           return result;
    //         } break;
    //         case 403: {
    //             dispatch(setToken(null));
    //             throw new Error(json?.data?.msg);
    //         } break;
    //     }
    // }

    return result;
}

function jsonToFormData(obj: any, parentKey = ''): FormData {
  const formData = new FormData();

  const process = (value: any, key: string) => {
    if (value == null) return;

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        process(item, `${key}[${i}]`);
      });
    } else if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
      Object.entries(value).forEach(([k, v]) => {
        process(v, `${key}[${k}]`);
      });
    } else {
      formData.append(key, value);
    }
  };

  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    Object.entries(obj).forEach(([key, value]) => {
      process(value, parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    // Если передали не объект — просто добавить
    formData.append(parentKey, obj);
  }

  return formData;
}

export {
    Routes,
    jsonToFormData
}