import { loadCookie } from '@/services/cookie';

import { KnownRoleUserEnum } from '@/types/api/user';

const useRoleUser = () => {
  const role = loadCookie('usertypeName') as KnownRoleUserEnum | undefined;
  return role;
};

export default useRoleUser;
