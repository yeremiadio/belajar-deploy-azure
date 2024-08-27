import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const EnergyMeterLazy = lazy(
  () => import("@/pages/EnergyMeter/EnergyMeterPage")
);

const EnergyMeterPage = () => {
  return <Lazyload component={EnergyMeterLazy} />;
};

export default EnergyMeterPage;
