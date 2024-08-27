import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const SmartPoleDetailV2Lazy = lazy(
  () => import('@/pages/SmartPoleDetailV2/SmartPoleDetailV2'),
);

const SmartPoleDetailV2Page = () => {
  return <Lazyload component={SmartPoleDetailV2Lazy} />;
};

export default SmartPoleDetailV2Page;
