import { lazy } from 'react';

type ComponentOutputType = Terminal.ComponentOutputType;

/**
 * DDOS 命令（整活）
 * @author zwf021123
 */
const ddosCommand: Command.CommandType = {
  func: 'ddos',
  name: 'ddos',
  desc: '发起网络攻击，慎用！',
  options: [],
  action(options, terminal) {
    const output: ComponentOutputType = {
      type: 'component',
      component: lazy(() => import('./DdosBox')),
      props: {},
    };
    terminal.writeResult(output);
  },
};

export default ddosCommand;
