import './BiliBiliBox.less';

interface MusicBoxProps {
  bvid: string;
}

const BilibiliBox: React.FC<MusicBoxProps> = ({ bvid }) => {
  const videoPath = `https://player.bilibili.com/player.html?bvid=${bvid}`;
  return (
    <div>
      <iframe
        className="main"
        frameBorder={0}
        marginWidth={0}
        marginHeight={0}
        src={videoPath}
      />
    </div>
  );
};
export default BilibiliBox;
