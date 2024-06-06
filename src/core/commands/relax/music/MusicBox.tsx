interface MusicBoxProps {
  musicPath: string;
}

const MusicBox: React.FC<MusicBoxProps> = ({ musicPath }) => {
  // onMounted(async () => {
  //   // 搜索音乐，返回 id
  //   const res: any = await getSingleMusic(name.value);

  //   if (res?.code === 0) {
  //     const music = res.data;
  //     musicPath.value = `//music.163.com/outchain/player?type=2&id=${music.id}&auto=1&height=66`;
  //   } else {
  //     errorHint.value = "未找到音乐";
  //   }
  // });
  return (
    <div>
      {musicPath && (
        <iframe
          frameBorder={0}
          marginWidth={0}
          marginHeight={0}
          width="330"
          height="86"
          src={musicPath}
        />
      )}
    </div>
  );
};

export default MusicBox;
