import { proxy, subscribe } from '@umijs/max';
import _ from 'lodash';

interface configType {
  background: string;
  showHint: boolean;
  welcomeTexts: string[];
  [key: string]: any;
}

const initConfig: configType = {
  // 背景
  background: 'black',
  // 输入提示
  showHint: true,
  // 终端欢迎语
  welcomeTexts: [] as string[],
};

export const configStore = proxy<configType>(
  JSON.parse(localStorage.getItem('config-store')) || {
    ...initConfig,
  },
);

export const configActions = {
  setBackground(url: string) {
    if (!url) {
      return;
    }
    configStore.background = url;
  },
  /**
   * 设置或反转提示
   * @param hint
   * @return 修改后的提示开启 / 关闭状态
   */
  setOrToggleShowHint(hint?: string): boolean {
    // 反转提示
    if (!hint) {
      configStore.showHint = !configStore.showHint;
      return configStore.showHint;
    }
    // 设置提示
    if (hint === 'on') {
      configStore.showHint = true;
    } else if (hint === 'off') {
      configStore.showHint = false;
    }
    return configStore.showHint;
  },
  /**
   * 修改终端提示语
   * @param welcomeTexts
   */
  setWelcomeTexts(welcomeTexts: string[]) {
    configStore.welcomeTexts = welcomeTexts;
  },
  reset() {
    const resetObj = _.cloneDeep(initConfig);
    Object.keys(resetObj).forEach((key: string) => {
      configStore[key] = resetObj[key];
    });
  },
};

export const TerminalConfigStore = () => {
  return {
    ...configActions,
    ...configStore,
  };
};

// 订阅
subscribe(configStore, () => {
  console.log('configStore changed', configStore);
  localStorage.setItem('config-store', JSON.stringify(configStore));
});
