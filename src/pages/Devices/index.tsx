import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const DevicesPageLazy = lazy(() => import("@/pages/Devices/DevicesPage"));

const DevicesPage = () => {
  return <Lazyload component={DevicesPageLazy} />;
};

export default DevicesPage;
