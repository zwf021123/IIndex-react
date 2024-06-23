import { userLogin } from '@/api/user';
import {
  SpaceStore,
  troggerExecuteUpdate,
  userActions,
  userDerived,
} from '@/stores';
import type { AxiosError } from 'axios';
/**
 * 用户登录命令
 * @author zwf021123
 */
const loginCommand: Command.CommandType = {
  func: 'login',
  name: '用户登录',
  options: [
    {
      key: 'username',
      desc: '用户名',
      alias: ['u'],
      type: 'string',
      required: true,
    },
    {
      key: 'password',
      desc: '密码',
      alias: ['p'],
      type: 'string',
      required: true,
      needHidden: true,
    },
  ],
  async action(options, terminal) {
    const { setLoginUser } = userActions;
    const { requestSpace } = SpaceStore();
    if (userDerived.isLogin) {
      terminal.writeTextErrorResult('请先退出登录');
      return;
    }
    const { username, password } = options;
    if (!username) {
      terminal.writeTextErrorResult('请输入用户名');
      return;
    }
    if (!password) {
      terminal.writeTextErrorResult('请输入密码');
      return;
    }

    try {
      const loginRes: any = await userLogin(username, password);
      if (loginRes?.code === 0) {
        troggerExecuteUpdate();
        setLoginUser(loginRes.data);
        requestSpace();
        terminal.writeTextSuccessResult('登录成功');
      }
    } catch (error: AxiosError | any) {
      terminal.writeTextErrorResult('登录失败');
    }
  },
};

export default loginCommand;
