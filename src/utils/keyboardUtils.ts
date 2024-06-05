import { shortcutList } from "@/constants/shortcut";

/**
 * 注册快捷键
 * @param terminal
 */
export const registerShortcuts = (terminal: Terminal.TerminalType) => {
  document.onkeydown = (e) => {
    // console.log(e);
    let key = e.key;
    // 自动聚焦输入框
    if (key >= "a" && key <= "z" && !e.metaKey && !e.shiftKey && !e.ctrlKey) {
      terminal.focusInput();
      return;
    }
    // 匹配快捷键
    let code = e.code;
    for (const shortcut of shortcutList) {
      if (
        code === shortcut.code &&
        e.ctrlKey === !!shortcut.ctrlKey &&
        e.metaKey === !!shortcut.metaKey &&
        e.shiftKey === !!shortcut.shiftKey
      ) {
        shortcut.action(e, terminal);
      }
    }
  };
};

