import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const TagPageLazy = lazy(() => import('@/pages/Management/Tag/TagPage'));

const ManagementTagPage = () => {
  return <Lazyload component={TagPageLazy} />;
};

export default ManagementTagPage;
