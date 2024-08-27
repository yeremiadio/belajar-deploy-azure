import { Outlet, useLocation, Navigate } from 'react-router-dom';

import { ROUTES } from '@/utils/configs/route';
import useDefaultRouteUser from '@/utils/hooks/useDefaultRouteUser';

import { loadCookie } from '@/services/cookie';

const Redirector = () => {
  const { pathname, search } = useLocation();
  // if the url query includes token, then let it in first (if the token is not valid, will redirect to login)
  const authenticated = !!loadCookie('token') || search.includes('token');
  const needToResetPwd = loadCookie('reset_pass') === 'true';

  const pathnameIsBaseURL =
    ROUTES.base.replace(/\/+$/, '') === pathname.replace(/\/+$/, '');
  const defaultRoute = useDefaultRouteUser();

  switch (pathname) {
    case ROUTES.login:
      if (authenticated && !needToResetPwd) {
        return <Navigate to={defaultRoute} />;
      }
      break;
    case ROUTES.resetPassword:
      if (authenticated) {
        return <Navigate to={defaultRoute} />;
      }
      break;
    case ROUTES.confirmResetPassword:
      return <Outlet />;
    case ROUTES.verifyEmail:
      return <Outlet />;
    default:
      if (!authenticated) {
        return <Navigate to={ROUTES.login} />;
      }

      if (authenticated && pathnameIsBaseURL) {
        // if authenticated and pathname is /dashboard or /dashboard/ then redirect to default route by role
        return <Navigate to={defaultRoute} />;
      }
      break;
  }

  return <Outlet />;
};

export default Redirector;
