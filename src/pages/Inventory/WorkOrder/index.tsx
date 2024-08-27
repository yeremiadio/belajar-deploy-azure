import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const InventoryWorkOrderPageLazy = lazy(
  () => import('@/pages/Inventory/WorkOrder/WorkOrderPage'),
);

const InventoryWorkOrderPage = () => {
  return <Lazyload component={InventoryWorkOrderPageLazy} />;
};

export default InventoryWorkOrderPage;
