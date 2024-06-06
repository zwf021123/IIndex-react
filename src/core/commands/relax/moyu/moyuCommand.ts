type ComponentOutputType = Terminal.ComponentOutputType;

/**
 * 摸鱼命令
 * @author zwf021123
 */
const moyuCommand: Command.CommandType = {
  func: 'moyu',
  name: '摸鱼',
  options: [],
  collapsible: true,
  action(options, terminal) {
    const output: ComponentOutputType = {
      type: 'component',
      component: () => import('./MoYuBox'),
      props: {},
    };
    terminal.writeResult(output);
  },
};

export default moyuCommand;
