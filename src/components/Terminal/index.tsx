import React, { useState } from 'react';
import { Spin, Button } from 'antd';

const Terminal: React.FC = () => {

  const [spinning, setSpinning] = useState(false);

  return (
    <div className="terminal-wrapper">
      <Button>11</Button>
    <Spin
      className="loading"
      tip="Loading..."
      size="large"
      spinning={spinning}
    />
    </div>
  );
};

export default Terminal;
