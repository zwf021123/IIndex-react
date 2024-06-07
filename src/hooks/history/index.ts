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
  /**
   * 当前查看的命令位置(无需重新渲染)
   */
  // const [commandHistoryPos, setCommandHistoryPos] = useState<number>(
  //   commandList.length,
  // );
  const commandHistoryPos = useRef(commandList.length);
  const commandListSnap = useRef(commandList);

  const setCommandHistoryPos = (pos: number) => {
    commandHistoryPos.current = pos;
  };

  useEffect(() => {
    commandHistoryPos.current = commandList.length;
    commandListSnap.current = commandList;
  }, [commandList]);

  const listCommandHistory = () => {
    return commandListSnap.current;
  };

  const showNextCommand = () => {
    console.log(commandHistoryPos, inputCommand);
    if (commandHistoryPos.current < commandListSnap.current.length - 1) {
      setCommandHistoryPos(commandHistoryPos.current + 1);
      // inputCommand.text = commandList[commandHistoryPos.current].text;
      setInputCommand({
        ...inputCommand,
        text: commandListSnap.current[commandHistoryPos.current].text,
      });
    } else if (
      commandHistoryPos.current ===
      commandListSnap.current.length - 1
    ) {
      setInputCommand({ ...initCommand });
      // inputCommand.text = '';
      setCommandHistoryPos(commandHistoryPos.current + 1);
    }
  };

  const showPrevCommand = () => {
    if (commandHistoryPos.current >= 1) {
      setCommandHistoryPos(commandHistoryPos.current - 1);
      // inputCommand.text = commandList[commandHistoryPos.current].text;
      setInputCommand({
        ...inputCommand,
        text: commandListSnap.current[commandHistoryPos.current].text,
      });
    }
  };

  // const showNextCommand = () => {
  //   console.log(commandHistoryPos, commandList, inputCommand);
  //   if (commandHistoryPos < commandList.length - 1) {
  //     setCommandHistoryPos(commandHistoryPos + 1);
  //     inputCommand.text = commandList[commandHistoryPos].text;
  //   } else if (commandHistoryPos === commandList.length - 1) {
  //     inputCommand.text = '';
  //     setCommandHistoryPos(commandHistoryPos + 1);
  //   }
  // };

  // const showPrevCommand = () => {
  //   console.log(commandHistoryPos, commandList, inputCommand);
  //   if (commandHistoryPos >= 1) {
  //     setCommandHistoryPos(commandHistoryPos - 1);
  //     inputCommand.text = commandList[commandHistoryPos].text;
  //   }
  // };

  return {
    commandHistoryPos,
    setCommandHistoryPos,
    listCommandHistory,
    showNextCommand,
    showPrevCommand,
  };
};

export default useHistory;
