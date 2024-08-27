import React from 'react';

import Lazyload from '@/components/LazyLoad';

const MachineMonitoringLazy = React.lazy(
  () => import("@/pages/MachineMonitoring/MachineMonitoringPage")
);

const MachineMonitoringPage = () => {
  return <Lazyload component={MachineMonitoringLazy} />;
};

export default MachineMonitoringPage;
