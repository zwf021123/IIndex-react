import { useState } from 'react';

/**
 * 查看历史功能
 * @param commandList
 * @param inputCommand
 */
export const useHistory = (
  commandList: Terminal.CommandOutputType[],
  inputCommand: Terminal.CommandInputType,
) => {
  /**
   * 当前查看的命令位置
   */
  const [commandHistoryPos, setCommandHistoryPos] = useState<number>(
    commandList.length,
  );

  const listCommandHistory = () => {
    return commandList;
  };

  // 在这里直接修改inputCommand可以成功？？？

  const showNextCommand = () => {
    console.log(commandHistoryPos, commandList, inputCommand);
    if (commandHistoryPos < commandList.length - 1) {
      setCommandHistoryPos(commandHistoryPos + 1);
      inputCommand.text = commandList[commandHistoryPos].text;
    } else if (commandHistoryPos === commandList.length - 1) {
      inputCommand.text = '';
      setCommandHistoryPos(commandHistoryPos + 1);
    }
  };

  const showPrevCommand = () => {
    console.log(commandHistoryPos, commandList, inputCommand);
    if (commandHistoryPos >= 1) {
      setCommandHistoryPos(commandHistoryPos - 1);
      inputCommand.text = commandList[commandHistoryPos].text;
    }
  };

  return {
    commandHistoryPos,
    setCommandHistoryPos,
    listCommandHistory,
    showNextCommand,
    showPrevCommand,
  };
};

export default useHistory;
