import { useSnapshot } from '@umijs/max';
import type { InputRef } from 'antd';
import { Collapse, Input, Spin } from 'antd';
import React, { Fragment, useRef, useState } from 'react';
import './index.less';
const { Panel } = Collapse;

import ContentOutput from '@/components/ContentOutput';
import { LOCAL_USER } from '@/constants/user';
import { useTerminal } from '@/hooks';
import { configStore } from '@/stores';

type TerminalProps = {
  fullScreen?: boolean;
  height?: number;
  user?: User.UserType;
};

const Terminal: React.FC<TerminalProps> = ({
  fullScreen = false,
  height = 400,
  user = LOCAL_USER,
}: TerminalProps) => {
  /**
   * store
   */
  const configStoreSnap = useSnapshot(configStore);

  /**
   * state
   */
  /**
   * 折叠面板激活的 key
   */
  const [activeKeys, setActiveKeys] = useState([]);
  /**
   * 加载状态(背景图)
   */
  const [backgroundSpinning, setBackgroundSpinning] = useState(false);

  /**
   * 输入框
   */
  const inputRef = useRef<InputRef>(null);

  const { terminal, isRunning, inputCommand, setInputCommand, outputList } =
    useTerminal(inputRef);
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

  const handleCoppapseChange = (key) => {
    setActiveKeys(key);
  };

  /**
   * 当点击空白聚焦输入框
   */
  const handleClickWrapper = (event: React.MouseEvent) => {
    //@ts-ignore
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
              onPressEnter={terminal.doSubmitCommand}
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
