import { initCommand } from '@/constants';
import { useSnapshot } from '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';

import { first, second } from '@/constants/welcome';
import { doCommandExecute } from '@/core/commandExecutor';
import { useHint, useHistory } from '@/hooks';
import { configStore, spaceActions, spaceStore, userActions } from '@/stores';
import { registerShortcuts } from '@/utils/keyboardUtils';
import { likeSearch } from '@/utils/likeSearch';
import { InputRef } from 'antd';

/**
 * 核心terminal hook
 */
export const useTerminal = (
  inputRef: React.RefObject<InputRef>,
  terminalRef: React.RefObject<HTMLDivElement>,
) => {
  /**
   * 暴露接口
   */
  let terminal: Terminal.TerminalType;

  /**
   * store
   */
  const configStoreSnap = useSnapshot(configStore);
  const spaceStoreSnap = useSnapshot(spaceStore);
  const { autoCompletePath } = spaceActions;
  const { getAndSetLoginUser } = userActions;

  /**
   * 命令列表
   */
  const [commandList, setCommandList] = useState<Terminal.CommandOutputType[]>(
    [],
  );
  /**
   * 待输入命令
   */
  const [inputCommand, setInputCommand] = useState<Terminal.CommandInputType>({
    ...initCommand,
  });
  /**
   * 输出列表
   */
  const [outputList, setOutputList] = useState<Terminal.OutputType[]>([]);

  /**
   * 折叠面板激活的 key
   */
  const [activeKeys, setActiveKeys] = useState<(string | number)[]>([]);

  /**
   * 加载状态(命令)
   */
  const [isRunning, setIsRunning] = useState(false);

  /**
   * Refs
   */
  const hintValueRef = useRef<string>('');
  const inputCommandSnap = useRef<Terminal.CommandInputType | null>(null);
  /**
   * Hooks
   */
  const {
    setCommandHistoryPos,
    showPrevCommand,
    showNextCommand,
    listCommandHistory,
  } = useHistory(commandList, inputCommand, setInputCommand);

  const { hintValue, matchedCommand, setHintValue, debounceSetHint } =
    useHint();

  /**
   * 全局记录当前命令，便于写入结果
   */
  let currentNewCommand: Terminal.CommandOutputType;

  /**
   * 立即输出文本
   * @param text
   * @param status
   */
  const writeTextOutput = (
    text: string,
    status?: Terminal.OutputStatusType,
  ) => {
    const newOutput: Terminal.TextOutputType = {
      text,
      type: 'text',
      status,
    };
    // setOutputList([...outputList, newOutput]); 错误
    setOutputList((prevOutputList) => [...prevOutputList, newOutput]);
  };

  /**
   * 写命令文本结果
   * @param text
   * @param status
   */
  const writeTextResult = (
    text: string,
    status?: Terminal.OutputStatusType,
  ) => {
    const newOutput: Terminal.TextOutputType = {
      text,
      type: 'text',
      status,
    };
    currentNewCommand.resultList.push(newOutput);
  };

  /**
   * 写文本错误状态结果
   * @param text
   */
  const writeTextErrorResult = (text: string) => {
    writeTextResult(text, 'error');
  };

  /**
   * 写文本成功状态结果
   * @param text
   */
  const writeTextSuccessResult = (text: string) => {
    writeTextResult(text, 'success');
  };

  /**
   * 写结果
   * @param output
   */
  const writeResult = (output: Terminal.OutputType) => {
    // console.log('outputlist', output, outputList);
    // 此时的outputList是旧的，即还未触发渲染，因此直接更新还未进入outputList的currentNewCommand
    if (output.type === 'component') {
      console.log('output', output);
      currentNewCommand.resultList.push(output);
    }
    // console.log('currentNewCommand', currentNewCommand);
  };

  /**
   * 立即输出
   * @param newOutput
   */
  const writeOutput = (newOutput: Terminal.OutputType) => {
    setOutputList([...outputList, newOutput]);
  };

  /**
   * 设置命令是否可折叠
   * @param collapsible
   */
  const setCommandCollapsible = (collapsible: boolean) => {
    currentNewCommand.collapsible = collapsible;
  };

  /**
   * 获取输入框是否聚焦
   */
  const isInputFocused = () => {
    return (
      (inputRef.current?.input as HTMLInputElement) === document.activeElement
    );
  };

  /**
   * 折叠 / 展开所有块
   */
  const toggleAllCollapse = () => {
    // 展开
    if (activeKeys.length === 0) {
      // const tempValue = outputList.map((_, index) => {
      //   return index;
      // });
      // 获取所有可折叠的 key
      // setActiveKeys(tempValue);
    } else {
      // 折叠
      setActiveKeys([]);
    }
  };

  /**
   * 清空所有输出
   */
  const clear = () => {
    setOutputList([]);
  };

  /**
   * 输入框聚焦
   */
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * 根据hintValue设置输入框的值
   */
  const setTabCompletion = () => {
    let hintValue = hintValueRef.current;
    let inputCommand = inputCommandSnap.current;
    if (hintValue) {
      const wordArr = inputCommand!.text.split(/\s+/);
      const hintArr = hintValue.split(/\s+/);
      const wordNum = wordArr.length;
      const currentHintWord = hintArr[wordNum - 1];
      const currentWord = wordArr[wordNum - 1];
      const isOption = wordNum > 1 && wordArr[wordNum - 2].startsWith('-');

      /**
       * 判断当前输入的位置信息为路径还是命令（判断当前的hint值是否包含“目录”或“路径”）
       * 还是得新建一个方法进行补全，不然使用getFullPath补全会一直补全为绝对路径)
       */
      if (
        currentHintWord.indexOf('目录') !== -1 ||
        currentHintWord.indexOf('路径') !== -1
      ) {
        // 路径补全
        const text =
          [
            ...wordArr.slice(0, wordNum - 1),
            autoCompletePath(currentWord),
          ].join(' ') + ' ';
        setInputCommand({ ...inputCommand, text });
      } else if (isOption) {
        const toMatch = wordArr[wordNum - 2][1];
        /**
         * 如果这里能够拿到当前准备执行的命令实例，同时利用wordArr[wordNum - 2]判断是否是一个option
         * 如果是则可以通过实例拿到所有当前option的可选项，然后进行option的补全
         */
        // 未匹配到命令
        if (!matchedCommand.current) return;
        // 获取当前选项的所有可选值
        let options = null;
        for (let i = 0; i < matchedCommand.current.options.length; i++) {
          if (
            matchedCommand.current.options[i].key === toMatch ||
            matchedCommand.current.options[i].alias?.some(
              (alias: string) => alias === toMatch,
            )
          ) {
            options = matchedCommand.current.options[i].alternative;
            break;
          }
        }
        if (!options) {
          // 如果没有找到对应的选项，直接返回
          return;
        }
        // 模糊匹配
        const matchOption = likeSearch(currentWord, options);
        // 补全
        const text =
          [...wordArr.slice(0, wordNum - 1), matchOption].join(' ') + ' ';
        setInputCommand({ ...inputCommand, text });
      } else {
        // 命令补全
        // 将当前输入个数的单词替换为提示的单词(除了用户输入之前的)
        const text =
          [...wordArr.slice(0, wordNum - 1), hintArr[wordNum - 1]].join(' ') +
          ' ';
        setInputCommand({ ...inputCommand, text });
      }
    }
  };

  /**
   * 核心 命令执行
   * @param inputText
   * @returns
   */
  const onSubmitCommand = async (inputText: string) => {
    if (!inputText) {
      return;
    }
    await doCommandExecute(inputText, terminal);
  };

  /**
   * 核心
   * 提交命令（回车）
   */
  const doSubmitCommand = async () => {
    setIsRunning(true);
    setHintValue('');
    let inputText = inputCommand.text;
    // 执行某条历史命令
    if (inputText.startsWith('!')) {
      const commandIndex = Number(inputText.substring(1));
      const command = commandList[commandIndex - 1];
      if (command) {
        inputText = command.text;
      }
    }

    // 执行命令(记录当前命令执行时的目录)
    const newCommand: Terminal.CommandOutputType = {
      text: inputText,
      type: 'command',
      resultList: [],
      dir: spaceStoreSnap.currentDir,
    };
    // 记录当前命令，便于写入结果
    currentNewCommand = newCommand;
    // 执行命令
    await onSubmitCommand?.(inputText);
    // 添加输出（为空也要输出换行）
    setOutputList([...outputList, newCommand]);
    // 不为空字符串才算是有效命令
    if (inputText) {
      setCommandList([...commandList, newCommand]);
      // 重置当前要查看的命令位置
      setCommandHistoryPos(commandList.length);
    }
    // 重置
    setInputCommand({ ...initCommand });

    setIsRunning(false);
  };

  /**
   * 新增output时(为了拿到最新数据)
   */
  useEffect(() => {
    // 默认展开折叠面板
    if (outputList.length > 0) {
      // 因为初次挂载后，outputList的长度变为3，所以activeKeys的长度默认多一个2

      setActiveKeys([...activeKeys, outputList.length - 1]);
      // 自动滚到底部
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 500);
      // if (terminalRef.current) {
      //   console.log(
      //     '延迟200ms后滚动到底部：',
      //     terminalRef.current.scrollTop,
      //     terminalRef.current.scrollHeight,
      //   );
      // }
    }
  }, [outputList]);

  /**
   * 同步state
   */
  useEffect(() => {
    hintValueRef.current = hintValue;
    inputCommandSnap.current = inputCommand;
  }, [hintValue, inputCommand]);

  /**
   * 挂载时
   */
  useEffect(() => {
    // 获取登录态
    getAndSetLoginUser();
    // 注册快捷键
    registerShortcuts(terminal);
    // 监听空间状态改变并 发请求保存用户空间数据

    const { welcomeTexts } = configStoreSnap;
    if (welcomeTexts?.length > 0) {
      welcomeTexts.forEach((welcomeText) => {
        writeTextOutput(welcomeText);
      });
    } else {
      writeTextOutput(first);
      writeTextOutput(second);
      writeTextOutput('<br/>');
    }
  }, []);

  /**
   * 操作终端的对象
   */
  terminal = {
    writeTextResult,
    writeTextErrorResult,
    writeTextSuccessResult,
    writeResult,
    writeTextOutput,
    writeOutput,
    clear,
    focusInput,
    isInputFocused,
    setTabCompletion,
    doSubmitCommand,
    showNextCommand,
    showPrevCommand,
    listCommandHistory,
    toggleAllCollapse,
    setCommandCollapsible,
  };

  return {
    terminal,
    inputCommand,
    setInputCommand,
    outputList,
    setOutputList,
    isRunning,
    hintValue,
    setHintValue,
    debounceSetHint,
    activeKeys,
    setActiveKeys,
  };
};
