import React from 'react';
import Lazyload from '@/components/LazyLoad';

const CompanyPageLazy = React.lazy(
  () => import('@/pages/Management/Company/CompanyPage'),
);

const ManagementCompanyPage = () => {
  return <Lazyload component={CompanyPageLazy} />;
};

export default ManagementCompanyPage;