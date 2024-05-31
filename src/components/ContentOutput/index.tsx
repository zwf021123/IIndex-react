import { colorMap } from '@/constants/color';
import smartText from '@/utils/output';
import { Tag } from 'antd';
import React from 'react';

interface OutputProps {
  output: Terminal.OutputType;
}

const ContentOutput: React.FC<OutputProps> = ({ output }: OutputProps) => {
  const outputTagColor = colorMap[output?.status || 'default'];

  const content = output.text ? (
    <>
      {outputTagColor && <Tag color={outputTagColor}>{output.status}</Tag>}
      <span>{smartText(output.text)}</span>
    </>
  ) : (
    output.component && output.component
  );
  return content;
};

export default ContentOutput;
