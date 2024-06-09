import { initCommand } from '@/constants';
import { useEffect, useRef } from 'react';

/**
 * 查看历史功能
 * @param commandList
 * @param inputCommand
 */
export const useHistory = (
  commandList: Terminal.CommandOutputType[],
  inputCommand: Terminal.CommandInputType,
  setInputCommand: (inputCommand: Terminal.CommandInputType) => void,
) => {
  const commandHistoryPos = useRef(commandList.length);
  const commandListSnap = useRef(commandList);

  const setCommandHistoryPos = (pos: number) => {
    commandHistoryPos.current = pos;
  };

  useEffect(() => {
    commandHistoryPos.current = commandList.length;
    commandListSnap.current = commandList;
    // 获取最新state值
  }, [commandList]);

  const listCommandHistory = () => {
    return commandListSnap.current;
  };

  const showNextCommand = () => {
    // console.log(commandHistoryPos, inputCommand);
    if (commandHistoryPos.current < commandListSnap.current.length - 1) {
      setCommandHistoryPos(commandHistoryPos.current + 1);
      setInputCommand({
        ...inputCommand,
        text: commandListSnap.current[commandHistoryPos.current].text,
      });
    } else if (
      commandHistoryPos.current ===
      commandListSnap.current.length - 1
    ) {
      setInputCommand({ ...initCommand });
      setCommandHistoryPos(commandHistoryPos.current + 1);
    }
  };

  const showPrevCommand = () => {
    // console.log(commandHistoryPos, inputCommand);
    if (commandHistoryPos.current >= 1) {
      setCommandHistoryPos(commandHistoryPos.current - 1);
      setInputCommand({
        ...inputCommand,
        text: commandListSnap.current[commandHistoryPos.current].text,
      });
    }
  };

  return {
    commandHistoryPos: commandHistoryPos.current,
    setCommandHistoryPos,
    listCommandHistory,
    showNextCommand,
    showPrevCommand,
  };
};

export default useHistory;
