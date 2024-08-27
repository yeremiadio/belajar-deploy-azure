import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const ForestFireDetailLazy = lazy(
  () => import('@/pages/ForestFireDetail/ForestFireDetailPage'),
);

const ForestFireDetailPage = () => {
  return <Lazyload component={ForestFireDetailLazy} />;
};

export default ForestFireDetailPage;
