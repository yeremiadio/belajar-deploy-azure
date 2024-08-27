import React from 'react';

import Lazyload from '@/components/LazyLoad';

const AccountPageLazy = React.lazy(
  () => import('@/pages/Management/Account/AccountPage'),
);

const ManagementAccountPage = () => {
  return <Lazyload component={AccountPageLazy} />;
};

export default ManagementAccountPage;
