import type { InputRef } from 'antd';
import { Collapse, Input, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
const { Panel } = Collapse;

import ContentOutput from '@/components/ContentOutput';
import { initCommand } from '@/constants';
import { LOCAL_USER } from '@/constants/user';

type TerminalProps = {
  fullScreen?: boolean;
  height?: number;
  user?: User.UserType;
  onSubmitCommand?: (inputText: string) => void;
};

const Terminal: React.FC<TerminalProps> = ({
  fullScreen = false,
  height = 400,
  user = LOCAL_USER,
}: TerminalProps) => {
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

  const mainStyle: React.CSSProperties = fullScreen
    ? { position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }
    : { height: height + 'px' };
  // 从配置中获取背景
  const wrapperStyle: React.CSSProperties = {
    ...mainStyle,
    background: `url(${'black'})  no-repeat center/cover`,
  };

  const prompt = `user@${user.username}:~#`;

  const handleCoppapseChange = (key) => {
    setActiveKeys(key);
  };

  /**
   * 核心
   * 提交命令（回车）
   */
  const doSubmitCommand = async () => {
    setIsRunning(true);
    setHint('');
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
    const newCommand: CommandOutputType = {
      text: inputText,
      type: 'command',
      resultList: [],
      dir: useSpaceStore().currentDir,
    };
    // 记录当前命令，便于写入结果
    currentNewCommand = newCommand;
    // 执行命令
    await props.onSubmitCommand?.(inputText);
    // 添加输出（为空也要输出换行）
    outputList.value.push(newCommand);
    // 不为空字符串才算是有效命令
    if (inputText) {
      commandList.value.push(newCommand);
      // 重置当前要查看的命令位置
      commandHistoryPos.value = commandList.value.length;
    }
    // 重置
    inputCommand.value = { ...initCommand };
    // 默认展开折叠面板
    activeKeys.value.push(outputList.value.length - 1);
    // 自动滚到底部
    setTimeout(() => {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
    }, 50);
    isRunning.value = false;
  };

  /**
   * 输入框聚焦
   */
  const focusInput = () => {
    inputRef?.current?.focus();
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
                    <div key={idx} className="terminal-row">
                      <ContentOutput output={result} />
                    </div>
                  ))}
                </Panel>
              ) : output.type === 'command' ? (
                <>
                  <div className="terminal-row">
                    <span style={{ userSelect: 'none', marginRight: '10px' }}>
                      {prompt}
                    </span>
                    <span>{output.text}</span>
                  </div>
                  {output?.resultList?.map((result, idx) => (
                    <div key={idx} className="terminal-row">
                      <ContentOutput output={result} />
                    </div>
                  ))}
                </>
              ) : (
                <div className="terminal-row">
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
              addonBefore={
                <span className="command-input-prompt">{prompt}</span>
              }
              onChange={(e) => (inputCommand.text = e.target.value)}
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
