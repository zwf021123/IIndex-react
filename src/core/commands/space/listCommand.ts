import { SpaceStore } from '@/stores';

import { ParsedOptions } from 'getopts';

/**
 * 列举
 */
const listCommand: Command.CommandType = {
  func: 'list',
  name: '列举空间条目',
  alias: ['ls'],
  params: [
    {
      key: 'dir',
      desc: '目录',
    },
  ],
  options: [
    {
      key: 'recursive',
      desc: '是否递归列举',
      alias: ['r'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  collapsible: true,
  action(options: ParsedOptions, terminal): void {
    const { _, recursive } = options;
    const { getItem, listItems, currentDir } = SpaceStore();
    let dir = _[0] ?? currentDir;
    if (getItem(dir)?.type !== 'dir') {
      terminal.writeTextErrorResult('目录不存在');
      return;
    }
    const resultList = listItems(dir, recursive);
    resultList.forEach((item) => {
      let output = `${item.name} ${item.link}`;
      if (item.type === 'dir') {
        output = `<span style="color: lawngreen">${item.name}</span>`;
      }
      terminal.writeTextResult(output);
    });
  },
};

export default listCommand;
