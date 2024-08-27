import { loadCookie } from '@/services/cookie';

import { KnownUsertype } from '@/types/api/user';

const useUserType = () => {
  const userType = loadCookie('usertypeName') as KnownUsertype | undefined;
  return userType;
};

export default useUserType;
