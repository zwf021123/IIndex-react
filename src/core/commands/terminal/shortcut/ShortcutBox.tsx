import { shortcutList } from '@/constants/shortcut';
import { Col, Row } from 'antd';

const ShortCutBox = () => {
  return (
    <div>
      <div>快捷键：</div>
      {shortcutList.map((shortcut, index) => {
        return (
          <div key={index}>
            {shortcut.desc && (
              <Row gutter={16}>
                <Col span={4}>{shortcut.keyDesc ?? shortcut.code}</Col>
                <Col span={4}>{shortcut.desc}</Col>
              </Row>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ShortCutBox;
