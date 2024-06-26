import { getCurrentSpace, updateSpace } from '@/api/space';
import { pathReg } from '@/constants/regExp';
import { userDerived } from '@/stores';
import { proxy, subscribe } from '@umijs/max';
import { message } from 'antd';
import _ from 'lodash';

// 用于在监听state变化时，筛选某些不需要的行为
export let executeUpdate = true;
export const troggerExecuteUpdate = () => {
  executeUpdate = !executeUpdate;
};

const initSpace: Space.SpaceStateType = {
  space: {
    '/': {
      name: '/',
      dir: '/',
      type: 'dir',
    },
  },
  currentDir: '/',
};

/**
 * 获取上层路径
 * @param path
 */
const getParentDir = (path: string): string => {
  let parentDir = '/';
  if (path === '/') {
    return parentDir;
  }
  // 切割掉最后一个 '/'
  // e.g. /a/b => /a
  parentDir = path.substring(0, path.lastIndexOf('/'));
  // 有可能回退到根目录
  // e.g. /a => ''（空字符串）
  if (!parentDir) {
    return '/';
  }
  return parentDir;
};

/**
 * 获得条目绝对路径
 * @param dir 当前目录
 * @param name 条目路径
 */
const getFullPath = (dir: string, name: string): string => {
  // 需要对name的前缀进行处理例如./ / ../
  // e.g. ./a/b => /a/b   ../../../a/b => /a/b
  if (name.startsWith('/')) {
    return name;
  } else if (name.startsWith('./')) {
    return getFullPath(dir, name.substring(2));
  } else if (name.startsWith('../')) {
    // 如果包含多个../需要递归处理
    return getFullPath(getParentDir(dir), name.substring(3));
  }
  return dir + (dir === '/' ? '' : '/') + name;
};

/**
 * 根据路径获取空间条目名
 * @param path
 */
const getItemName = (path: string): string => {
  if (path === '/') {
    return path;
  }
  // 从最后一个 '/' 开始取字符串
  // e.g. /a/b => b
  return path.substring(path.lastIndexOf('/') + 1);
};

/**
 * 获得条目层级
 * @param key
 */
const getItemDepth = (key: string) => {
  if (key === '/') {
    return 1;
  }
  return key.split('/').length;
};

/**
 * 空间状态（类似文件系统实现）
 */
export const spaceStore = proxy<Space.SpaceStateType>({
  ...initSpace,
});

