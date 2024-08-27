import { lazy } from "react";

import Lazyload from "@/components/LazyLoad";

const LoginLazy = lazy(() => import("@/pages/Login/LoginPage"));

const LoginPage = () => {
  return <Lazyload component={LoginLazy} />;
};

export default LoginPage;
