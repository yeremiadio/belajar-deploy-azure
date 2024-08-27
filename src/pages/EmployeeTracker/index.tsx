import React from "react";
import Lazyload from "@/components/LazyLoad";

const EmployeeTrackerLazy = React.lazy(
  () => import("@/pages/EmployeeTracker/EmployeeTracker")
);

const EmployeeTrackerPage = () => {
  return <Lazyload component={EmployeeTrackerLazy} />;
};

export default EmployeeTrackerPage;