export const spaceActions = {
  /**
   * 重置state
   */
  resetSpace() {
    const resetObj = _.cloneDeep(initSpace);
    spaceActions.setSpace(resetObj);
    // Object.keys(resetObj).forEach((key: string) => {
    //   if (isValidKey(key, spaceStore)) {
    //     spaceStore[key] = resetObj[key];
    //   }
    // });
  },
  /**
   * 获取当前用户空间
   */
  async requestSpace() {
    try {
      const spaceRes: any = await getCurrentSpace();
      if (spaceRes?.code === 0) {
        // 注意非空判断
        if (spaceRes.data.bindingSpace)
          spaceActions.setSpace(JSON.parse(spaceRes.data.bindingSpace));
      }
    } catch (e) {}
  },
  /**
   * 设置空间
   */
  setSpace(spaceData: Space.SpaceStateType) {
    spaceStore.space = spaceData.space;
    spaceStore.currentDir = spaceData.currentDir;
  },
  /**
   * 获取单条目
   * @param key
   */
  getItem(key: string) {
    const fullPath = getFullPath(spaceStore.currentDir, key);
    return spaceStore.space[fullPath];
  },
  /**
   * 获取某目录下的条目
   * @param dir 目录
   * @param recursive 是否递归
   */
  listItems(dir?: string, recursive = false): Space.SpaceItemType[] {
    let curDir = dir;
    if (!dir) {
      curDir = spaceStore.currentDir;
    } else {
      curDir = getFullPath(spaceStore.currentDir, curDir as string);
    }
    const resultList: Space.SpaceItemType[] = [];
    // 父目录层级
    const parentDirDepth = getItemDepth(curDir);
    // 查询 curDir 下的 item
    for (const key in spaceStore.space) {
      // 不列举自身
      if (key === curDir) {
        continue;
      }
      // 前缀必须匹配
      if (!key.startsWith(curDir)) {
        continue;
      }
      // 不递归，只展示直接子级
      if (!recursive) {
        // 直接子级的 '/' 数比父级多 1
        if (getItemDepth(key) - 1 === parentDirDepth) {
          resultList.push(spaceStore.space[key]);
        }
      } else {
        // 将所有子级都展示
        resultList.push(spaceStore.space[key]);
      }
    }
    return resultList;
  },
  /**
   * 添加条目
   * @param item
   */
  addItem(item: Space.SpaceItemType): Promise<string> {
    return new Promise((resolve, reject) => {
      const tempDir = item.dir + (item.dir.slice(-1) === '/' ? '' : '/');
      const fullPath = getFullPath(spaceStore.currentDir, tempDir + item.name);
      // 因为 addItem 时，dir 可能是相对路径，所以需要重新赋值
      item.dir = getParentDir(fullPath);
      // 非法路径
      if (!pathReg.test(fullPath)) {
        reject(`非法路径：${fullPath}`);
        return;
      }
      // 目录不存在
      if (!spaceStore.space[getParentDir(fullPath)]) {
        reject('父目录不存在');
        return;
      }
      if (spaceStore.space[fullPath]) {
        reject('目录/文件已存在');
        return;
      }
      spaceStore.space[fullPath] = item;
      resolve(fullPath);
    });
  },
  /**
   * 删除条目
   * @param key
   * @param recursive
   */
  deleteItem(key: string, recursive = false): Promise<string> {
    return new Promise((resolve, reject) => {
      const fullPath = getFullPath(spaceStore.currentDir, key);
      // 非法路径
      if (!pathReg.test(fullPath)) {
        reject(`非法路径：${fullPath}`);
        return;
      }
      // 目录不存在
      if (!spaceStore.space[fullPath]) {
        reject('目录/文件不存在');
        return;
      }
      const deleteKeyList = [fullPath];
      // 需要递归删除
      if (recursive) {
        for (const spaceKey in spaceStore.space) {
          if (spaceStore.space.hasOwnProperty(spaceKey)) {
            console.log('spaceKey', spaceKey);
            // 跳过根目录
            if (spaceKey === '/') {
              continue;
            }
            if (spaceKey.startsWith(fullPath)) {
              deleteKeyList.push(spaceKey);
            }
          }
        }
      }
      // 移除属性
      deleteKeyList.forEach((deleteKey) => {
        delete spaceStore.space[deleteKey];
      });
      resolve(JSON.stringify(spaceStore.space));
    });
  },
  /**
   * 递归复制目录 copy ./newtest /xxx -r
   */
  copyDirectory(
    sourcePath: string,
    targetPath: string,
    completely: boolean,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const items = spaceActions.listItems(sourcePath, true);
      // console.log("items", items);
      const itemName = getItemName(sourcePath);
      if (completely) {
        // 如果是完全复制，则需要先创建目标目录
        const newDirPath = targetPath + itemName;
        if (!spaceStore.space[newDirPath]) {
          try {
            spaceActions.addItem({
              dir: targetPath,
              name: itemName,
              type: 'dir',
            });
          } catch (err) {
            reject(err);
          }
        }
      }
      for (const item of items) {
        // 计算在目标目录中的路径
        const targetItemPath = completely
          ? targetPath + '/' + itemName + '/' + item.name
          : targetPath + '/' + item.name;
        // const targetItemPath = targetPath + itemName + "/" + item.name;
        // console.log("targetItemPath", targetItemPath);

        // 如果这一项是一个目录，则递归调用 copyDirectory
        if (item.type === 'dir') {
          spaceActions.copyDirectory(item.dir, targetItemPath, completely);
        } else {
          // 否则，直接复制这一项
          spaceStore.space[targetItemPath] = {
            ...item,
            dir: targetPath,
          };
        }
      }
      resolve();
    });
  },
  /**
   * 递归更新目录下全部内容
   */
  updateDirectory(oldPath: string, newName: string): Space.ResultType {
    const items = spaceActions.listItems(oldPath, true);
    for (const item of items) {
      // 计算在目标目录中的路径
      const tempFullPath = getFullPath(item.dir, item.name);
      const tempArr = item.dir.split('/');
      tempArr[1] = newName;
      item.dir = tempArr.join('/');
      spaceActions.addItem({ ...item });
      spaceActions.deleteItem(tempFullPath, false);
    }
    return {
      result: true,
    };
  },
  /**
   *
   * 更新条目（先删除原先的，再添加新的）
   * @param dir
   * @param name
   * @param link
   */
  updateItem(dir: string, name: string, link: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const fullPath = getFullPath(spaceStore.currentDir, dir);
      // 非法路径
      if (!pathReg.test(fullPath)) {
        reject(`非法路径：${fullPath}`);
        return;
      }
      // 目录不存在
      if (!spaceStore.space[fullPath]) {
        reject('目录/文件不存在');
        return;
      }
      if (spaceStore.space[fullPath].type === 'dir') {
        // 递归更新子目录
        const p1 = spaceActions.addItem({
          ...spaceStore.space[fullPath],
          name,
        });
        const p2 = spaceActions.deleteItem(fullPath, false);
        const p3 = spaceActions.updateDirectory(fullPath, name);
        Promise.all([p1, p2, p3])
          .then(() => {
            resolve(fullPath);
          })
          .catch((errMsg) => {
            reject(errMsg);
          });
      } else {
        const newItem = {
          ...spaceStore.space[fullPath],
          name,
          link,
        };
        const p2 = spaceActions.deleteItem(fullPath, false);
        const p1 = spaceActions.addItem(newItem);
        Promise.all([p1, p2])
          .then(() => {
            resolve(fullPath);
          })
          .catch((errMsg) => {
            reject(errMsg);
          });
      }
    });
  },

  /**
   * 复制条目
   * @param source
   * @param target
   * @param recursive
   * 需要注意的是，复制的文件或目录以原目录或文件名命名
   */
  copyItem(
    source: string,
    target: string,
    recursive = false,
    completely = false,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // e.g. /a/b => /a/c
      const sourceFullPath = getFullPath(spaceStore.currentDir, source);
      const targetFullPath = getFullPath(spaceStore.currentDir, target);
      // 非法路径
      if (!pathReg.test(sourceFullPath)) {
        reject(`非法路径：${sourceFullPath}`);
        return;
      }
      if (!pathReg.test(targetFullPath)) {
        reject(`非法路径：${targetFullPath}`);
        return;
      }
      // 源条目不存在
      const sourceItem = spaceStore.space[sourceFullPath];
      if (!sourceItem) {
        console.log('sourceFullPath', sourceFullPath);
        reject('原条目不存在');
        return;
      }
      // 复制目录必须开启递归
      if (sourceItem.type === 'dir' && !recursive) {
        reject('复制目录必须开启递归');
        return;
      }

      // 目标条目已存在
      const tempPath = targetFullPath + '/' + getItemName(sourceFullPath);
      // 如果是复制目录，允许只复制目录下的内容
      if (sourceItem.type === 'link' && spaceStore.space[tempPath]) {
        reject('目标条目已存在');
        return;
      }
      // 目标目录不存在
      if (!spaceStore.space[targetFullPath]) {
        reject('目标目录不存在');
        return;
      }
      if (sourceItem.type === 'dir' && recursive) {
        spaceActions
          .copyDirectory(sourceFullPath, targetFullPath, completely)
          .then(() => {
            resolve(targetFullPath);
          })
          .catch((errMsg) => {
            reject(errMsg);
          });
        return;
      }

      const targetItem = { ...sourceItem };
      targetItem.dir = targetFullPath;
      targetItem.name = getItemName(sourceFullPath);
      spaceActions
        .addItem(targetItem)
        .then(() => {
          resolve(targetFullPath);
        })
        .catch((errMsg) => {
          reject(errMsg);
        });
    });
  },
  /**
   * 移动条目（等同于复制 + 删除）
   * @param source
   * @param target
   * @param recursive
   */
  moveItem(
    source: string,
    target: string,
    recursive = false,
    completely = false,
  ): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        await spaceActions.copyItem(source, target, recursive, completely);
        await spaceActions.deleteItem(source, recursive);
        resolve('移动成功');
      } catch (errMsg) {
        reject(errMsg);
      }
      // const p1 = spaceActions.copyItem(source, target, recursive, completely);
      // const p2 = spaceActions.deleteItem(source, recursive);
      // Promise.all([p1, p2])
      //   .then(() => {
      //     resolve('移动成功');
      //   })
      //   .catch((errMsg) => {
      //     reject(errMsg);
      //   });
    });
  },
  /**
   * 更新当前所在目录
   * @param newDir
   */
  updateCurrentDir(newDir: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let fullPath = getFullPath(spaceStore.currentDir, newDir);
      // console.log("fullPath", fullPath);

      // 非法路径
      if (!pathReg.test(fullPath)) {
        reject(`非法路径：${fullPath}`);
        return;
      }
      // 上层目录
      if (newDir === '../') {
        // 已经是根目录，无法到上层
        if (spaceStore.currentDir === '/') {
          reject('已经是根目录');
          return;
        } else {
          fullPath = getParentDir(spaceStore.currentDir);
        }
      }
      // 目录不存在
      if (
        !spaceStore.space[fullPath] ||
        spaceStore.space[fullPath].type !== 'dir'
      ) {
        // 尝试将最后的斜杠去掉
        const temp = fullPath.slice(0, -1);
        if (spaceStore.space[temp]) {
          spaceStore.currentDir = temp;
          resolve(temp);
        }
        reject('目录不存在');
        return;
      }
      spaceStore.currentDir = fullPath;
      resolve(fullPath);
    });
  },
  /**
   * 路径补全
   */
  autoCompletePath(pathProp: string): string {
    // 根据当前路径(默认)以及用户输入的部分路径进行补全
    // e.g. ./createDir/zhi  => ./createDir/zhihu
    // e.g. ./crea  => ./createDir
    // e.g. ../zhi  => ../zhihu
    // e.g. zhi  => ./zhihu
    let path = pathProp;
    let index = path.lastIndexOf('/') + 1;
    if (index === 0) {
      // 处理e.g createDir => ./createDir
      path = './' + path;
      index = 2;
    }
    const prePath = path.substring(0, index);
    const nxtPath = path.substring(index);
    // 调用 getFullPath 处理./ ../
    const tempName = getFullPath(spaceStore.currentDir, prePath);
    // 拼接可能的路径前缀

    const result = Object.keys(spaceStore.space).filter((key) =>
      key.startsWith(tempName + nxtPath),
    )[0];
    if (result) {
      //返回用户输入的部分路径
      return prePath + result.substring(tempName.length);
    }
    return '';
  },
};

export const SpaceStore = () => {
  return {
    ...spaceStore,
    ...spaceActions,
  };
};

/**
 * 订阅spaceStore发请求保存数据
 */
// 订阅
subscribe(spaceStore, async () => {
  console.log('spaceStore changed', spaceStore);
  if (userDerived.isLogin) {
    try {
      if (!executeUpdate) {
        // 跳过一次更新
        troggerExecuteUpdate();
        return;
      }
      await updateSpace(spaceStore);
    } catch (e) {
      message.error('数据保存失败');
    }
  } else {
    message.warning('请先登录，否则数据无法保存');
  }
});
