import { lazy } from 'react';

type ComponentOutputType = Terminal.ComponentOutputType;

/**
 * 快捷键命令
 * @author zwf021123
 */
export const shortcutCommand: Command.CommandType = {
  func: 'shortcut',
  name: '快捷键',
  desc: '查看快捷键',
  alias: [],
  params: [],
  options: [],
  collapsible: true,
  action(options, terminal): void {
    const output: ComponentOutputType = {
      type: 'component',
      component: lazy(() => import('./ShortcutBox')),
    };
    terminal.writeResult(output);
  },
};
