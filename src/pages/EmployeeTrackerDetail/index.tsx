import { lazy } from "react";
import Lazyload from "@/components/LazyLoad";

const EmployeeTrackerDetailLazy = lazy(
  () => import("@/pages/EmployeeTrackerDetail/EmployeeTrackerDetail")
);

const EmployeeTrackerDetailPage = () => {
  return <Lazyload component={EmployeeTrackerDetailLazy} />;
};

export default EmployeeTrackerDetailPage;
