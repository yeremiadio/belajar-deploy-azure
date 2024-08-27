import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const ReservationLazy = lazy(
  () => import('@/pages/Reservation/ReservationVendor/ReservationVendorPage'),
);

const ReservationVendor = () => {
  return <Lazyload component={ReservationLazy} />;
};

export default ReservationVendor;
