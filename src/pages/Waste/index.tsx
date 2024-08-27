import React from 'react';

import Lazyload from '@/components/LazyLoad';

const WasteLazy = React.lazy(
  () => import("@/pages/Waste/WastePage")
);

const WastePage = () => {
  return <Lazyload component={WasteLazy} />;
};

export default WastePage;
