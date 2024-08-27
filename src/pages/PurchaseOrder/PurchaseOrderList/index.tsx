import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const PurchaseOrderListPageLazy = lazy(
  () => import('@/pages/PurchaseOrder/PurchaseOrderList/PurchaseOrderListPage'),
);

const PurchaseOrderList = () => {
  return <Lazyload component={PurchaseOrderListPageLazy} />;
};

export default PurchaseOrderList;
