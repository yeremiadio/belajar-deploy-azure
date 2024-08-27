import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const MobileReservationLazy = lazy(
  () => import('@/pages/MobileReservation/MobileReservationPage'),
);

const MobileReservationPage = () => {
  return <Lazyload component={MobileReservationLazy} />;
};

export default MobileReservationPage;
