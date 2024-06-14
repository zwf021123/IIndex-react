import { TodoStore } from '@/stores';
import MyDayjs from '@/utils/myDayjs';
import { Button, Card, Checkbox, List } from 'antd';
import React from 'react';
interface TodoBoxProps {
  today: boolean;
}

const ToDoBox: React.FC<TodoBoxProps> = ({ today }) => {
  const {
    taskList,
    deleteTask,
  }: { taskList: Todo.TaskType[]; deleteTask: (id: number) => void } =
    TodoStore();

  const doDelete = (index: number) => {
    deleteTask(index);
  };
  return (
    <div style={{ margin: '8px 0', maxWidth: '600px' }}>
      <Card styles={{ body: { padding: '0 12px' } }}>
        <List itemLayout="vertical">
          {taskList.map((item, index) => {
            return (
              <List.Item
                key={index}
                actions={[
                  <Button
                    key={index}
                    type="text"
                    danger
                    onClick={() => doDelete(index)}
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`创建时间：${MyDayjs(item.createTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )}`}
                  avatar={<Checkbox checked={item.isFinished} />}
                />
              </List.Item>
            );
          })}
        </List>
      </Card>
    </div>
  );
};

export default ToDoBox;
