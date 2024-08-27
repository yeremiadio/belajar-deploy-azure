import React from 'react';
import Lazyload from '@/components/LazyLoad';

const InventoryInOutStockPageLazy = React.lazy(
  () => import('@/pages/Inventory/InOutStock/InOutStockPage'),
);

const InventoryInOutStockPage = () => {
  return <Lazyload component={InventoryInOutStockPageLazy} />;
};

export default InventoryInOutStockPage;
