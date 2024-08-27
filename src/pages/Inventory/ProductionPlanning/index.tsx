import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const ProductionPlanningLazy = lazy(
  () => import('@/pages/Inventory/ProductionPlanning/ProductionPlanning'),
);

const ProductionPlanning = () => {
  return <Lazyload component={ProductionPlanningLazy} />;
};

export default ProductionPlanning;
