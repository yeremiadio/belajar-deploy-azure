import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const WaterLevelDetailLazy = lazy(
  () => import('@/pages/WaterLevelDetail/WaterLevelDetail'),
);

const WaterLevelDetailPage = () => {
  return <Lazyload component={WaterLevelDetailLazy} />;
};

export default WaterLevelDetailPage;
