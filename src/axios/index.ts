import axios from 'axios';
import vueInstance from '../views/permission/Role.vue';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { proxy } from '@/main';
import router from '@/router';

const config = {
  baseURL: 'http://127.0.0.1:3000/',
  changeOrigin: true
};

const $axios = axios.create(config);

$axios.interceptors.request.use((req: InternalAxiosRequestConfig<any>): any => {
  req.headers.set("token", localStorage.getItem("token"));
  return req;
});

$axios.interceptors.response.use((res: any): any => {
  return res;
}, (err: any) => {
  console.log(err)
  if (!err.response) {
    return;
  }
  const { response: { status = "?", data: { message }} } = err;
  if (status === 401) {
    proxy.$Modal.error({ content: message, title: "认证失败", onOk: () => { router.push('/login'); } });
  }
});

export default $axios;