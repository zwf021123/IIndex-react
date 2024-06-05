/**
 * 快捷键类型
 */
interface ShortcutType {
  code: string; // 按键码
  desc?: string; // 功能描述
  keyDesc?: string; // 按键描述
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  action: (e: Event, terminal: Terminal.TerminalType) => void;
}

/**
 * 快捷键列表
 */
export const shortcutList: ShortcutType[] = [
  {
    desc: "清屏",
    code: "KeyL",
    keyDesc: "Ctrl + L",
    ctrlKey: true,
    action(e, terminal) {
      e.preventDefault();
      terminal.clear();
    },
  },
  {
    desc: "折叠",
    code: "KeyO",
    keyDesc: "Ctrl + O",
    ctrlKey: true,
    action(e, terminal) {
      e.preventDefault();
      terminal.toggleAllCollapse();
    },
  },
  {
    desc: "粘贴",
    code: "KeyV",
    keyDesc: "Ctrl + V",
    metaKey: true,
    action(e, terminal) {
      terminal.focusInput();
    },
  },
  {
    code: "Tab",
    action(e, terminal) {
      e.preventDefault();
      if (terminal.isInputFocused()) {
        terminal.setTabCompletion();
      } else {
        terminal.focusInput();
      }
    },
  },
  {
    code: "Backspace",
    action(e, terminal) {
      terminal.focusInput();
    },
  },
  {
    code: "Enter",
    action(e, terminal) {
      terminal.focusInput();
    },
  },
  {
    desc: "查看上一条命令",
    code: "ArrowUp",
    keyDesc: "↑",
    action(e, terminal) {
      e.preventDefault();
      terminal.showPrevCommand();
    },
  },
  {
    desc: "查看下一条命令",
    code: "ArrowDown",
    keyDesc: "↓",
    action(e, terminal) {
      e.preventDefault();
      terminal.showNextCommand();
    },
  },
];
