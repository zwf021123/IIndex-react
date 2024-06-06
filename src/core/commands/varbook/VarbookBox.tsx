import { getNamedVariables } from '@/api/translate';
import ContentOutput from '@/components/ContentOutput';
import { Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import './VarbookBox.less';
import { parseNamedVariable } from './standard';

interface VariableBoxProps {
  searchText: string;
}

export const VarbookBox: React.FC<VariableBoxProps> = ({ searchText }) => {
  const [variablesTable, setVariablesTable] = useState<any>({});
  const [loadOK, setLoadOK] = useState(false);
  const [output, setOutput] = useState<Terminal.OutputType>({
    type: 'text',
    status: 'warning',
    text: '',
  });

  useEffect(() => {
    getNamedVariables(searchText)
      .then((res: any) => {
        const { code, data, msg } = res;
        if (code === 200) {
          setVariablesTable(parseNamedVariable(data.namedVariables));
        } else {
          setOutput({ type: 'text', status: 'error', text: msg });
        }
      })
      .catch((err: any) => {
        output.text = '服务器扛不住了，请稍后再试';
        console.log(err);
      })
      .finally(() => {
        setLoadOK(true);
      });
  }, []);

  return (
    <div className={`main ${variablesTable.source ? 'success' : 'warning'}`}>
      <Spin
        spinning={!loadOK}
        style={{
          height: !loadOK ? '283px' : '',
          // position: !loadOK ? 'inherit' : '',
        }}
      >
        {loadOK && (
          <div>
            <Table
              className="table"
              size="small"
              dataSource={variablesTable?.source}
              columns={variablesTable?.columns}
              pagination={false}
            ></Table>
            <ContentOutput output={output} />
          </div>
        )}
      </Spin>
    </div>
  );
};
