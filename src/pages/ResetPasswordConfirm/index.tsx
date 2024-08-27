import React from 'react';

import Lazyload from '@/components/LazyLoad';

const ResetPasswordConfirmLazy = React.lazy(
  () => import('@/pages/ResetPasswordConfirm/ResetPasswordConfirm'),
);

const ResetPasswordConfirmPage = () => {
  return <Lazyload component={ResetPasswordConfirmLazy} />;
};

export default ResetPasswordConfirmPage;
