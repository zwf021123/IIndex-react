import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  // access: {},
  // model: {},
  // initialState: {},
  // request: {},
  // layout: {
  //   title: '@umijs/max',
  // },
  // {
  //   path: '/',
  //   redirect: '/home',
  // },
  routes: [
    {
      name: 'WebTerminal',
      path: '/',
      component: './IndexPage',
    },
  ],
  npmClient: 'pnpm',
});
