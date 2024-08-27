import React from 'react';

import Lazyload from '@/components/LazyLoad';

const LocationPageLazy = React.lazy(
  () => import('@/pages/Management/Location/LocationPage'),
);

const ManagementLocationPage = () => {
  return <Lazyload component={LocationPageLazy} />;
};

export default ManagementLocationPage;
