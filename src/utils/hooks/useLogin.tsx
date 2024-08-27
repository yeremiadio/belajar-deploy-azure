import { useState } from 'react';

import { useGetLoginMutation } from '@/stores/authStore/authStoreApi';

import { saveTheseCookies } from '@/services/cookie';

import { LoginFormData } from '@/types/api/auth';

export default function useLogin() {
  const [loading, setLoading] = useState<boolean>(false);

  const [_login] = useGetLoginMutation();

  const login = async (loginObj: LoginFormData) => {
    setLoading(true);
    try {
      const response = await _login(loginObj).unwrap();
      if (response.status === 'success') {
        const userData = response.data;
        const { jwt, exp } = userData;
        const expirationDate = new Date(exp * 1000);
        const loggedUserObject = {
          token: jwt,
          userId: userData?.id.toString() ?? '',
          username: userData?.username ?? '',
          companyName: userData?.companyName ?? '',
          usertypeName: userData?.usertypeName ?? '',
          companyId: userData?.companyId?.toString() ?? "",
          permissions: userData?.permissions
            ? JSON.stringify(userData?.permissions)
            : '',
        };
        saveTheseCookies(loggedUserObject, { expires: expirationDate });
        return {
          status: response.status,
          data: response.data,
        };
      }
    } catch (error) {
      const errorMessage =
        (error as { data?: { message: string } }).data?.message ??
        'Terjadi Kesalahan, Silahkan Coba Lagi.';
      setLoading(false);
      return {
        status: (error as { status: string }).status,
        message: errorMessage,
      };
    }
  };

  return { login, loading };
}
