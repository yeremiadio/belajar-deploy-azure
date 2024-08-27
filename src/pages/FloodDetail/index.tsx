import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const FloodDetailLazy = lazy(() => import('@/pages/FloodDetail/FloodDetail'));

const FloodDetailPage = () => {
  return <Lazyload component={FloodDetailLazy} />;
};

export default FloodDetailPage;
