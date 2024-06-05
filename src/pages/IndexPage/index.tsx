import Terminal from '@/components/Terminal';
import { doCommandExecute } from '@/core/commandExecutor';
import { useRef } from 'react';
import './index.less';

const HomePage: React.FC = () => {
  const terminalRef = useRef(null);

  const onSubmitCommand = async (inputText: string) => {
    if (!inputText) {
      return;
    }
    const terminal = terminalRef.current.terminal;
    await doCommandExecute(inputText, terminal);
  };

  return (
    <Terminal fullScreen={true} onSubmitCommand={onSubmitCommand}></Terminal>
  );
};

export default HomePage;
