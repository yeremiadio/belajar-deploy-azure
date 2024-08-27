import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const WaterLevelLazy = lazy(() => import("@/pages/WaterLevel/WaterLevelPage"));

const WaterLevelPage = () => {
  return <Lazyload component={WaterLevelLazy} />;
};

export default WaterLevelPage;
