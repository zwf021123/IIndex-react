import { userLogout } from '@/api/user';
import { LOCAL_USER } from '@/constants/user';
import { SpaceStore, userActions, userDerived } from '@/stores';
import type { AxiosError } from 'axios';
/**
 * 用户注销命令
 * @author zwf021123
 */
const logoutCommand: Command.CommandType = {
  func: 'logout',
  name: '退出登录',
  options: [],
  async action(options, terminal) {
    const { setLoginUser } = userActions;
    const { resetSpace } = SpaceStore();
    if (!userDerived.isLogin) {
      terminal.writeTextErrorResult('您还未登录');
      return;
    }

    try {
      const res: any = await userLogout();
      if (res?.code === 0) {
        setLoginUser(LOCAL_USER);
        resetSpace();
        terminal.writeTextSuccessResult('已退出登录,bye~');
      }
    } catch (error: AxiosError | any) {
      terminal.writeTextErrorResult('退出登录失败');
    }
  },
};

export default logoutCommand;
