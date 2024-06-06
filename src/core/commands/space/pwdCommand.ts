import { SpaceStore } from '@/stores';

/**
 * 显示当前所在目录
 */
const pwdCommand: Command.CommandType = {
  func: 'pwd',
  name: '显示当前目录位置',
  options: [],
  action(options, terminal): void {
    const spaceStore = SpaceStore();
    const output = spaceStore.currentDir;
    terminal.writeTextResult(output);
  },
};

export default pwdCommand;
