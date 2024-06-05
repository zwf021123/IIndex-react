import { useSnapshot } from '@umijs/max';
import type { InputRef } from 'antd';
import { Collapse, Input, Spin } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import './index.less';
const { Panel } = Collapse;

import ContentOutput from '@/components/ContentOutput';
import { initCommand } from '@/constants';
import { LOCAL_USER } from '@/constants/user';
import { first, second } from '@/constants/welcome';
import { useHint, useHistory } from '@/hooks';
import { configStore } from '@/stores';

type TerminalProps = {
  fullScreen?: boolean;
  height?: number;
  user?: User.UserType;
  onSubmitCommand: (inputText: string) => void;
};

const Terminal: React.FC<TerminalProps> = ({
  fullScreen = false,
  height = 400,
  user = LOCAL_USER,
  onSubmitCommand,
}: TerminalProps) => {
  /**
   * store
   */
  const configStoreSnap = useSnapshot(configStore);

  /**
   * states
   */

  /**
   * 命令列表
   */
  const [commandList, setCommandList] = useState<Terminal.CommandOutputType[]>(
    [],
  );
  /**
   * 输入框
   */
  const inputRef = useRef<InputRef>(null);
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
  const [activeKeys, setActiveKeys] = useState([]);
  /**
   * 加载状态(背景图)
   */
  const [backgroundSpinning, setBackgroundSpinning] = useState(false);
  /**
   * 加载状态(命令)
   */
  const [isRunning, setIsRunning] = useState(false);

  /**
   * Hooks
   */
  const {
    setCommandHistoryPos,
    showPrevCommand,
    showNextCommand,
    listCommandHistory,
  } = useHistory(commandList, inputCommand);

  const { hintValue, command, setHintValue, debounceSetHint } = useHint();

  /**
   *
   */

  const mainStyle: React.CSSProperties = fullScreen
    ? { position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }
    : { height: height + 'px' };

  const wrapperStyle: React.CSSProperties = {
    ...mainStyle,
    background: `url(${configStoreSnap.background})  no-repeat center/cover`,
    // 从配置中获取背景
  };

  const prompt = `user@${user.username}:~#`;

  /**
   * 全局记录当前命令，便于写入结果
   */
  let currentNewCommand: Terminal.CommandOutputType;

  const handleCoppapseChange = (key) => {
    setActiveKeys(key);
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
   * 当点击空白聚焦输入框
   */
  const handleClickWrapper = (event: React.MouseEvent) => {
    //@ts-ignore
    if (event.target.className === 'terminal') {
      focusInput();
    }
  };

  /**
   * 核心
   * 提交命令（回车）
   */
  const doSubmitCommand = async () => {
    setIsRunning(true);
    // setHint('');
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
      // dir: useSpaceStore().currentDir,
    };
    // 记录当前命令，便于写入结果
    currentNewCommand = newCommand;
    // 执行命令
    // await onSubmitCommand?.(inputText);
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
    // 默认展开折叠面板
    setActiveKeys([...activeKeys, outputList.length - 1]);
    // 自动滚到底部
    // setTimeout(() => {
    //   terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
    // }, 50);
    setIsRunning(false);
  };

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
    setOutputList([...outputList, newOutput]);
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
    // 组件无需响应式追踪?????
    currentNewCommand.resultList.push(
      output.type === 'component' ? output : output,
    );
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
      (inputRef.current?.input as HTMLInputElement) == document.activeElement
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
   * 设置输入框的值
   */
  const setTabCompletion = () => {
    if (hintValue) {
      const wordArr = inputCommand.text.split(/\s+/);
      const hintArr = hintValue.split(/\s+/);
      const wordNum = wordArr.length;
      const currentHintWord = hintArr[wordNum - 1];
      const currentWord = wordArr[wordNum - 1];
      const isOption = wordNum > 1 && wordArr[wordNum - 2].startsWith('-');

      /**
       * 判断当前输入的位置信息为路径还是命令（判断当前的hint值是否包含“目录”或“路径”）
       * 还是得新建一个方法进行补全，不然使用getFullPath补全会一直补全为绝对路径)
       */
      //  如果是命令则需要进行命令补全
      if (
        currentHintWord.indexOf('目录') !== -1 ||
        currentHintWord.indexOf('路径') !== -1
      ) {
        // 路径补全
        const text =
          [
            ...wordArr.slice(0, wordNum - 1),
            spaceStore.autoCompletePath(currentWord),
          ].join(' ') + ' ';
        setInputCommand({ ...inputCommand, text });
      } else if (isOption) {
        const toMatch = wordArr[wordNum - 2][1];
        /**
         * 如果这里能够拿到当前准备执行的命令实例，同时利用wordArr[wordNum - 2]判断是否是一个option
         * 如果是则可以通过实例拿到所有当前option的可选项，然后进行option的补全
         */
        // 获取当前选项的所有可选值
        let options = null;
        for (let i = 0; i < command.options.length; i++) {
          if (
            command.options[i].key === toMatch ||
            command.options[i].alias?.some((alias: string) => alias === toMatch)
          ) {
            options = command.options[i].alternative;
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
   * 挂载时
   */
  useEffect(() => {
    // registerShortcuts(terminal);
    const { welcomeTexts } = configStoreSnap;
    if (welcomeTexts?.length > 0) {
      welcomeTexts.forEach((welcomeText) => {
        terminal.writeTextOutput(welcomeText);
      });
    } else {
      terminal.writeTextOutput(first);
      terminal.writeTextOutput(second);
      terminal.writeTextOutput('<br/>');
    }
  }, []);

  /**
   * 操作终端的对象
   */
  const terminal: Terminal.TerminalType = {
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
    setLoading: setBackgroundSpinning,
  };

  return (
    <div
      className="terminal-wrapper"
      style={wrapperStyle}
      onClick={(e) => handleClickWrapper(e)}
    >
      <Spin
        className="loading"
        tip="Loading..."
        size="large"
        spinning={backgroundSpinning}
      >
        <div className="terminal" style={mainStyle}>
          <Collapse
            activeKey={activeKeys}
            onChange={handleCoppapseChange}
            ghost
            expandIconPosition="end"
          >
            {outputList.map((output, index) =>
              output.collapsible ? (
                // 可折叠内容
                <Panel
                  header={
                    <>
                      <span style={{ userSelect: 'none', marginRight: '10px' }}>
                        {prompt}
                      </span>
                      <span>{output.text}</span>
                    </>
                  }
                  key={index}
                  className="terminal-row"
                >
                  {output?.resultList?.map((result, idx) => (
                    <div key={`${index}-${idx}`} className="terminal-row">
                      <ContentOutput output={result} />
                    </div>
                  ))}
                </Panel>
              ) : output.type === 'command' ? (
                <Fragment key={index}>
                  <div className="terminal-row">
                    <span style={{ userSelect: 'none', marginRight: '10px' }}>
                      {prompt}
                    </span>
                    <span>{output.text}</span>
                  </div>
                  {output?.resultList?.map((result, idx) => (
                    <div key={`${index}-${idx}`} className="terminal-row">
                      <ContentOutput output={result} />
                    </div>
                  ))}
                </Fragment>
              ) : (
                <div className="terminal-row" key={index}>
                  <ContentOutput output={output} />
                </div>
              ),
            )}
          </Collapse>
          <div className="terminal-row">
            <Input
              ref={inputRef}
              className="command-input"
              disabled={isRunning}
              placeholder={inputCommand.placeholder}
              variant="borderless"
              autoFocus
              value={inputCommand.text}
              addonBefore={
                <span className="command-input-prompt">{prompt}</span>
              }
              onChange={(e) => setInputCommand({ text: e.target.value })}
              onPressEnter={doSubmitCommand}
            ></Input>
          </div>
          <div>hint</div>
          <div style={{ marginBottom: 16 }} />
        </div>
      </Spin>
    </div>
  );
};

export default Terminal;
