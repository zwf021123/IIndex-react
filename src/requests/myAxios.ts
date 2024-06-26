import { message } from 'antd';
import axios from 'axios';

// 自定义 axios 实例
const myAxios = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'http://106.53.22.27/api'
      : 'http://localhost:5000/api',
});

// 配置请求携带cookie
myAxios.defaults.withCredentials = true;

// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    console.log('请求响应：', response);
    // 对响应数据做点什么
    return response.data;
  },
  function (error) {
    console.log('响应错误', error);

    message.error(
      `${error.response.status}: ${
        error.response.data.message ||
        error.response.statusText ||
        error.message
      }`,
    );
    // if(error.response.status === 401){
    // message.error("error");
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);

export default myAxios;
