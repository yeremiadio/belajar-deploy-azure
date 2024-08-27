import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const ManagementDevicePageLazy = lazy(
  () => import('@/pages/Management/Device/DevicePage'),
);

const ManagementDevicePage = () => {
  return <Lazyload component={ManagementDevicePageLazy} />;
};

export default ManagementDevicePage;
