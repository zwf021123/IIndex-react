import { SpaceStore } from '@/stores';

import { ParsedOptions } from 'getopts';

/**
 * 删除
 */
const removeCommand: Command.CommandType = {
  func: 'remove',
  name: '删除空间条目',
  alias: ['rm', 'delete', 'del'],
  params: [
    {
      key: 'item',
      desc: '要删除的条目路径',
      required: true,
    },
  ],
  options: [
    {
      key: 'recursive',
      desc: '是否递归删除',
      alias: ['r'],
      type: 'boolean',
      defaultValue: false,
    },
    {
      key: 'force',
      desc: '是否强制删除',
      alias: ['f'],
      type: 'boolean',
      defaultValue: false,
    },
  ],
  async action(options: ParsedOptions, terminal): Promise<void> {
    const spaceStore = SpaceStore();
    const { _, recursive = false, force } = options;
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足');
      return;
    }
    const deleteKey = _[0];
    const deleteItem = spaceStore.getItem(deleteKey);
    if (!deleteItem) {
      terminal.writeTextErrorResult('未找到该条目');
      return;
    }
    if (deleteItem.type === 'dir' && !recursive) {
      terminal.writeTextErrorResult('请确认是否递归删除');
      return;
    }
    if (recursive && !force) {
      terminal.writeTextErrorResult('请确认要强制删除');
      return;
    }
    try {
      await spaceStore.deleteItem(deleteKey, recursive);
      terminal.writeTextSuccessResult('删除成功');
    } catch (errMsg: any) {
      terminal.writeTextErrorResult(errMsg);
    }
  },
};

export default removeCommand;
