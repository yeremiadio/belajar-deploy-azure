import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const SmartPoleLazy = lazy(() => import("@/pages/SmartPole/SmartPole"));

const SmartPolePage = () => {
  return <Lazyload component={SmartPoleLazy} />;
};

export default SmartPolePage;
