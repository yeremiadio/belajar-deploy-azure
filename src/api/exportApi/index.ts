import axios, { AxiosRequestConfig } from 'axios';

import { UsedAPI } from '@/utils/configs/endpoint';
import { downloadCSVWithBearerToken } from '@/utils/functions/downloadCSVWithBearerToken';

import { loadCookie } from '@/services/cookie';

export const exportAPI = async (name: string, query?: URLSearchParams) => {
  const url =
    `${UsedAPI}/${name}/export` + (query ? `?${query.toString()}` : '');

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${loadCookie('token')}`,
      'Content-Type': 'text/csv',
    },
    responseType: 'blob',
  };
  try {
    const response = await axios.get(url, config);
    downloadCSVWithBearerToken(response, `${name}.csv`);
    return true;
  } catch (e) {
    console.error('Error:', e);
    return false;
  }
};
