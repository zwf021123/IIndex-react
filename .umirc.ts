import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    // configProvider
    configProvider: {},
    // themes
    // dark: true,
    // compact: true,
    // babel-plugin-import
    // import: true,
    // less or css, default less
    style: 'less',
    // shortcut of `configProvider.theme`
    // use to configure theme token, antd v5 only
    // theme: {},
    // antd <App /> valid for version 5.1.0 or higher, default: undefined
    // appConfig: {},
    // 配置antd时间相关组件使用 MomentJS
    momentPicker: true,
  },
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
