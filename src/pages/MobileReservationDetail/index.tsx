import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const MobileReservationDetailLazy = lazy(
  () => import('@/pages/MobileReservationDetail/MobileReservationDetailPage'),
);

const MobileReservationDetailPage = () => {
  return <Lazyload component={MobileReservationDetailLazy} />;
};

export default MobileReservationDetailPage;
