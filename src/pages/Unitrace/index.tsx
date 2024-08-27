import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const UnitraceLazy = lazy(() => import('@/pages/Unitrace/UnitracePage'));

const UnitracePage = () => {
  return <Lazyload component={UnitraceLazy} />;
};

export default UnitracePage;
