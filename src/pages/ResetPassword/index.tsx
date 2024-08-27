import React from 'react';

import Lazyload from '@/components/LazyLoad';

const ResetPasswordLazy = React.lazy(
  () => import('@/pages/ResetPassword/ResetPassword'),
);

const ResetPasswordPage = () => {
  return <Lazyload component={ResetPasswordLazy} />;
};

export default ResetPasswordPage;
