import { userLogout } from '@/api/user';
import { LOCAL_USER } from '@/constants/user';
import { SpaceStore, UserStore } from '@/stores';
import { troggerExecuteUpdate } from '@/stores/modules/space';

/**
 * 用户注销命令
 * @author zwf021123
 */
const logoutCommand: Command.CommandType = {
  func: 'logout',
  name: '退出登录',
  options: [],
  async action(options, terminal) {
    const { setLoginUser, isLogin } = UserStore();
    const { resetSpace } = SpaceStore();
    if (!isLogin) {
      terminal.writeTextErrorResult('您还未登录');
      return;
    }
    const res: any = await userLogout();
    if (res?.code === 0) {
      troggerExecuteUpdate();
      setLoginUser(LOCAL_USER);
      resetSpace();
      terminal.writeTextSuccessResult('已退出登录,bye~');
    } else {
      terminal.writeTextErrorResult(res?.message ?? '退出登录失败');
    }
  },
};

export default logoutCommand;
