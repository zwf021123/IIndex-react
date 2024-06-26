import { getLoginUser } from '@/api/user';
import { LOCAL_USER } from '@/constants/user';
import { derive, proxy, subscribe } from '@umijs/max';
import { SpaceStore } from './space';

export const userStore = proxy(
  JSON.parse(String(localStorage.getItem('user-store'))) || {
    loginUser: {
      ...LOCAL_USER,
    },
  },
);

export const userActions = {
  async getAndSetLoginUser() {
    const { requestSpace } = SpaceStore();
    try {
      const res: any = await getLoginUser();
      if (res?.code === 0 && res.data) {
        userStore.loginUser = res.data;
        // 登录成功后，同时请求用户的空间信息
        requestSpace();
      }
    } catch (e) {
      userActions.resetLoginUser();
    }
  },
  setLoginUser(user: User.UserType) {
    userStore.loginUser = user;
  },
  resetLoginUser() {
    userStore.loginUser = { ...LOCAL_USER };
  },
};
// 计算属性
export const userDerived = derive({
  isLogin: (get) => !!get(userStore).loginUser.id,
});
// 订阅
subscribe(userStore, () => {
  console.log('userStore changed', userStore);
  localStorage.setItem('user-store', JSON.stringify(userStore));
});

export const UserStore = () => {
  return {
    ...userActions,
    ...userStore,
  };
};
