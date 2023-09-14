import { defineConfig } from 'umi';
const baseUrl = '/';

export default defineConfig({
  title: 'AXM Faucet',
  jsMinifier: 'terser',
  proxy: {
    '/faucet': {
      target: 'http://172.16.30.82/',
      changeOrigin: true,
    },

    '/api': {
      target: 'http://172.16.13.126:18080/',
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
      path: '',
      redirect: '',
      component: '@/pages/home',
    },
  ],
  npmClient: 'yarn',
});