import { Button } from 'antd';
import { useEffect, useState } from 'react';

const TimingBox: React.FC<{ seconds: string }> = ({ seconds }) => {
  // 剩余时间
  const [leftTime, setLeftTime] = useState<number>(Number(seconds));
  // 运行中
  const [start, setStart] = useState<boolean>(true);
  // 定时器
  let interval: number;
  /**
   * 暂停 / 运行
   */
  const toggleStart = () => {
    setStart(!start);
  };
  useEffect(() => {
    if (!leftTime) {
      return;
    }
    interval = window.setInterval(() => {
      if (start) {
        setLeftTime(leftTime - 1);
      }
      if (leftTime <= 0) {
        alert(`${seconds} 秒倒计时结束`);
        if (interval) {
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <div>
      <div>倒计时：{seconds} 秒</div>
      <div>
        剩余：{leftTime} 秒
        {leftTime > 0 && (
          <Button size="small" ghost danger={!start} onClick={toggleStart}>
            {start ? '暂停' : '继续'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimingBox;
