import React from 'react';
import Lazyload from '@/components/LazyLoad';

const AlertPageLazy = React.lazy(
  () => import('@/pages/Management/Alert/AlertPage'),
);

const ManagementAlertPage = () => {
  return <Lazyload component={AlertPageLazy} />;
};

export default ManagementAlertPage;
