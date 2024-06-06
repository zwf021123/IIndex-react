import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    // configProvider
    configProvider: {},
    style: 'less',
    // 配置antd时间相关组件使用 MomentJS
  },
  valtio: {},
  routes: [
    {
      name: 'WebTerminal',
      path: '/',
      component: './IndexPage',
    },
  ],
  reactQuery: {},
  npmClient: 'pnpm',
});
