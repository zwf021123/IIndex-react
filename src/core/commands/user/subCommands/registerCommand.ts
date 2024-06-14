import { userRegister } from '@/api/user';
import type { AxiosError } from 'axios';

/**
 * 用户注册命令
 * @author zwf021123
 */
const registerCommand: Command.CommandType = {
  func: 'register',
  name: '用户注册',
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
    {
      key: 'email',
      desc: '邮箱',
      alias: ['e'],
      type: 'string',
      required: true,
    },
  ],
  async action(options, terminal) {
    const { username, password, email } = options;
    if (!username) {
      terminal.writeTextErrorResult('请输入用户名');
      return;
    }
    if (!password) {
      terminal.writeTextErrorResult('请输入密码');
      return;
    }
    if (!email) {
      terminal.writeTextErrorResult('请输入邮箱');
      return;
    }
    try {
      const res: any = await userRegister(username, password, email);
      terminal.writeTextSuccessResult('注册成功');
    } catch (error: AxiosError | any) {
      terminal.writeTextErrorResult(error.response.message ?? '注册失败');
    }
  },
};

export default registerCommand;
