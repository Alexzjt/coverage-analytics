import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '覆盖率统计',
    locale: false,
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '覆盖率详情',
      path: '/coverage-detail',
      component: './CoverageDetail',
    },
  ],
  npmClient: 'pnpm',
});
