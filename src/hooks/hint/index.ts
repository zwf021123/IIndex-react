import { commandMap } from '@/core/commandRegister';
import { configStore } from '@/stores';
import { likeSearch } from '@/utils/likeSearch';
import { getUsageStr } from '@/utils/output';
import _, { trim } from 'lodash';
import { useRef, useState } from 'react';

/**
 * 命令提示功能
 * @author awf021123
 */
export const useHint = () => {
  /**
   * store
   */
  const { showHint } = configStore;

  const [hintValue, setHintValue] = useState('');
  // 记录匹配到的命令（便于后续提示操作）
  // const inputCommandSnap = useRef<Terminal.CommandInputType | null>(null);
  const command = useRef<Command.CommandType | null>(null);

  // useEffect(() => {
  //   // 同步inputCommand
  //   inputCommandSnap.current = inputCommand;
  // }, [inputCommand]);

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
    command.current = commandMap[likeKey];
    // 未匹配成功
    if (!command.current) {
      setHintValue('');
      return;
    }
    // console.log('setHint command.current', command.current, inputText);
    // 子命令提示
    if (
      command.current.subCommands &&
      Object.keys(command.current.subCommands).length > 0 &&
      args.length > 1
    ) {
      // 模糊查询子命令func(这里只能满足存在父子命令的情况)
      const likeKey = likeSearch(args[1], command.current.subCommands);
      const usageStr = getUsageStr(
        command.current.subCommands[likeKey],
        command.current,
      );

      setHintValue(usageStr);
      // 获取提示后再更新command
      command.current = command.current.subCommands[likeKey];
    } else {
      const usageStr = getUsageStr(command.current);
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
    matchedCommand: command,
    debounceSetHint,
  };
};
