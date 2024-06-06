/**
 * 清屏命令
 * @author zwf021123
 */
export const clearCommand: Command.CommandType = {
  func: 'clear',
  name: '清屏',
  alias: ['cl'],
  options: [],
  action(options, terminal): void {
    // 延时，把当前这条 clear 命令也清掉
    setTimeout(() => {
      terminal.clear();
    }, 100);
  },
};
