type ComponentOutputType = Terminal.ComponentOutputType;

/**
 * 查看网站本身信息命令
 * @author zwf021123
 */
export const infoCommand: Command.CommandType = {
  func: 'info',
  name: '查看本站信息',
  alias: ['author', 'about'],
  options: [],
  action(options, terminal): void {
    const output: ComponentOutputType = {
      type: 'component',
      component: () => import('./InfoBox.tsx'),
    };
    terminal.writeResult(output);
  },
};
