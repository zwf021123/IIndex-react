// 运行时配置
import '@/styles/global.less';
import { RuntimeReactQueryType } from 'umi';

export const reactQuery: RuntimeReactQueryType = {
  devtool: {
    initialIsOpen: false,
    position: 'bottom-right',
  },
  queryClient: {
    defaultOptions: {
      queries: {
        // 🟡 此配置具有的表现往往令人出乎意料，若无特殊需求，请默认关闭
        refetchOnWindowFocus: false,
      },
    },
  },
};

export default {
  reactQuery: {
    ...reactQuery,
  },
};
