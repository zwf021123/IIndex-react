// 全局共享数据示例
import { LOCAL_USER } from '@/constants/user';
import { useState } from 'react';

const useUser = () => {
  const [user,setUser] = useState<User.UserType>(LOCAL_USER);
  return {
    user,
    setUser,
  };
};

export default useUser;
