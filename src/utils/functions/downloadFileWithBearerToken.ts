import axios, { AxiosRequestConfig } from 'axios';
import { UsedAPI } from '../configs/endpoint';
import { loadCookie } from '@/services/cookie';

export const downloadFileWithBearerToken = async (fileUrl: string) => {
  const url = `${UsedAPI}${fileUrl}`;

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${loadCookie('token')}`,
      'Content-Type': 'application/octet-stream',
    },
    responseType: 'blob',
  };

  try {
    const response = await axios.get(url, config);
    const contentDisposition = response.headers['content-disposition'];
    const nameFromServer = contentDisposition
      ? contentDisposition.split('=')[1].replace(/"/g, '')
      : 'file';
    const objUrl = window.URL.createObjectURL(
      new Blob([response.data], { type: response.headers['content-type'] }),
    );
    const link = document.createElement('a');
    link.href = objUrl;

    const extension = nameFromServer.split('.').pop();
    const fileName = nameFromServer.split('.').slice(0, -1).join('.');

    let actualFileName = '';
    switch (extension) {
      case 'sheet':
        actualFileName = `${fileName}.xlsx`;
        break;
      case 'document':
        actualFileName = `${fileName}.docx`;
        break;
      default:
        actualFileName = nameFromServer;
    }

    link.download = actualFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error:', error);
  }
};
