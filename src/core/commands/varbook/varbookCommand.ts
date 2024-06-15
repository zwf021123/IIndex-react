type ComponentOutputType = Terminal.ComponentOutputType;

/**
 * 变量命名命令
 * @author uiuing
 */
const varbookCommand: Command.CommandType = {
  func: 'varbook',
  name: 'varbook',
  desc: '变量命名助手，自动帮你取变量名',
  alias: ['vb', 'bianliang'],
  params: [
    {
      key: 'data',
      desc: '待转译为变量内容',
      required: true,
    },
  ],
  options: [],
  collapsible: true,
  action(options, terminal) {
    // const _ = options._.join(' ');
    // const searchText: string | boolean = checkSearchText(_, terminal);
    // if (!searchText) return;
    // const output: ComponentOutputType = {
    //   type: 'component',
    //   component: lazy(() => import('./VarbookBox')),
    //   props: {
    //     searchText,
    //   },
    // };
    terminal.writeTextErrorResult('该命令待维护中，暂不可用');
  },
};

export default varbookCommand;
