import React from 'react';

import Lazyload from '@/components/LazyLoad';

const VerifyEmailLazy = React.lazy(
  () => import('@/pages/VerifyEmail/VerifyEmail'),
);

const VerifyEmailPage = () => {
  return <Lazyload component={VerifyEmailLazy} />;
};

export default VerifyEmailPage;
