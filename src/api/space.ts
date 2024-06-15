import myAxios from '@/requests/myAxios';

export const getCurrentSpace = () => {
  return myAxios.post('/space/current');
};

export const updateSpace = (spaceData: Space.SpaceStateType) => {
  return myAxios.post('/space/update', spaceData);
};
