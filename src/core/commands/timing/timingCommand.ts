import { lazy } from 'react';

type ComponentOutputType = Terminal.ComponentOutputType;

/**
 * 定时命令
 * @author zwf021123
 */
const timingCommand: Command.CommandType = {
  func: 'timing',
  name: '定时器',
  options: [
    {
      key: 'seconds',
      desc: '秒数',
      alias: ['s'],
      type: 'string',
      required: true,
    },
  ],
  action(options, terminal) {
    const { seconds } = options;
    if (!seconds) {
      terminal.writeTextErrorResult('参数不足');
      return;
    }
    const output: ComponentOutputType = {
      type: 'component',
      component: lazy(() => import('./TimingBox')),
      props: {
        seconds,
      },
    };
    terminal.writeResult(output);
  },
};

export default timingCommand;
