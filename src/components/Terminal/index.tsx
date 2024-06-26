import { useSnapshot } from '@umijs/max';
import type { InputRef } from 'antd';
import { Collapse, Input, Spin } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import './index.less';
const { Panel } = Collapse;

import ContentOutput from '@/components/ContentOutput';
import { useTerminal } from '@/hooks';
import { configStore, spaceStore, userStore } from '@/stores';

type TerminalProps = {
  fullScreen?: boolean;
  height?: number;
  user?: User.UserType;
};

const Terminal: React.FC<TerminalProps> = ({
  fullScreen = false,
  height = 400,
}: TerminalProps) => {
  /**
   * store
   */
  const configStoreSnap = useSnapshot(configStore);
  const { loginUser } = useSnapshot(userStore);
  const spaceStoreSnap: Space.SpaceStateType = useSnapshot(spaceStore);

  /**
   * state
   */

  /**
   * 加载状态(背景图)
   */
  const [backgroundSpinning, setBackgroundSpinning] = useState(false);

  /**
   * 输入框
   */
  const inputRef = useRef<InputRef>(null);

  /**
   * terminal ref
   */
  const terminalRef = useRef(null);

  /**
   * hooks
   */
  const {
    terminal,
    isRunning,
    hintValue,
    debounceSetHint,
    inputCommand,
    setInputCommand,
    outputList,
    activeKeys,
    setActiveKeys,
  } = useTerminal(inputRef, terminalRef);

  // 同步输入框内容到hint
  useEffect(() => {
    debounceSetHint(inputCommand.text);
  }, [inputCommand.text]);

  const mainStyle: React.CSSProperties = fullScreen
    ? { position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }
    : { height: height + 'px' };

  const wrapperStyle: React.CSSProperties = {
    ...mainStyle,
    background: `url(${configStoreSnap.background})  no-repeat center/cover`,
    // 从配置中获取背景
  };

  const prompt = `user@${loginUser.username}:~${spaceStoreSnap.currentDir}#`;
  const handleCoppapseChange = (key: string[] | string) => {
    console.log('key', key);
    setActiveKeys(key as string[]);
  };

  /**
   * 当点击空白聚焦输入框
   */
  const handleClickWrapper = (event: any) => {
    if (event.target.className === 'terminal') {
      terminal.focusInput();
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
        fullscreen
        spinning={backgroundSpinning}
      />
      <div ref={terminalRef} className="terminal" style={mainStyle}>
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
                forceRender={true}
                header={
                  <>
                    <span style={{ userSelect: 'none', marginRight: '10px' }}>
                      {/* 需要展示已执行命令的所在目录 */}
                      {`user@${loginUser.username}:~${output.dir}#`}
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
                    {/* 需要展示已执行命令的所在目录 */}
                    {`user@${loginUser.username}:~${output.dir}#`}
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
            addonBefore={<span className="command-input-prompt">{prompt}</span>}
            onChange={(e) => {
              setInputCommand({ text: e.target.value });
            }}
            onPressEnter={terminal.doSubmitCommand}
          ></Input>
        </div>
        {hintValue && !isRunning && (
          <div className="terminal-row" style={{ color: '#bbb' }}>
            hint：{hintValue}
          </div>
        )}
        <div style={{ marginBottom: 16 }} />
      </div>
    </div>
  );
};

export default Terminal;
