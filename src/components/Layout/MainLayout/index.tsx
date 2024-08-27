import { Outlet, useLocation } from 'react-router-dom';

import { DashboardSplashWebp } from '@/assets/images/dashboard';

import Sidebar from '@/components/Sidebar';
import Spinner from '@/components/Spinner';

import UnAuthorizedCard from '@/pages/ErrorPage/_component/UnAuthorizedCard';

import useGetNavigationList from '@/utils/hooks/useGetNavigationList';
import { ROUTES } from '@/utils/configs/route';

import LayoutWrapper from './_components/LayoutWrapper';

const MainLayout = () => {
  const location = useLocation();
  const isDashboardActive = location.pathname.includes('dashboard');
  const isBaseURLActive = location.pathname;

  const { navigationList, isLoading } = useGetNavigationList();

  const isHaveAccess = () => {
    let haveAccess = false;

    const excludedURL: string[] = [ROUTES.profile];

    if (excludedURL.includes(isBaseURLActive)) {
      return true;
    }

    navigationList?.forEach((navItem) => {
      const haveAllowedURL =
        navItem?.allowedUrl && navItem?.allowedUrl?.length > 0;
      const haveKiddos = navItem?.kiddos && navItem?.kiddos?.length > 0;

      // First check from the main URL
      if (navItem.url === isBaseURLActive) {
        haveAccess = true;
      }

      // if main URL have detail url page
      if (isBaseURLActive.startsWith(navItem.url)) {
        haveAccess = true;
      }

      // If still don't have access, check from the allowed URL
      if (haveAllowedURL && !haveAccess) {
        navItem?.allowedUrl?.forEach((url) => {
          if (isBaseURLActive === url) {
            haveAccess = true;
          }
        });
      }

      // If still don't have access, check from the kiddos
      if (haveKiddos && !haveAccess) {
        navItem?.kiddos?.forEach((kiddo) => {
          if (kiddo?.url === isBaseURLActive) {
            haveAccess = true;
          }
        });
      }
    });

    return haveAccess;
  };

  const haveAccess = isHaveAccess();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {isDashboardActive || haveAccess ? (
        <LayoutWrapper
          className={`flex flex-row gap-5 bg-cover bg-fixed bg-no-repeat p-4`}
          style={{
            backgroundImage: isDashboardActive
              ? `url(${DashboardSplashWebp})`
              : `none`,
          }}
        >
          <Sidebar />
          <div className="flex-grow overflow-auto">
            <Outlet />
          </div>
        </LayoutWrapper>
      ) : (
        <div
          className={`flex flex-row gap-5 bg-cover bg-fixed bg-no-repeat p-4`}
        >
          <UnAuthorizedCard />
        </div>
      )}
    </>
  );
};

export default MainLayout;
