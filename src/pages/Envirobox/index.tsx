import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const EnviroboxLazy = lazy(() => import('@/pages/Envirobox/EnviroboxPage'));

const EnergyMeterPage = () => {
  return <Lazyload component={EnviroboxLazy} />;
};

export default EnergyMeterPage;
