import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const MobileReservationConfirmLazy = lazy(
  () => import('@/pages/MobileReservationConfirm/MobileReservationConfirmPage'),
);

const MobileReservationConfirmPage = () => {
  return <Lazyload component={MobileReservationConfirmLazy} />;
};

export default MobileReservationConfirmPage;
