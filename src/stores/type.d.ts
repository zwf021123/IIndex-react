interface configType {
  background: string;
  showHint: boolean;
  welcomeTexts: string[];
  [key: string]: any;
}

declare namespace Todo {
  /**
   * 任务类型
   */
  interface TaskType {
    name: string;
    isFinished: boolean;
    createTime: date;
    finishTime?: date;
  }
}

declare namespace Space {
  interface SpaceStateType {
    space: SpaceType;
    currentDir: string;
  }

  /**
   * 空间类型（扁平）
   */
  interface SpaceType {
    [dir: string]: SpaceItemType;
  }

  /**
   * 空间项类型
   */
  interface SpaceItemType {
    // 条目 / 目录名
    name: string;
    link?: string;
    // 所属目录
    dir: string;
    type: 'dir' | 'link';
  }

  /**
   * 返回值类型
   */
  interface ResultType {
    result: boolean;
    message?: string;
  }
}
