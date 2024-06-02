import { colorMap } from '@/constants/color';
import smartText from '@/utils/output';
import { Tag } from 'antd';
import React from 'react';
import './index.less';

interface OutputProps {
  output: Terminal.OutputType;
}

const ContentOutput: React.FC<OutputProps> = ({ output }: OutputProps) => {
  const outputTagColor = colorMap[output?.status || 'default'];

  return (
    <div className="content-output">
      {output.text ? (
        <>
          {outputTagColor && <Tag color={outputTagColor}>{output.status}</Tag>}
          <span>{smartText(output.text)}</span>
        </>
      ) : (
        output.component && output.component
      )}
    </div>
  );
};

export default ContentOutput;
