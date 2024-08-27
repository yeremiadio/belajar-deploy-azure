import { useMemo } from 'react';

import { getDefaultRouteByUserTypeName } from '@/utils/functions/auth';

import useUserType from './auth/useUserType';

const useDefaultRouteUser = () => {
  const usertypeName = useUserType();
  return useMemo(() => {
    return getDefaultRouteByUserTypeName(usertypeName);
  }, [usertypeName]);
};

export default useDefaultRouteUser;
