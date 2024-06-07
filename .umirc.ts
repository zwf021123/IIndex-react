import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    // configProvider
    configProvider: {},
    style: 'less',
    styleProvider: {
      hashPriority: 'high',
      legacyTransformer: true,
    },
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
