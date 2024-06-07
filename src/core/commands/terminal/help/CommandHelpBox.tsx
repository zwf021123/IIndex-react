import { getOptionKeyList, getUsageStr } from '@/utils/output';

interface HelpBoxProps {
  command: Command.CommandType;
  parentCommand: Command.CommandType;
}

const CommandHelpBox: React.FC<HelpBoxProps> = ({ command, parentCommand }) => {
  const usageStr = getUsageStr(command, parentCommand);

  return (
    <div>
      <div>命令：{command.name}</div>
      {command.desc && <div>描述：{command.desc}</div>}
      {command.alias && command.alias.length > 0 && (
        <div>别名：{command.alias.join(', ')}</div>
      )}
      <div>用法：{usageStr}</div>
      {command.subCommands && Object.keys(command.subCommands).length && (
        <>
          <div>子命令：</div>
          <ul style={{ marginBottom: 0 }}>
            {Object.keys(command.subCommands).map((key, index) => {
              const subCommand = command!.subCommands![key];
              return (
                <li key={index}>
                  {subCommand.func}
                  {subCommand.name}
                  {subCommand.desc}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {command.options.length > 0 && (
        <>
          <div>选项：</div>
          <ul style={{ marginBottom: 0 }}>
            {command.options.map((option, index) => {
              return (
                <li key={index}>
                  {getOptionKeyList(option).join(', ')}
                  {option.required ? '必填' : '可选'}
                  {option.defaultValue ? `默认：${option.defaultValue}` : ''}
                  {option.desc}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
};

export default CommandHelpBox;
