import { lazy } from 'react';

import Lazyload from '@/components/LazyLoad';

const ProfilePageLazy = lazy(() => import('@/pages/Profile/Profile'));

const ProfilePage = () => {
  return <Lazyload component={ProfilePageLazy} />;
};

export default ProfilePage;
