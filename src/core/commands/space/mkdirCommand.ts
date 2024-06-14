import { SpaceStore } from '@/stores';

/**
 * 创建目录
 */
const mkdirCommand: Command.CommandType = {
  func: 'mkdir',
  name: '创建空间目录(在当前路径下)',
  params: [
    {
      key: 'dir',
      desc: '新目录名称',
      required: true,
    },
  ],
  options: [],
  async action(options, terminal): Promise<void> {
    const { _ } = options;
    if (_.length < 1) {
      terminal.writeTextErrorResult('参数不足');
      return;
    }
    const spaceStore = SpaceStore();
    const newDir = _[0];
    const item: Space.SpaceItemType = {
      dir: spaceStore.currentDir,
      name: newDir,
      type: 'dir',
    };
    try {
      await spaceStore.addItem(item);
      terminal.writeTextSuccessResult('创建成功');
    } catch (errMsg: any) {
      terminal.writeTextErrorResult(errMsg);
    }
  },
};

export default mkdirCommand;
