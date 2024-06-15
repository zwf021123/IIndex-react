import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import './index.less';

const TimingBox: React.FC<{ seconds: string }> = ({ seconds }) => {
  // 剩余时间
  const [leftTime, setLeftTime] = useState<number>(Number(seconds));
  const leftTimeRef = useRef<number>(Number(seconds));
  // 运行中
  const [start, setStart] = useState<boolean>(true);
  // 定时器
  let interval = useRef<number>();
  /**
   * 暂停 / 运行
   */
  const toggleStart = () => {
    setStart(!start);
  };

  /**
   * 避免闭包陷阱
   */
  useEffect(() => {
    leftTimeRef.current = leftTime;
  }, [leftTime]);

  /**
   * 开始计时
   */
  useEffect(() => {
    if (!leftTimeRef.current) {
      return;
    }
    interval.current = window.setInterval(() => {
      if (start) {
        setLeftTime((leftTime) => leftTime - 1);
      }
      console.log('leftTimeRef.current', leftTimeRef.current);

      if (leftTimeRef.current <= 1) {
        alert(`${seconds} 秒倒计时结束`);
        clearInterval(interval.current);
      }
    }, 1000);
    return () => {
      clearInterval(interval.current);
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
