const InfoBox: React.FC = () => {
  return (
    <>
      <div>关于本站：IIndex 程序员的定制化浏览器主页</div>
      <div>
        <a
          href="https://github.com/zwf021123/IIndex-react"
          target="_blank"
          rel="noreferrer"
        >
          代码开源，欢迎 star 和贡献~
        </a>
      </div>
      <div></div>
      <div>
        作者：
        <a href="https://github.com/zwf021123" target="_blank" rel="noreferrer">
          {' '}
          zwf021123{' '}
        </a>
      </div>
    </>
  );
};

export default InfoBox;
