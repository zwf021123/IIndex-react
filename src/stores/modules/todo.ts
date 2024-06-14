import { proxy, subscribe } from '@umijs/max';

export const todoStore = proxy(
  JSON.parse(String(localStorage.getItem('todo-store'))) || {
    taskList: [
      {
        name: '写下你要做的事',
        isFinished: false,
        createTime: new Date(),
      },
      {
        name: '已完成的事项',
        isFinished: true,
        createTime: new Date(),
      },
    ] as Todo.TaskType[],
  },
);

export const todoActions = {
  /**
   * 创建任务
   * @param task
   */
  addTask(task: Todo.TaskType) {
    if (!task || !task.name) {
      return false;
    }
    task.isFinished = false;
    task.createTime = new Date();
    todoStore.taskList.push(task);
    return true;
  },
  /**
   * 删除任务
   * @param index
   */
  deleteTask(index: number) {
    if (index < 0 || index >= todoStore.taskList.length) {
      return false;
    }
    todoStore.taskList.splice(index, 1);
    return true;
  },
  /**
   * 更新任务
   * @param index
   * @param newTask
   */
  updateTask(index: number, newTask: Todo.TaskType) {
    if (index < 0 || index >= todoStore.taskList.length) {
      return false;
    }
    todoStore.taskList[index] = { ...todoStore.taskList[index], ...newTask };
  },
};
// 订阅
subscribe(todoStore, () => {
  console.log('todoStore changed', todoStore);
  localStorage.setItem('todo-store', JSON.stringify(todoStore));
});

export const TodoStore = () => {
  return {
    ...todoActions,
    ...todoStore,
  };
};
