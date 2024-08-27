import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const ReservationLazy = lazy(
  () => import('@/pages/Reservation/ReservationList/ReservationPage'),
);

const ReservationPage = () => {
  return <Lazyload component={ReservationLazy} />;
};

export default ReservationPage;
