import { todoActions, todoStore } from '@/stores';
import MyDayjs from '@/utils/myDayjs';
import { useSnapshot } from '@umijs/max';
import { Button, Card, Checkbox, Empty, List } from 'antd';
import React from 'react';
interface TodoBoxProps {
  today: boolean;
}

const ToDoBox: React.FC<TodoBoxProps> = ({ today }) => {
  const { taskList }: { taskList: Todo.TaskType[] } = useSnapshot(todoStore);
  const { deleteTask, toggleTask } = todoActions;

  const doDelete = (index: number) => {
    deleteTask(index);
  };

  const doToggle = (index: number) => {
    toggleTask(index);
  };

  return (
    <div style={{ margin: '8px 0', maxWidth: '600px' }}>
      <Card styles={{ body: { padding: '0 12px' } }}>
        {taskList.length ? (
          <List itemLayout="horizontal">
            {taskList.map((item, index) => {
              return (
                <List.Item
                  key={index}
                  actions={[
                    <Button
                      key={`${index}-delete`}
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
                    avatar={
                      <Checkbox
                        checked={item.isFinished}
                        onClick={() => doToggle(index)}
                      />
                    }
                  />
                </List.Item>
              );
            })}
          </List>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </div>
  );
};

export default ToDoBox;
