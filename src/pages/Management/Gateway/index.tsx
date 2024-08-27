import React from 'react';
import Lazyload from '@/components/LazyLoad';

const GatewayPageLazy = React.lazy(
  () => import('@/pages/Management/Gateway/GatewayPage'),
);

const ManagementGatewayPage = () => {
  return <Lazyload component={GatewayPageLazy} />;
};

export default ManagementGatewayPage;
