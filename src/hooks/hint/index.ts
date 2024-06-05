import { useTerminalConfigStore } from '@/stores';
import _, { trim } from 'lodash';
import { useState } from 'react';
import { commandMap } from '../../core/commandRegister';
import { getUsageStr } from '../../core/commands/terminal/help/helpUtils';

/**
 * 模糊查询
 */
const likeSearch = (keyword: string, commandMapParam: Object = commandMap) => {
  // 大小写无关
  let func = keyword.toLowerCase();
  // 前缀匹配
  const likeKey = Object.keys(commandMapParam).filter((key) =>
    key.startsWith(func),
  )[0];
  return likeKey;
};

/**
 * 命令提示功能
 * @author awf021123
 */
export const useHint = () => {
  const [hintValue, setHintValue] = useState('');
  // 记录匹配到的命令（便于后续提示操作）
  let command = null;
  const { showHint } = useTerminalConfigStore();

  const setHint = (inputText: string) => {
    // 未开启提示
    if (!showHint) {
      return;
    }
    if (!inputText) {
      setHintValue('');
      return;
    }
    const args = trim(inputText).split(/\s+/);

    const likeKey = likeSearch(args[0]);
    command = commandMap[likeKey];
    // 未匹配成功
    if (!command) {
      setHintValue('');
      return;
    }
    // 子命令提示
    if (
      command.subCommands &&
      Object.keys(command.subCommands).length > 0 &&
      args.length > 1
    ) {
      // 模糊查询子命令func(这里只能满足存在父子命令的情况)
      const likeKey = likeSearch(args[1], command.subCommands);
      const usageStr = getUsageStr(
        command.value.subCommands[likeKey],
        command.value,
      );
      setHintValue(usageStr);
      // 获取提示后再更新command
      command = command.subCommands[likeKey];
    } else {
      const usageStr = getUsageStr(command);
      setHintValue(usageStr);
    }
  };

  /**
   * 输入提示防抖
   */
  const debounceSetHint = _.debounce(function (inputText: string) {
    setHint(inputText);
  }, 200);

  return {
    hintValue,
    setHintValue,
    command,
    debounceSetHint,
  };
};
