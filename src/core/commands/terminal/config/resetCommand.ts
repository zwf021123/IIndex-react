import { TerminalConfigStore } from '@/stores';

/**
 * 重置配置
 * @author zwf021123
 */
export const resetCommand: Command.CommandType = {
  func: 'reset',
  name: '重置终端配置',
  alias: [],
  options: [],
  action(options, terminal): void {
    const { reset } = TerminalConfigStore();
    reset();
    terminal.writeTextSuccessResult('已重置终端配置');
  },
};
