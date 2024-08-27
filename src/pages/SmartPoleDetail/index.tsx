import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const SmartPoleDetailLazy = lazy(
  () => import("@/pages/SmartPoleDetail/SmartPoleDetailPage")
);

const SmartPoleDetailPage = () => {
  return <Lazyload component={SmartPoleDetailLazy} />;
};

export default SmartPoleDetailPage;
