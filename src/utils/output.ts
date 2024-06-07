/**
 * 匹配网址正则
 */
const URL_REG =
  /(((https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

/**
 * 识别文本中的超链接并转换为a标签
 * @param text
 */
export const smartText = (text?: string) => {
  if (!text) {
    return '';
  }
  const reg = new RegExp(URL_REG, 'gi');
  return text.replaceAll(reg, "<a href='$1' target='_blank'>$1</a>");
};

/**
 * 获取选项关键词
 * @param option
 */
export const getOptionKey = (option: Command.CommandOptionType) => {
  // 优先用简写
  if (option.alias && option.alias.length > 0) {
    return '-' + option.alias[0];
  }
  return '--' + option.key;
};

/**
 * 获取选项关键词列表
 * @param option
 */
export const getOptionKeyList = (option: Command.CommandOptionType) => {
  const list = [];
  // 优先用简写
  if (option.alias && option.alias.length > 0) {
    list.push('-' + option.alias[0]);
  }
  list.push('--' + option.key);
  return list;
};

/**
 * 拼接用法字符串
 * @param command
 * @param parentCommand
 */
export const getUsageStr = (
  command: Command.CommandType,
  parentCommand?: Command.CommandType,
) => {
  if (!command) {
    return '';
  }
  let str = '';
  if (parentCommand) {
    str = parentCommand.func + ' ';
  }
  str += command.func;
  if (command.params && command.params.length > 0) {
    const paramsStrList: string[] = command.params.map((param) => {
      let word = param.key;
      if (param.desc) {
        word = param.desc;
      }
      if (param.required) {
        return `<${word}>`;
      } else {
        return `[${word}]`;
      }
    });
    str += ' ' + paramsStrList.join(' ');
  }
  if (command.options?.length > 0) {
    const optionStrList: string[] = command.options.map((option) => {
      const optionKey = getOptionKey(option);
      if (option.type === 'boolean') {
        let word = optionKey;
        if (option.desc) {
          word += ` ${option.desc}`;
        }
        if (option.required) {
          return `<${word}>`;
        } else {
          return `[${word}]`;
        }
      } else {
        let word = option.key;
        if (option.desc) {
          word = option.desc;
        }
        if (option.required) {
          return `<${optionKey} ${word}>`;
        } else {
          return `[${optionKey} ${word}]`;
        }
      }
    });
    str += ' ' + optionStrList.join(' ');
  }
  return str;
};
