import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const PurchaseOrderCreateLazy = lazy(
  () =>
    import('@/pages/PurchaseOrder/PurchaseOrderCreate/PurchaseOrderCreatePage'),
);

const PurchaseOrderPage = () => {
  return <Lazyload component={PurchaseOrderCreateLazy} />;
};

export default PurchaseOrderPage;
