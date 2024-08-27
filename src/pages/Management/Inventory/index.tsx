import React from 'react';
import Lazyload from '@/components/LazyLoad';

const LocationPageLazy = React.lazy(
  () => import('@/pages/Management/Inventory/InventoryPage'),
);

const ManagementInventoryPage = () => {
  return <Lazyload component={LocationPageLazy} />;
};

export default ManagementInventoryPage;
