import { Popover } from 'antd';
import './HotBox.less';
interface MusicBoxProps {
  songList: Array<any>;
}

const HotBox: React.FC<MusicBoxProps> = ({ songList }) => {
  return (
    <div>
      {songList.map((song, index) => {
        return (
          <div key={index}>
            <Popover
              placement="right"
              content={
                <img src={song?.al?.picUrl} width="260" alt={song?.al?.name} />
              }
            >
              <img
                className="songCover"
                src={song?.al?.picUrl}
                height="25"
                alt=""
              />
            </Popover>
            <a
              href={`https://music.163.com/#/song?id=${song?.id}`}
              target="_blank"
              rel="noreferrer"
            >
              {song?.al?.name}
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default HotBox;
