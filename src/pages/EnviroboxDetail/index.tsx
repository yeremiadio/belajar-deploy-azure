import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const EnviroboxDetailLazy = lazy(
  () => import('@/pages/EnviroboxDetail/EnviroboxDetailPage'),
);

const EnviroboxDetailPage = () => {
  return <Lazyload component={EnviroboxDetailLazy} />;
};

export default EnviroboxDetailPage;
