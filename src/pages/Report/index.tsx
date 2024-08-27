import React from 'react';
import Lazyload from '@/components/LazyLoad';

const ReportLazy = React.lazy(() => import('@/pages/Report/Report'));

const ReportPage = () => {
  return <Lazyload component={ReportLazy} />;
};

export default ReportPage;
