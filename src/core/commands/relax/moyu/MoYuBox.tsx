import { useRef } from 'react';
import './MoYuBox.less';

const MoYuBox = () => {
  const gameList = [
    'https://haiyong.site/moyu/shitoujiandaobu/',
    'https://haiyong.site/moyu/lion.html',
    'https://haiyong.site/moyu/shengchengshu.html',
    'https://haiyong.site/moyu/zhipaijiyi.html',
    'https://haiyong.site/moyu/doumao.html',
    'https://haiyong.site/moyu/dadishu.html',
    'https://haiyong.site/moyu/laganziguoguan/',
    'https://haiyong.site/moyu/danzhu.html',
    'https://haiyong.site/moyu/doudizhu.html',
    'https://haiyong.site/moyu/tiaofangzi.html',
    'https://haiyong.site/moyu/SpaceHuggers/',
    'https://haiyong.site/moyu/weijing/',
  ];
  console.log('moyu组件重新渲染', 1);

  const currentGame = useRef<string>('');
  if (!currentGame.current) {
    currentGame.current = gameList[Math.floor(Math.random() * gameList.length)];
  }
  return (
    <div style={{ margin: '8px 0' }}>
      <iframe
        src={currentGame.current}
        className="main"
        frameBorder="no"
        scrolling="no"
        marginWidth={0}
        marginHeight={0}
      />
    </div>
  );
};

export default MoYuBox;
