import { lazy } from 'react';
import addCommand from './subCommands/addCommand';
type ComponentOutputType = Terminal.ComponentOutputType;

/**
 * 待办事项命令
 * @author zwf021123
 */
const todoCommand: Command.CommandType = {
  func: 'todo',
  name: '待办事项',
  desc: '记录和管理任务',
  params: [
    {
      key: 'subCommand',
      desc: '子命令',
      required: true,
    },
  ],
  options: [],
  subCommands: {
    add: addCommand,
  },
  collapsible: true,
  action(options, terminal) {
    const { _ } = options;
    if (_.length < 1) {
      const output: ComponentOutputType = {
        type: 'component',
        component: lazy(() => import('./TodoBox')),
      };
      terminal.writeResult(output);
      return;
    }
  },
};

export default todoCommand;
