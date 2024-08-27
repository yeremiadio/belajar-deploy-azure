import React from 'react';
import Lazyload from '@/components/LazyLoad';

const MachinePageLazy = React.lazy(
  () => import('@/pages/Management/Machine/Machine'),
);

const ManagementMachinePage = () => {
  return <Lazyload component={MachinePageLazy} />;
};

export default ManagementMachinePage;
