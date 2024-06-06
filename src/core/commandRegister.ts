import dateCommand from './commands/dateCommand';
import ddosCommand from './commands/ddos/ddosCommand';
import gotoCommand from './commands/gotoCommand';
import hotCommand from './commands/hot/hotCommand';
import pingCommand from './commands/pingCommand';
import moyuCommand from './commands/relax/moyu/moyuCommand';
import musicCommand from './commands/relax/music/musicCommand';
import searchCommands from './commands/search/searchCommands';
import spaceCommands from './commands/space';
import {
  backgroundCommand,
  clearCommand,
  helpCommand,
  hintCommand,
  historyCommand,
  infoCommand,
  resetCommand,
  shortcutCommand,
  welcomeCommand,
} from './commands/terminal';
import timingCommand from './commands/timing/timingCommand';
import todoCommand from './commands/todo/todoCommand';
import translateCommand from './commands/translate/translateCommand';
import userCommands from './commands/user/userCommands';
import varbookCommand from './commands/varbook/varbookCommand';
/**
 * 命令列表（数组元素顺序会影响 help 命令的展示顺序，命令命名会影响提示）
 */
const commandList: Command.CommandType[] = [
  shortcutCommand,
  gotoCommand,
  ...searchCommands,
  ...spaceCommands,
  ...userCommands,
  varbookCommand,
  hotCommand,
  todoCommand,
  timingCommand,
  dateCommand,
  clearCommand,
  historyCommand,
  translateCommand,
  helpCommand,
  infoCommand,
  pingCommand,
  musicCommand,
  ddosCommand,
  moyuCommand,
  welcomeCommand,
  backgroundCommand,
  resetCommand,
  hintCommand,
];

/**
 * 命令字典
 * 将命令的 func（或其他别名） 作为 key，方便查找
 */
const commandMap: Record<string, Command.CommandType> = {};

commandList.forEach((command) => {
  commandMap[command.func] = command;
  command.alias?.forEach((name) => {
    commandMap[name] = command;
  });
});

export { commandList, commandMap };
