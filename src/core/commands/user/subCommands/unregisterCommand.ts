/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 用户注销命令
 * @author zwf021123
 */
const logoutCommand: Command.CommandType = {
  func: 'unregister',
  name: '注销账号',
  options: [],
  async action(options, terminal) {},
};

export default logoutCommand;
