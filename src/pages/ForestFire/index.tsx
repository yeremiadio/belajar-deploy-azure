import React from 'react';

import Lazyload from '@/components/LazyLoad';

const ForestFireLazy = React.lazy(
  () => import("@/pages/ForestFire/ForestFire")
);

const ForestFirePage = () => {
  return <Lazyload component={ForestFireLazy} />;
};

export default ForestFirePage;
