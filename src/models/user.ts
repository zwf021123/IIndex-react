import { getLoginUser } from '@/api/user';
import { LOCAL_USER } from '@/constants/user';

const useUser = {
  state: {
    loginUser: { ...LOCAL_USER },
  },
  effects: {
    *getAndSetLoginUser({ payload }, { put }) {
      // 从space store中获取请求space的方法
      // const { requestSpace } = useSpaceStore();
      const res = yield getLoginUser();
    },
  },
  reducers: {},
};

export default useUser;
