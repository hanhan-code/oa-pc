import axios from "axios";
import router from "@/router/routers";
import { Notification, MessageBox } from "element-ui";
import store from "../store";
import { getToken } from "@/utils/auth";
import Config from "@/config";
import el from "element-ui/src/locale/lang/el";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: Config.timeout // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    const code = response.status;
    if (code < 200 || code > 300) {
      Notification.error({
        title: response.message
      });
      return Promise.reject("error");
    } else if (code === 401) {
      router.push("/login");
      store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    } else {
      return response.data;
    }
  },
  error => {
    let code = error.response.data.status === 401 || error.response.status === 401;
    console.log(error.response);

    if (code) {
      router.push("/login");
      store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }

    try {
      code = error.response.data.status;
    } catch (e) {
      if (error.toString().indexOf("Error: timeout") !== -1) {
        Notification.error({
          title: "网络请求超时",
          duration: 2500
        });
        return Promise.reject(error);
      }
      if (error.toString().indexOf("Error: Network Error") !== -1) {
        Notification.error({
          title: "网络请求错误",
          duration: 2500
        });
        return Promise.reject(error);
      }
    }
    if (code === 401) {
      MessageBox.confirm(
        "登录状态已过期，您可以继续留在该页面，或者重新登录",
        "系统提示",
        {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        store.dispatch("LogOut").then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      });
    } else if (code === 403) {
      router.push({ path: "/401" });
    } else {
      console.log(error);
      let msg = undefined;

      if (error.response.data.message) {
        msg = error.response.data.message
          .toString()
          .replace(new RegExp("[a-zA-Z.:]", "gm"), "");
      } else {
        msg = error.response.data.msg
          .toString()
          .replace(new RegExp("[a-zA-Z.:]", "gm"), "");
      }

      if (msg !== undefined) {
        Notification.error({
          title: msg,
          duration: 2500
        });
      }
    }
    return Promise.reject(error);
  }
);
export default service;
