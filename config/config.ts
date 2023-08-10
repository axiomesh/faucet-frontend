import { defineConfig } from 'umi';


const baseUrl = '/';

export default defineConfig({
  // antd: {},
  // access: {},
  // model: {},
  // initialState: {},
  // request: {},
  // layout: {},
  jsMinifier: 'terser',
  proxy: {
    '/api': {
      // target: 'http://10.1.40.179:8088/',
      // target: 'http://172.16.13.132:8080/',
      target: 'https://sepoliafaucet.com/',
      changeOrigin: true,
    },
  },
  base: baseUrl,
  publicPath: baseUrl,
  lessLoader: {
    javascriptEnabled: true,
  },
  locale: {
    antd: true,
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  hash: true,
  targets: {
    ie: 11,
    chrome: 49,
    firefox: 45,
    safari: 10,
    edge: 13,
    ios: 10,
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: '@/pages/home',
    },
  ],
  npmClient: 'yarn',
});