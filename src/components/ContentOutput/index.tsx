import { colorMap } from '@/constants/color';
import { smartText } from '@/utils/output';
import { Spin, Tag } from 'antd';
import React, { Suspense } from 'react';
import './index.less';

interface OutputProps {
  output: Terminal.OutputType;
}

const ContentOutput: React.FC<OutputProps> = ({ output }: OutputProps) => {
  const outputTagColor = colorMap[output?.status || 'default'];
  const Component = output.component;

  return (
    <div className="content-output">
      {output.text ? (
        <>
          {outputTagColor && <Tag color={outputTagColor}>{output.status}</Tag>}
          <span
            dangerouslySetInnerHTML={{ __html: smartText(output.text) }}
          ></span>
        </>
      ) : (
        output.component && (
          <Suspense fallback={<Spin spinning={true} />}>
            <Component></Component>
          </Suspense>
        )
      )}
    </div>
  );
};

export default ContentOutput;
